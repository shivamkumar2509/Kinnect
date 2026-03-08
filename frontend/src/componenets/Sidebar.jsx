import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [active, setActive] = useState("");
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("logout failed", e);
    }
  };
  return (
    <div
      className="sidebar d-flex flex-column p-3 mt-2 border-end fixed"
      // style={{ minHeight: "calc(100vh - 70px)" }}
    >
      <ul className="nav nav-pills flex-column gap-2 h-100">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{ cursor: "pointer" }}
          >
            🏠 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/selfProfile"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{ cursor: "pointer" }}
          >
            👤 Profile
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{ cursor: "pointer" }}
          >
            💬 Chat
          </NavLink>
        </li>

        {/* <li className="nav-item">
          <a
            to={() => {
              navigate("/VideoCall");
            }}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            📞 Calls
          </a>
        </li> */}

        <li className="nav-item mt-auto">
          <span
            onClick={handleLogout}
            className="nav-link text-danger"
            style={{ cursor: "pointer" }}
          >
            🚪 Logout
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
