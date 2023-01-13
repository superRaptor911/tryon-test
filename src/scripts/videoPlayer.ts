import {
  Rectangle,
  RectRenderer,
  updateTextureFromMedia,
} from "@super_raptor911/render3d";

export const DisplayVideo = (
  gl: WebGL2RenderingContext,
  video: HTMLVideoElement,
  animationIdRef: React.MutableRefObject<number>
): void => {
  const rect = new Rectangle(1, 0, -1, 1);
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

  const draw = (): void => {
    isPlaying && updateTextureFromMedia(gl, texture, video);
    renderer.draw(rect);
    animationIdRef.current = requestAnimationFrame(draw);
  };
  draw();
};
