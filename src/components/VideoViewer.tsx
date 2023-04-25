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
      console.log("cancelAnimationFrame::", animationIdRef.current);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  return (
    <div>
      <video autoPlay ref={videoRef} style={{ width: 0, height: 0 }} />
      <canvas ref={canvasRef} />
      <div>
        <input type="number" id="ypos" placeholder="ypos" step={0.05} />
        <input type="number" id="xpos" placeholder="xpos" step={0.05} />
        <input
          type="number"
          id="scale"
          placeholder="scale"
          step={0.05}
          min={1}
        />
        <input type="number" id="offset" placeholder="offset" step={0.05} />
      </div>
    </div>
  );
};

export default VideoViewer;
