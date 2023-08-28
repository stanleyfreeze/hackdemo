export interface IImageItem {
  dataURI: string;
  width: number;
  height: number;
  offset: number;
  ratio: number;
  imgLoader: Promise<HTMLImageElement>;
}

export type TSection = {
  x: number;
  y: number;
  width: number;
  height: number;
};
