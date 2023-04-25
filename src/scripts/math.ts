import { Entity3D, Model } from "@super_raptor911/render3d";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { mat4, quat, vec3 } from "gl-matrix";

export const calculateAngles = (point1: vec3, point2: vec3): vec3 => {
  // Calculate the vector from point1 to point2
  const v = vec3.subtract(vec3.create(), point2, point1);

  // Normalize the vector
  const u = vec3.normalize(vec3.create(), v);

  // Calculate the Euler angles
  const phi = Math.atan2(u[1], u[0]);
  const theta = Math.atan2(u[2], Math.sqrt(u[0] * u[0] + u[1] * u[1]));
  const psi = Math.atan2(
    u[0] * Math.cos(phi) + u[1] * Math.sin(phi),
    -u[0] * Math.sin(phi) + u[1] * Math.cos(phi)
  );

  return vec3.fromValues(phi, theta, psi);
};

export const applyBoneRotations = (
  model: Model,
  keypoints: Keypoint[]
): void => {
  const rightShoulder = vec3.fromValues(
    keypoints[12].x,
    keypoints[12].y,
    keypoints[12].z as number
  );

  const rightElbow = vec3.fromValues(
    keypoints[14].x,
    keypoints[14].y,
    keypoints[14].z as number
  );

  const rightHand = vec3.fromValues(
    keypoints[16].x,
    keypoints[16].y,
    keypoints[16].z as number
  );

  const leftShoulder = vec3.fromValues(
    keypoints[11].x,
    keypoints[11].y,
    keypoints[11].z as number
  );

  const leftElbow = vec3.fromValues(
    keypoints[13].x,
    keypoints[13].y,
    keypoints[13].z as number
  );

  const leftHand = vec3.fromValues(
    keypoints[15].x,
    keypoints[15].y,
    keypoints[15].z as number
  );

  // console.log(rightShoulder[2]);
  const rtAng = calculateAngles(rightElbow, rightShoulder);
  const rbAng = calculateAngles(rightHand, rightElbow);

  const ltAng = calculateAngles(leftShoulder, leftElbow);
  const lbAng = calculateAngles(leftElbow, leftHand);

  setBoneAbsoluteRotation(model.bones[3], rtAng[1], 1.54, 1.54 - rtAng[0]);
  setBoneAbsoluteRotation(model.bones[4], rbAng[1], 0, 1.54 - rbAng[0]);

  setBoneAbsoluteRotation(model.bones[6], -ltAng[1], -1.54, -(1.54 + ltAng[0]));
  setBoneAbsoluteRotation(model.bones[7], -lbAng[1], 0, -(1.54 + lbAng[0]));
  model._bonesModified = true;
};

export const angleToRad = (angle: number): number => {
  return (angle * Math.PI) / 180;
};

export const radToAngle = (rad: number): number => {
  return (rad * 180) / Math.PI;
};

export const quatToEuler = (quat: quat): vec3 => {
  const euler = vec3.create();
  vec3.set(
    euler,
    Math.atan2(
      2 * (quat[1] * quat[2] + quat[3] * quat[0]),
      quat[3] * quat[3] -
        quat[0] * quat[0] -
        quat[1] * quat[1] +
        quat[2] * quat[2]
    ),
    Math.asin(-2 * (quat[0] * quat[2] - quat[3] * quat[1])),
    Math.atan2(
      2 * (quat[0] * quat[1] + quat[3] * quat[2]),
      quat[3] * quat[3] +
        quat[0] * quat[0] -
        quat[1] * quat[1] -
        quat[2] * quat[2]
    )
  );
  return euler;
};

export const setBoneAbsoluteRotation = (
  bone: Entity3D,
  x: number,
  y: number,
  z: number
): void => {
  const position = vec3.create();
  const scale = vec3.create();
  const trans = mat4.create();
  mat4.multiply(trans, bone.wMatrix, bone.mMatrix);
  mat4.getTranslation(position, trans);
  mat4.getScaling(scale, trans);

  mat4.invert(bone.wMatrix, bone.wMatrix);
  bone.setRotation(x, y, z);
  bone.setPosition(position[0], position[1], position[2]);
  bone.setScale(scale[0], scale[1], scale[2]);
  bone._update();
  mat4.multiply(bone.mMatrix, bone.wMatrix, bone.mMatrix);
};
