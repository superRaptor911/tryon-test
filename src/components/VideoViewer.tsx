import { useEffect, useRef } from "react";
import { setupCameraStream } from "../scripts/Camera";
import { DisplayVideo } from "../scripts/videoPlayer";

const VideoViewer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  // Init Video player
  const initVideoPlayer = async () => {
    if (videoRef.current == null || canvasRef.current == null) return;

    canvasRef.current.width = 1280;
    canvasRef.current.height = 720;

    const videoEl = videoRef.current;
    await setupCameraStream(videoEl);
    const gl = canvasRef.current.getContext("webgl2");
    if (gl == null) throw "Failed to get webgl2 context";

    DisplayVideo(gl, videoEl, animationIdRef);
  };

  useEffect(() => {
    initVideoPlayer().catch((err) => {
      console.log(err);
    });

    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  return (
    <div>
      <video autoPlay ref={videoRef} style={{ width: 0, height: 0 }} />
      <canvas ref={canvasRef} style={{ width: 1280, height: 720 }} />
    </div>
  );
};

export default VideoViewer;
