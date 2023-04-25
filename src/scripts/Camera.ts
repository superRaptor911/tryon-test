const videoConfig = {
  video: true,
};

export const setupCameraStream = async (
  videoElement: HTMLVideoElement
): Promise<[number, number]> => {
  // prettier-ignore
  if (!("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices)) {
    throw "Camera not supported";
  }

  const videoStream = await navigator.mediaDevices.getUserMedia(videoConfig);
  const { width, height } = videoStream.getTracks()[0].getSettings();
  console.log("videoStream", videoStream.getTracks().length);
  console.log(width, height); // 640x480

  videoElement.srcObject = videoStream;
  // videoElement.width = videoConfig.video.width;
  // videoElement.height = videoConfig.video.height;
  if (width != null && height != null) {
    videoElement.width = width;
    videoElement.height = height;
    return [width, height];
  }

  return [0, 0];
};
