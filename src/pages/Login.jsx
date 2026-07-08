import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import './Login.css';
import { signInWithEmail } from '../api/authAPI';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
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

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--theme-button-bg)',
            color: 'var(--theme-button-text)',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Signing In...' : 'LOG IN'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
