import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = () => {
  // const user = {
  //   username: "shivam kumar",
  //   avatar: "",
  // };
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(search);
    setSearch("");
    if (!search.trim()) {
      alert("Please enter a username");
      return;
    }
    try {
      const res = await API.get(`/users?name=${search}`);

      if (!res.data.exists) {
        alert("User not found");
      } else {
        const foundUser = res.data.user;

        navigate(`/profile/${foundUser._id}`);
      }
    } catch (e) {
      console.error("search error: ", e);
      alert("something went wrong");
    }
  };

  if (!user) {
    return null;
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="/logo.jpg"
              alt="logo"
              className="img-fluid"
              style={{ maxWidth: "60px" }}
            />
          </a>
          {/* <a className="navbar-brand" href="#">
            Register
          </a>
          <a className="navbar-brand" href="#">
            Login
          </a>
          <a className="navbar-brand" href="#">
            Logout
          </a> */}

          <div
            className="collapse navbar-collapse w-100"
            id="navbarSupportedContent"
          >
            <div className="mx-auto">
              <form className="d-flex" role="search" style={{ width: "400px" }}>
                <input
                  className="form-control me-3"
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </form>
            </div>

            <div className="ms-auto d-flex align-items-center me-3">
              <UserAvatar
                avatar={user.avatar?.url}
                username={user.username}
                size={40}
                onClick={() => {
                  navigate("/selfProfile");
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
