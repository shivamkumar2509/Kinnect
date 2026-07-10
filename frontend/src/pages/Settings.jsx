import React from "react";

const Settings = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Settings</h2>

      {/* Profile Settings */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Profile Settings</h5>
          <hr />

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="showEmail"
            />
            <label className="form-check-label" htmlFor="showEmail">
              Show email on profile
            </label>
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="showFollowers"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="showFollowers">
              Show followers count
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="showFollowings"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="showFollowings">
              Show followings count
            </label>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Privacy</h5>
          <hr />

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="privateAccount"
            />
            <label className="form-check-label" htmlFor="privateAccount">
              Private account
            </label>
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="allowMessages"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="allowMessages">
              Allow direct messages
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="showOnline"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="showOnline">
              Show online status
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Notifications</h5>
          <hr />

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="likes"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="likes">
              Likes notifications
            </label>
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="comments"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="comments">
              Comments notifications
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="followers"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="followers">
              New follower notifications
            </label>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Appearance</h5>
          <hr />

          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="darkMode" />
            <label className="form-check-label" htmlFor="darkMode">
              Dark mode
            </label>
          </div>
        </div>
      </div>

      {/* Content Preferences */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Content Preferences</h5>
          <hr />

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="autoPlay"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="autoPlay">
              Auto-play videos
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="sensitiveContent"
            />
            <label className="form-check-label" htmlFor="sensitiveContent">
              Hide sensitive content
            </label>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Security</h5>
          <hr />

          <button className="btn btn-outline-primary me-2">
            Change Password
          </button>

          <button className="btn btn-outline-secondary">Manage Sessions</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-danger">
        <div className="card-body">
          <h5 className="text-danger">Danger Zone</h5>
          <hr />

          <button className="btn btn-outline-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
