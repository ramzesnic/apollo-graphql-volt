import sharp from 'sharp';
import { Stream } from 'stream';

export class ImageUtil {
  private static getFormat(fileName: string): string {
    const formats = {
      png: 'png',
      jpg: 'jpeg',
    };
    const ext = fileName.split('.').pop();
    return formats[ext];
  }

  static resizeFileFromStream(
    x: number,
    y: number,
    fileName: string,
    inputStream: Stream,
  ): Stream {
    const format = ImageUtil.getFormat(fileName);
    const resizes = sharp().resize(x, y)[format]();

    inputStream.pipe(resizes);

    return inputStream;
  }
}
