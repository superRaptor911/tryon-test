const videoConfig = {
  video: {
    width: 1280,
    height: 720,
  },
};

export const setupCameraStream = async (
  videoElement: HTMLVideoElement
): Promise<void> => {
  // prettier-ignore
  if (!("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices)) {
    throw "Camera not supported";
  }

  const videoStream = await navigator.mediaDevices.getUserMedia(videoConfig);
  videoElement.srcObject = videoStream;
  videoElement.width = videoConfig.video.width;
  videoElement.height = videoConfig.video.height;
};
