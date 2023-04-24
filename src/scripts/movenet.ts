import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";

export const initMovenet = async (): Promise<poseDetection.PoseDetector> => {
  await tf.ready();
  console.log(tf.getBackend());
  const model = poseDetection.SupportedModels.BlazePose;
  const detectorConfig = {
    runtime: "tfjs",
    enableSmoothing: true,
    modelType: "full",
  };
  const detector = await poseDetection.createDetector(model, detectorConfig);
  return detector;
};

// export const getTensorFromTexture = (
//   gl: WebGL2RenderingContext,
//   texture: WebGLTexture
// ): tf.Tensor3D => {
//   const tensor = fromTexture(
//     gl,
//     texture,
//     { width: 1280, height: 720, depth: 3 },
//     { width: 256, height: 144, depth: 3 }
//   );

//   return tensor;
// };
