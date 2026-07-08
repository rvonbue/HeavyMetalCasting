import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import './Login.css';
import { signInWithEmail, getCurrentUser } from '../api/authAPI';
import { Button_A } from '../components/Resuables';
import { setUser } from '../store/userSlice';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      const user = await getCurrentUser();
      if (user) {
        dispatch(setUser(user));
      }
      toast.success('Signed in successfully');
      navigate('/shop');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign in or
          <NavLink
           to="/create_account" end
           style={{color: "var(--theme-text-color-B)", textDecoration: "underline", paddingLeft: "8px" }}
          >
            create an account.
          </NavLink>
        </h2>

        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <Button_A
          button_name={isLoading ? 'Signing In...' : 'LOG IN'}
          button_type="form"
          button_styles_outer={{ marginTop: '1.5rem' }}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}

export default LoginPage;
