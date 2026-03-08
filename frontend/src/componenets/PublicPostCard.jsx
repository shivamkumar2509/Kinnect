import React from "react";

const PublicPostCard = ({ post }) => {
  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={post.image?.url}
          className="card-img-top post-img"
          alt={post.user?.username || "user post"}
        />
      </div>
    </>
  );
};

export default PublicPostCard;
