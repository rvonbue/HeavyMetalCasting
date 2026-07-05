import { supabase } from '../lib/supabase';
import { sendVerificationEmail, sendPasswordResetEmail } from './brevoAPI';

// Sign up with email and password
export async function signUpWithEmail(email, password, fullName = '') {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
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
    await sendVerificationEmail(email, verificationToken);

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
      options: {
        // Keep session for 30 days
        expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
      },
    });

    if (error) throw error;

    // Update last login
    const userProfile = await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.user.id)
      .select()
      .single();

    // Return complete user object with profile data
    return {
      success: true,
      user: { ...data.user, role: userProfile.data?.role },
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    // Also send via Brevo for backup
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await sendPasswordResetEmail(email, resetToken);

    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    throw new Error(error.message || 'Failed to request password reset');
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
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!data.user) return null;

    // Get user record with role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return { ...data.user, role: userData?.role };
  } catch (error) {
    console.error('Failed to get current user:', error);
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
