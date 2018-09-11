import ImageDefinition from '../../imagedef';
import AsyncBuffer from '../../lib/asyncBuffer';

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
export default async (aBuffer: AsyncBuffer): Promise<ImageDefinition> => {
  await aBuffer.waitForSize(12);
  const buffer = aBuffer.buffer;

  if ((aBuffer.ended && aBuffer.buffer.length < 12) ||
    buffer.slice(0, 4).toString() !== 'RIFF' ||
    buffer.slice(8, 12).toString() !== 'WEBP') {
    return;
  }

  // uint32: A 32-bit, little-endian, unsigned integer.
  // The file size in the header is the total size of the chunks that follow plus 4 bytes for the 'WEBP' FourCC.

  // Wait until chunkType (4 bytes) and chunkSize (4 bytes) have been buffered
  let offset = 12; // WEBP HEADER
  await aBuffer.waitForSize(offset + 4);
  const chunkType = aBuffer.buffer.slice(offset, offset + 4).toString();
  offset += (4 + 4); // ChunkType and ChunkSize (each 4 bytes)

  if (chunkType === 'VP8 ') {
    await aBuffer.waitForSize(offset + 10);
    if (aBuffer.ended && aBuffer.buffer.length < offset + 10) {
      // The file is broken
      return;
    }
    const horizontalSizeCode = aBuffer.buffer.readUInt16LE(offset + 6);
    const width = horizontalSizeCode & 0x3fff; // tslint:disable-line
    const verticalSizeCode = aBuffer.buffer.readUInt16LE(offset + 8);
    const height = verticalSizeCode & 0x3fff; // tslint:disable-line
    return {
      type: 'webp',
      width,
      height,
      lossy: true,
      alpha: false,
      animated: false,
      interlacing: false,
    };
  }

  if (chunkType === 'VP8L') {
    // 1 byte - One byte signature 0x2f.
    await aBuffer.waitForSize(offset + 5);
    if (aBuffer.ended && aBuffer.buffer.length < offset + 5) {
      // The file is broken
      return;
    }
    const bits = aBuffer.buffer.readUInt32LE(offset + 1);
    const width = (bits & 0x3FFF) + 1; // tslint:disable-line
    const height = ((bits >> 14) & 0x3fff) + 1; // tslint:disable-line
    const alpha = !!((bits >> 28) & 0x01); // tslint:disable-line
    return {
      type: 'webp',
      width,
      height,
      lossy: true,
      alpha,
      animated: false,
      interlacing: false,
    };
  }

  if (chunkType === 'VP8X') {
    // 80 bits
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
    await aBuffer.waitForSize(offset + 10);
    if (aBuffer.ended && aBuffer.buffer.length < offset + 10) {
      // The file is broken
      return;
    }
    const bits = aBuffer.buffer.readUInt8(offset);
    const alpha = !!((bits >> 4) & 0x01); // tslint:disable-line
    const animated = !!((bits >> 1) & 0x01); // tslint:disable-line
    const width = aBuffer.buffer.readUInt16LE(offset + 4) + 1;
    const height = aBuffer.buffer.readUInt16LE(offset + 7) + 1;

    return {
      type: 'webp',
      width,
      height,
      alpha,
      animated,
      lossy: false,
      interlacing: false,
    };
  }

  return;
};
