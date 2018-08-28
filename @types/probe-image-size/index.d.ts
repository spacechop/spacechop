import { Mime } from '../../src/types/Format';

declare module 'probe-image-size' {
  import { Readable } from "stream";
  export type ImageSizeResult = {
      width: number,
      height: number,
      type: string, // image 'type' (usual file name extention)
      mime: Mime, // mime type
  };
  export default function probeImageSize(stream: Readable): Promise<ImageSizeResult>;
}
