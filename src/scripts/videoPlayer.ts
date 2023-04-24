import {
  Rectangle,
  RectRenderer,
  updateTextureFromMedia,
  Model,
  ModelRenderer,
  Camera3D,
  Line,
  LineRenderer,
} from "@super_raptor911/render3d";
import { loadModel } from "@super_raptor911/webgl-gltf";
import { Pose } from "@tensorflow-models/pose-detection";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constant";
import { applyBoneRotations } from "./math";
import { initMovenet } from "./movenet";

const createLines = (count: number): Line[] => {
  const lines: Line[] = [];

  for (let i = 0; i < count; i++) {
    lines.push(new Line(0, 0, 0, 0));
  }

  return lines;
};

const lineConfig = [
  [8, 6, 5, 4, 0, 1, 2, 3, 7],
  [16, 14, 12, 24, 23, 11, 13, 15],
  [12, 11],
];

const updateLines = (lines: Line[], pose: Pose): void => {
  let lineIdx = 0;
  lineConfig.forEach((config) => {
    for (let i = 0; i < config.length - 1; i++) {
      const pointA = pose.keypoints[config[i]];
      const pointB = pose.keypoints[config[i + 1]];
      const x1 = pointA.x / SCREEN_WIDTH;
      const y1 = pointA.y / SCREEN_HEIGHT;
      const x2 = pointB.x / SCREEN_WIDTH;
      const y2 = pointB.y / SCREEN_HEIGHT;
      lines[lineIdx].setPoints(x1, y1, x2, y2);
      lineIdx++;
    }
  });
};

const getWidth = (pose: Pose): number => {
  const left = pose.keypoints[11].x;
  const right = pose.keypoints[12].x;
  return -(right - left) / SCREEN_WIDTH;
};

const getPosePosition = (pose: Pose): [number, number] => {
  const x = (pose.keypoints[11].x + pose.keypoints[12].x) / (2 * SCREEN_WIDTH);
  const y = pose.keypoints[11].y / SCREEN_HEIGHT;
  return [x, y];
};

export const DisplayVideo = async (
  gl: WebGL2RenderingContext,
  video: HTMLVideoElement,
  animationIdRef: React.MutableRefObject<number>
): Promise<void> => {
  gl.clearColor(0.3, 0.3, 0.3, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const rect = new Rectangle(0, 0, 1, 1);
  const renderer = new RectRenderer(gl);

  const texture = gl.createTexture();
  if (texture == null) throw "Failed to create texture";

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  rect.texture = texture;

  let isPlaying = false;
  video.onplaying = () => {
    isPlaying = true;
  };

  const detector = await initMovenet();

  const model = await loadModel(gl, "models/base/human.gltf");
  const robot = new Model(model);

  const cam = new Camera3D();
  const modelRender = new ModelRenderer(gl, cam);

  const lines = createLines(33);
  const lineRenderer = new LineRenderer(gl);

  lines.forEach((line) => {
    line.setDepth(0.1);
  });

  // cam.translateZ(3);
  cam.translateY(0);
  // robot.translateX(3);
  robot.setScale(10, 10, 10);
  robot.setPosition(0, -3, 0);

  const draw = async (): Promise<void> => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    updateTextureFromMedia(gl, texture, video);
    // const image = getTensorFromTexture(gl, texture);

    // lineRenderer.draw(lines[30]);
    renderer.draw(rect);

    lines.forEach((line) => {
      lineRenderer.draw(line);
    });

    modelRender.draw(robot);
    const timestamp = performance.now();
    const poses = await detector.estimatePoses(video, undefined, timestamp);
    if (poses.length > 0) {
      const pose = poses[0];
      const width = getWidth(pose);
      const scale = (width / 0.2) * 10;
      robot.setScale(scale, scale, scale);
      const posePos = getPosePosition(pose);
      console.log(`y: ${posePos[1]}`);
      // robot.setPosition(0, -(posePos[1] - 1) / 0.25, 0);
      updateLines(lines, pose);
      if (pose.keypoints3D != null) {
        applyBoneRotations(robot, pose.keypoints3D);
      }
    }

    animationIdRef.current = requestAnimationFrame(draw);
  };

  draw().catch((e) => {
    console.error("videoPlayer::", e);
  });
};
