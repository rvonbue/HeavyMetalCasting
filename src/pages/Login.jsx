import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import './Login.css';
import { Button_A } from "../components/Resuables";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // Replace with real login logic
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
