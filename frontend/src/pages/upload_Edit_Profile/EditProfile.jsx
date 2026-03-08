import { useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();
  const DEFAULT_IMAGE =
    "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=256";

  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [existingUsername, setExistingUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("users/me");

        setExistingUsername(res.data.user.username);
        setNewUsername(res.data.user.username);

        // show existing avatar
        if (res.data.user.avatar?.url) {
          setProfileImage(res.data.user.avatar.url);
        }
      } catch (e) {
        console.log("editProfile error:", e);
      }
    };

    fetchUser();
  }, []);
  // upload new image (preview only)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const imageURL = URL.createObjectURL(file);
    setProfileImage(imageURL);
  };

  // remove image
  const handleRemoveImage = () => {
    setProfileImage(DEFAULT_IMAGE);
    setImageFile(null);
    setRemoveAvatar(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      if (newUsername) {
        formData.append("username", newUsername);
      }

      if (imageFile) {
        formData.append("avatar", imageFile);
      }

      if (removeAvatar) {
        formData.append("removeAvatar", true);
      }

      await API.put("/users/me", formData);

      await fetchMe();

      alert("Profile updated successfully");

      navigate("/selfProfile");
    } catch (e) {
      console.log(e);
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      {/* Profile Image Section */}
      <div className="text-center mb-4">
        <div className="position-relative d-inline-block">
          <img
            src={profileImage}
            alt="profile"
            className="rounded-circle"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
            }}
          />

          {/* upload icon */}
          <label
            htmlFor="upload"
            className="position-absolute bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              bottom: "5px",
              right: "5px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            📷
          </label>
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* Remove Image */}
        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleRemoveImage}
          >
            Remove Image
          </button>
        </div>
      </div>

      {/* Username Field */}
      <div className="mb-3">
        <label className="form-label">Existing Username</label>
        <input
          type="text"
          className="form-control"
          value={existingUsername}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </div>

      {/* Save Button (UI only) */}
      <button className="btn btn-primary w-100" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
