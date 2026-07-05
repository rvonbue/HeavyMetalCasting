import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import './Login.css';
import { Button_A } from "../components/Resuables";

function LoginPage() {
  const navigate = useNavigate();
  const authUser = useSelector(state => state.auth.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Redirect to shop if already logged in
    if (authUser) {
      navigate('/shop');
    }
  }, [authUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to create_account which handles both signup and signin
    navigate('/create_account');
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
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button_A button_name="LOG IN" link_val="/" button_type="form" button_styles_outer={{ marginTop: "1.5rem"}}/>  
      </form>
    </div>
  );
}

export default LoginPage;
