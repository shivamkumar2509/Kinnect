import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <aside
      className="border-end bg-white shadow-sm"
      style={{
        position: "fixed",
        top: "70px", // Adjust according to navbar height
        left: 0,
        width: "260px",
        height: "calc(100vh - 70px)",
        zIndex: 1000,
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <ul className="nav nav-pills flex-column gap-2 h-100">
        <li className="nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "text-dark"}`
            }
          >
            🏠 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/selfProfile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "text-dark"}`
            }
          >
            👤 Profile
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "text-dark"}`
            }
          >
            💬 Chat
          </NavLink>
        </li>

        {/* Bottom Section */}
        <li className="nav-item mt-auto">
          <button
            onClick={() => navigate("/ai-chat")}
            className="w-100 border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #0d6efd, #6610f2)",
              borderRadius: "14px",
              padding: "12px",
              fontWeight: "600",
              boxShadow: "0 6px 15px rgba(13,110,253,.25)",
              transition: "all 0.3s ease",
            }}
          >
            🤖 AI Chat Assistant
          </button>
        </li>

        <li className="nav-item mt-3">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100"
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
