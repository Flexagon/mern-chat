import React from 'react';
import { Link } from 'react-router-dom';

const Auth = () => (
  <div className="Auth">
    <h1>Welcome to MERN-chat</h1>
    <div className="Auth-links">
      <Link className="Auth-link" to="/register">Register</Link>
      <span>or</span>
      <Link className="Auth-link" to="/login">Login</Link>
    </div>
  </div>
);

export default Auth;
