import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const UploadPost = () => {
  const [image, setImage] = useState(null);
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !country) {
      return alert("All fields are required");
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("country", country);

    try {
      await API.post("/users/me/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post uploaded successfully");
      setImage(null);
      setCountry("");
      navigate("/selfProfile");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to upload post");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h4 className="mb-4 text-center">Upload Post</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Upload Post</label>

          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100">Upload</button>
      </form>
    </div>
  );
};

export default UploadPost;
