import React from "react";
const UserAvatar = ({ avatar, username, size = 40, onClick }) => {
  return avatar ? (
    <img
      src={avatar}
      onError={(e) => (e.target.style.display = "none")}
      alt={username}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        cursor: "pointer",
        display: "block",
      }}
    />
  ) : (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#0d6efd",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        fontSize: size / 2,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {username?.[0]?.toUpperCase()}
    </div>
  );
};

export default UserAvatar;
