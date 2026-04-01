import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import socket from "../../services/socket.service";
import "./videoCall.css";
const VideoCall = () => {
  const { userId: remoteUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* userefs */
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const isCallerRef = useRef(false);

  /* states */
  const [isCalling, setIsCalling] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [isInCall, setIsInCall] = useState(false);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(false);

  const [error, setError] = useState("");

  /* socket */
  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  /* caller */
  useEffect(() => {
    if (location.state?.isCaller) {
      isCallerRef.current = true;
      setIsCalling(true);
    }
  }, [location.state]);

  /* media */
  const getMedia = async () => {
    if (localStreamRef.current) return localStreamRef.current;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      setError("Camera or microphone permission denied");
      return null;
    }
  };

  /*attach local video cal */
  useEffect(() => {
    if (isInCall && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.muted = true;
      localVideoRef.current.play().catch(() => {});
    }
  }, [isInCall]);

  /* peer */
  const createPeer = (remoteId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // send local track
    localStreamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current);
    });

    // receive remote track
    peer.ontrack = (e) => {
      const stream = e.streams[0];
      if (!stream) return;

      remoteVideoRef.current.srcObject = stream;
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.play().catch(() => {});

      const videoTrack = stream.getVideoTracks()[0];
      setIsRemoteVideoOn(!!videoTrack);

      if (videoTrack) {
        videoTrack.onmute = () => setIsRemoteVideoOn(false);
        videoTrack.onunmute = () => setIsRemoteVideoOn(true);
      }
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("webrtc:ice", {
          to: remoteId,
          candidate: e.candidate,
        });
      }
    };

    return peer;
  };

  /* call flow */
  const createOffer = async () => {
    peerRef.current = createPeer(remoteUserId);
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    socket.emit("webrtc:offer", { to: remoteUserId, offer });
  };

  const acceptCall = async () => {
    isCallerRef.current = false;
    socket.emit("call:accept", { to: remoteUserId });

    await getMedia();
    setIsIncoming(false);
    setIsInCall(true);
  };

  const endCall = () => {
    socket.emit("call:end", { to: remoteUserId });
    cleanup();
  };

  /* socket events */
  useEffect(() => {
    socket.on("call:incoming", () => {
      isCallerRef.current = false;
      setIsIncoming(true);
      setIsCalling(false);
    });

    socket.on("call:accepted", async () => {
      if (!isCallerRef.current) return;

      await getMedia();
      await createOffer();
      setIsCalling(false);
      setIsInCall(true);
    });

    socket.on("webrtc:offer", async ({ from, offer }) => {
      if (isCallerRef.current) return;

      await getMedia();
      peerRef.current = createPeer(from);
      await peerRef.current.setRemoteDescription(offer);

      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socket.emit("webrtc:answer", { to: from, answer });
      setIsIncoming(false);
      setIsInCall(true);
    });

    socket.on("webrtc:answer", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(answer);
    });

    socket.on("webrtc:ice", async ({ candidate }) => {
      await peerRef.current?.addIceCandidate(candidate);
    });

    socket.on("call:ended", cleanup);

    return () => socket.removeAllListeners();
  }, []);

  /* controls */
  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setIsVideoOn(track.enabled);

    //  send update to remote
    const sender = peerRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");

    if (sender) sender.replaceTrack(track);
  };

  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setIsMuted(!track.enabled);

    //  send update to remote
    const sender = peerRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "audio");

    if (sender) sender.replaceTrack(track);
  };

  /*cleanup */
  const cleanup = () => {
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setIsCalling(false);
    setIsIncoming(false);
    setIsInCall(false);
    setIsVideoOn(true);
    setIsMuted(false);
    setIsRemoteVideoOn(false);
    setError("");

    navigate("/chat", { replace: true });
  };

  /* UI */
  return (
    <div className="call-container">
      {error && <p className="error">{error}</p>}

      {isCalling && <div className="status">Calling…</div>}

      {isIncoming && (
        <div className="incoming">
          <h3>Incoming Call</h3>
          <div className="incoming-actions">
            <button className="accept" onClick={acceptCall}>
              Accept
            </button>
            <button className="reject" onClick={endCall}>
              Reject
            </button>
          </div>
        </div>
      )}

      {isInCall && (
        <>
          {/* remote video */}
          <div className="remote-video">
            {isRemoteVideoOn ? (
              <video ref={remoteVideoRef} autoPlay playsInline />
            ) : (
              <div className="placeholder">User Camera Not Available</div>
            )}
          </div>

          {/* local video */}
          <div className="local-video">
            {isVideoOn ? (
              <video ref={localVideoRef} autoPlay muted playsInline />
            ) : (
              <div className="placeholder small">Camera Off</div>
            )}
          </div>

          {/* controls */}
          <div className="controls">
            <button onClick={toggleVideo}>
              {isVideoOn ? "🎥 Off" : "🎥 On"}
            </button>

            <button onClick={toggleMute}>
              {isMuted ? "🔈 Unmute" : "🔇 Mute"}
            </button>

            <button className="end" onClick={endCall}>
              ❌ End
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default VideoCall;
