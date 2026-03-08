import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("Signup Successful");
      navigate("/", { replace: true });
    } catch (e) {
      alert(e.response?.data?.message || "Signup failed");
    }
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="signUp-wrapper">
        <div className="signUp-card">
          <p className="signUp-subtitle">Signup to continue</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
              }}
              className="signUp-input"
            />

            <input
              type="email"
              placeholder="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
              }}
              className="signUp-input"
            />

            <input
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
              className="signUp-input"
            />
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Signup
            </button>
          </form>
          <button className="login-link" onClick={handleLogin}>
            move to login -{">"}
            <span>Login</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
