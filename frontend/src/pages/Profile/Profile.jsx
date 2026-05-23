import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import PublicPostCard from "../../componenets/PublicPostCard";
import UserAvatar from "../../componenets/UserAvatar";
import ShowFollowers from "./ShowFollowers";
import ShowFollowing from "./ShowFollowing";

const Profile = () => {
  const { userId } = useParams();

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          API.get(`/users/${userId}`),
          API.get(`/users/${userId}/posts`),
        ]);
        const myProfile = await API.get(`/users/me`);
        // console.log("my profile:-->", myProfile);
        setMyProfile(myProfile.data.user._id);
        setProfile(profileRes.data.user);
        setPosts(postsRes.data.posts || []);
      } catch (e) {
        console.log("profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      if (profile?.isFollowing) {
        await API.post(`/users/unfollow/${userId}`);
      } else {
        await API.post(`/users/follow/${userId}`);
      }

      const res = await API.get(`/users/${userId}`);
      setProfile(res.data.user);
    } catch (e) {
      console.log("follow toggle error:", e);
    }
  };

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (!profile) return <h3>User not found</h3>;

  return (
    <div
      className="container mt-5"
      style={{
        position: "relative",
        zIndex: 1000, //
      }}
    >
      {/* PROFILE HEADER */}
      <div className="row align-items-center">
        <div className="col-md-4 text-center">
          <UserAvatar
            avatar={profile?.avatar?.url}
            username={profile?.username}
            size={200}
          />
        </div>

        <div className="col-md-8">
          <h2>{profile?.username}</h2>

          <div className="d-flex gap-4 mt-3" style={{ cursor: "pointer" }}>
            <div>
              <strong>{posts.length}</strong>
              <div>Posts</div>
            </div>

            <div
              onClick={() => {
                console.log("clicked followers");
                setShowFollowers(true);
              }}
              style={{
                cursor: "pointer",
                position: "relative",
                zIndex: 2000, //
                pointerEvents: "auto",
              }}
            >
              <strong>{profile?.followersCount}</strong>
              <div>Followers</div>
            </div>

            <div
              onClick={() => {
                console.log("clicked following");
                setShowFollowing(true);
              }}
              style={{
                cursor: "pointer",
                position: "relative",
                zIndex: 2000, //
                pointerEvents: "auto",
              }}
            >
              <strong>{profile?.followingCount}</strong>
              <div>Following</div>
            </div>
          </div>

          {myProfile !== userId && (
            <div className="mt-3">
              <button
                className={`btn ${
                  profile?.isFollowing ? "btn-outline-danger" : "btn-primary"
                }`}
                onClick={handleFollowToggle}
              >
                {profile?.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* POSTS GRID */}
      <div className="row g-4 mt-2">
        {posts.map((post) => (
          <div className="col-md-4" key={post._id}>
            <PublicPostCard post={post} />
          </div>
        ))}
      </div>

      {/* RIGHT SIDEBARS */}
      {showFollowers && (
        <ShowFollowers
          userId={userId}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <ShowFollowing
          userId={userId}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
};

export default Profile;
