export interface IParamController {
  ypos: number;
  xpos: number;

  scale: number;
  offset: number;
}

export const InitParamController = (obj: IParamController): void => {
  const yposI: any = document.getElementById("ypos");
  if (yposI != null) {
    yposI.onchange = (e: any) => {
      obj.ypos = e.target.valueAsNumber;
    };
  }

  const xposI: any = document.getElementById("xpos");
  if (xposI != null) {
    xposI.onchange = (e: any) => {
      obj.xpos = e.target.valueAsNumber;
    };
  }

  const scaleI: any = document.getElementById("scale");
  if (scaleI != null) {
    scaleI.onchange = (e: any) => {
      obj.scale = e.target.valueAsNumber;
    };
  }

  const offsetI: any = document.getElementById("offset");
  if (offsetI != null) {
    offsetI.onchange = (e: any) => {
      obj.offset = e.target.valueAsNumber;
    };
  }
};
