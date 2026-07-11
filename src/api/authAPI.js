import { supabase } from '../lib/supabase';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailAPI';

// Sign up with email and password
export async function signUpWithEmail(email, password, fullName = '') {
  try {
    // Create auth user (Supabase auto-email disabled; using AWS SES instead)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationExpiresAt = new Date();
    verificationExpiresAt.setDate(verificationExpiresAt.getDate() + 1); // 24 hours

    // Create user record with customer role
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
          role: 'customer',
          verification_token: verificationToken,
          verification_expires_at: verificationExpiresAt.toISOString(),
        },
      ]);

    if (userError) throw userError;

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail signup if email fails, but log it
    }

    return {
      success: true,
      user: authData.user,
      message: 'Sign up successful! Please check your email to verify your account.',
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to sign up');
  }
}

// Sign in with email and password
export async function signInWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.user.id);

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

// Sign in with OAuth provider
export async function signInWithOAuth(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { success: true, url: data.url };
  } catch (error) {
    throw new Error(error.message || `Failed to sign in with ${provider}`);
  }
}

// Verify email with token
export async function verifyEmail(token) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('verification_token', token)
      .gt('verification_expires_at', new Date().toISOString())
      .single();

    if (error || !data) throw new Error('Invalid or expired verification link');

    // Mark email as verified
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        verification_token: null,
        verification_expires_at: null,
      })
      .eq('id', data.id);

    if (updateError) throw updateError;

    return { success: true, userId: data.id };
  } catch (error) {
    throw new Error(error.message || 'Failed to verify email');
  }
}

// Request password reset
export async function requestPasswordReset(email) {
  try {
    // Generate reset token (valid for 30 minutes)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Find user and store token
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      throw new Error('Email not found');
    }

    // Update user with reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_password_token: resetToken,
        reset_password_expires_at: expiresAt.toISOString(),
      })
      .eq('id', userData.id);

    if (updateError) throw updateError;

    // Send email via AWS SES
    await sendPasswordResetEmail(email, resetToken);

    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    throw new Error(error.message || 'Failed to request password reset');
  }
}

// Validate reset token
export async function validateResetToken(token) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('reset_password_token', token)
      .gt('reset_password_expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return { valid: false };
    }

    return { valid: true, userId: data.id };
  } catch (error) {
    return { valid: false };
  }
}

// Reset password with token
export async function resetPasswordWithToken(token, newPassword) {
  try {
    // Validate token first
    const validation = await validateResetToken(token);
    if (!validation.valid) {
      throw new Error('Invalid or expired reset token');
    }

    // Get user email for password update
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('reset_password_token', token)
      .single();

    if (userError || !userData) {
      throw new Error('User not found');
    }

    // Update Supabase auth password
    const { error: authError } = await supabase.auth.admin.updateUserById(
      validation.userId,
      { password: newPassword }
    );

    if (authError) throw authError;

    // Clear reset token
    const { error: clearError } = await supabase
      .from('users')
      .update({
        reset_password_token: null,
        reset_password_expires_at: null,
      })
      .eq('reset_password_token', token);

    if (clearError) throw clearError;

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    throw new Error(error.message || 'Failed to reset password');
  }
}

// Reset password with token
export async function resetPassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) throw error;

    return { success: true, message: 'Password reset successful' };
  } catch (error) {
    throw new Error(error.message || 'Failed to reset password');
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase.auth.getUser();
    if (error) return null;

    if (!data.user) return null;

    // Get user record with role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) return null;

    return { ...data.user, role: userData?.role };
  } catch (error) {
    return null;
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to get user');
  }
}
