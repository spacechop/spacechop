import { ImageDefinition } from '../../types';

/**
 * @see https://developers.google.com/speed/webp/docs/riff_container
 *
 * WebP File Header
 *  0                   1                   2                   3
 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |      'R'      |      'I'      |      'F'      |      'F'      |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                           File Size                           |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |      'W'      |      'E'      |      'B'      |      'P'      |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *
 * 'RIFF': 32 bits
 *   The ASCII characters 'R' 'I' 'F' 'F'.
 * File Size: 32 bits (uint32)
 *   The size of the file in bytes starting at offset 8.
 *   The maximum value of this field is 2^32 minus 10 bytes and
 *     thus the size of the whole file is at most 4GiB minus 2 bytes.
 * 'WEBP': 32 bits
 *   The ASCII characters 'W' 'E' 'B' 'P'.
 */
// const ANMF = new Uint8Array([
//   0x41, 0x4e, 0x4d, 0x46,
// ]);
export default (buffer: Buffer): ImageDefinition => {
  if (buffer.length < 12 ||
    buffer.slice(0, 4).toString() !== 'RIFF' ||
    buffer.slice(8, 12).toString() !== 'WEBP') {
    return;
  }

  // uint32: A 32-bit, little-endian, unsigned integer.
  // The file size in the header is the total size of the chunks that follow plus 4 bytes for the 'WEBP' FourCC.
  const size = buffer.readUInt32LE(4);
  let lossy = false;
  let animated = false;
  let width = null;
  let height = null;
  let alpha = false;

  let offset = 12;
  while (offset + 8 < buffer.length) {
    const chunkType = buffer.slice(offset, offset + 4).toString();
    const chunkSize = buffer.readUInt32LE(offset + 4);
    switch (chunkType) {
      case 'VP8 ': {
        // 3 bytes - "Uncompressed Data Chunk"
        // 3 bytes - VP8 intraframe start code
        const horizontalSizeCode = buffer.readUInt16LE(offset + 8 + 3 + 3);
        width = horizontalSizeCode & 0x3fff; // tslint:disable-line
        const verticalSizeCode = buffer.readUInt16LE(offset + 8 + 3 + 5);
        height = verticalSizeCode & 0x3fff; // tslint:disable-line
        break;
      }
      case 'VP8L': {
        // 1 byte - One byte signature 0x2f.
        lossy = true;
        const bits = buffer.readUInt32LE(offset + 8 + 1);
        width = (bits & 0x3FFF) + 1; // tslint:disable-line
        height = ((bits >> 14) & 0x3fff) + 1; // tslint:disable-line
        alpha = !!((bits >> 28) & 0x01); // tslint:disable-line
        break;
      }
      case 'VP8X': {
        // 80 bits
        //
        // 2 bits - Reserved (1)
        // 1 bit - ICC Profile flag
        // 1 bit - Alpha flag
        // 1 bit - EXIF metadata flag
        // 1 bit - XMP metadata flag
        // 1 bit - Animation flag
        // 1 bit - Reserved (2)
        // 24 bits - Reserved (3)
        // 24 bits - Canvas Width (actual canvas width should add 1 to read value)
        // 24 bits - Canvas Height (actual canvas height should add 1 to read value)
        const bits = buffer.readUInt8(offset + 8);
        alpha = !!((bits >> 4) & 0x01); // tslint:disable-line
        animated = !!((bits >> 1) & 0x01); // tslint:disable-line
        width = buffer.readUInt16LE(offset + 8 + 4) + 1;
        height = buffer.readUInt16LE(offset + 8 + 7) + 1;
        break;
      }
      // case 'ANIM':
      //   break;
      case 'ANMF':
        animated = true;
        break;
      case 'ALPH':
        alpha = true;
        break;
      // case 'ICCP':
      //   break;
      // case 'EXIF':
      //   break;
      // case 'XMP':
      //   break;
    }
    offset += chunkSize + 8;
  }

  return {
    width,
    height,
    type: 'webp',
    alpha,
    animated,
    interlacing: false,
    lossy,
    size: size + 8,
  };
};
