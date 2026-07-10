import { useState } from "react";
import "./AiChatBot.css";

const AiChatBot = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="ai-page">
      {/* Background Effects */}
      <div className="grid-bg"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Header */}
      <div className="ai-header">
        <div>
          <h2>Neural Assistant</h2>
          <span>AI Command Center</span>
        </div>

        <div className="status-panel">
          <span className="status-dot"></span>
          Online
        </div>
      </div>

      <div className="ai-layout">
        {/* Left */}
        <div className="left-panel glass">
          <h5>Memory Stream</h5>

          <div className="memory-card">User Profile Context</div>

          <div className="memory-card">Previous Conversations</div>

          <div className="memory-card">Recent Activity</div>
        </div>

        {/* Center Chat */}
        <div className="chat-container glass">
          <div className="ai-core">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay"></div>

            <div className="core-center">AI</div>
          </div>

          <div className="chat-stream">
            <div className="message ai">
              Hello. I'm analyzing your environment.
            </div>

            <div className="message user">Show me today's insights.</div>

            <div className="message ai">Processing historical patterns...</div>
          </div>

          <div className="input-dock">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Talk to your AI..."
            />

            <button>⚡</button>
          </div>
        </div>

        {/* Right */}
        <div className="right-panel glass">
          <h5>AI Modules</h5>

          <div className="module">
            <span>🧠 Reasoning</span>
            <div className="active-pill">Active</div>
          </div>

          <div className="module">
            <span>📚 Memory</span>
            <div className="active-pill">Ready</div>
          </div>

          <div className="module">
            <span>⚡ Prediction</span>
            <div className="active-pill">Running</div>
          </div>

          <div className="module">
            <span>🌐 Knowledge</span>
            <div className="active-pill">Live</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatBot;
