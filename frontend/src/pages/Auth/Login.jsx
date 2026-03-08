import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      alert("login successful");
      navigate("/", { replace: true });
      // replace:true->Prevents going back to /login with browser back button
    } catch (err) {
      alert(err.response?.data?.message || "login failed");
      // ?. ->optional chainning
      //If response exists → go inside
      //If data exists → go inside
      //Otherwise → return undefined (no crash)
    }
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  return (
    <>
      <div className="login-wrapper">
        <div className="login-card">
          <h2 className="login-title">Welcome Back </h2>
          <p className="login-subtitle">Login to continue</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
              }}
              className="login-input"
            />
            <input
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
              className="login-input"
            />
            <button className="btn btn-primary w-100 mt-3" type="submit">
              Login
            </button>
          </form>
          <button className="signup-link" onClick={handleSignup}>
            Don’t have an account?
            <span> Signup</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
