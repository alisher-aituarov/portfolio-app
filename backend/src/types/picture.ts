export interface IncomingPictureShape {
  name: string;
  is_main: boolean;
  picture: any;
}

export interface UpdatingPictureShape extends IncomingPictureShape {
  id: string;
}
