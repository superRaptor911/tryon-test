import { useEffect, useRef } from "react";
import { setupCameraStream } from "../scripts/Camera";
import { DisplayVideo } from "../scripts/videoPlayer";

let [width, height] = [0, 0];
export const getScreenDim = () => [width, height];

const VideoViewer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  // Init Video player
  const initVideoPlayer = async () => {
    if (videoRef.current == null || canvasRef.current == null) return;

    const videoEl = videoRef.current;
    [width, height] = await setupCameraStream(videoEl);

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const gl = canvasRef.current.getContext("webgl2");
    if (gl == null) throw "Failed to get webgl2 context";

    await DisplayVideo(gl, videoEl, animationIdRef);
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
      <canvas
        ref={canvasRef}
        // style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      />
    </div>
  );
};

export default VideoViewer;
