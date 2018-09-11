import ImageDefinition from '../../imagedef';
import AsyncBuffer from '../../lib/asyncBuffer';

/**
 * @see http://www.onicos.com/staff/iz/formats/gif.html
 * @see http://giflib.sourceforge.net/whatsinagif/bits_and_bytes.html
 *
 * GIF format
 * Byte Order: Little-endian
 * GIF Header
 * Offset   Length   Contents
 *   0      3 bytes  "GIF" 0x47 0x49 0x46
 *   3      3 bytes  "87a" or "89a"  0x38 0x39|0x37 0x61
 *   6      2 bytes  <Logical Screen Width>
 *   8      2 bytes  <Logical Screen Height>
 *  10      1 byte   bit 0:    Global Color Table Flag (GCTF)
 *                   bit 1..3: Color Resolution
 *                   bit 4:    Sort Flag to Global Color Table
 *                   bit 5..7: Size of Global Color Table: 2^(1+n)
 *  11      1 byte   <Background Color Index>
 *  12      1 byte   <Pixel Aspect Ratio>
 *  13      ? bytes  <Global Color Table(0..255 x 3 bytes) if GCTF is one>
 *          ? bytes  <Blocks>
 *          1 bytes  <Trailer> (0x3b)
 * *
 */
export default async (aBuffer: AsyncBuffer): Promise<ImageDefinition> => {
  const BLOCK_TERMINATOR = 0x00;
  const EXTENSION_INTRODUCER = 0x21;
  const GRAPHIC_CONTROL_LABEL = 0xf9;
  const TRANSPARENT_COLOR_FLAG = 0x01;
  const IMAGE_SEPARATOR = 0x2c;
  const INTERLACE_FLAG = 0x64;

  await aBuffer.waitForSize(13);
  if (aBuffer.buffer.length < 13 ||
      // "GIF" 0x47 0x49 0x46
      aBuffer.buffer[0] !== 0x47 || aBuffer.buffer[1] !== 0x49 || aBuffer.buffer[2] !== 0x46 ||
      // "87a" or "89a"
      aBuffer.buffer[3] !== 0x38 ||
      (aBuffer.buffer[4] !== 0x39 && aBuffer.buffer[4] !== 0x37) || aBuffer.buffer[5] !== 0x61) {
    return;
  }
  const width = aBuffer.buffer.readUInt16LE(6);
  const height = aBuffer.buffer.readUInt16LE(8);

  // version 8[7]a
  // This version cant be animated and does not support alpha
  // so these values are known, but we do need to find
  // whether interlacing is used
  if (aBuffer.buffer[4] === 0x37) {
    const interlacingOffset = 14 + 8; // 14 = GIF header
    await aBuffer.waitForSize(interlacingOffset + 1);
    // tslint:disable-next-line:no-bitwise
    const interlacing = !(aBuffer.buffer[interlacingOffset] & INTERLACE_FLAG);
    return {
      type: 'gif',
      width,
      height,
      interlacing,
      alpha: false,
      animated: false,
    };
  }

  // version: 8[9]a
  // This version can both be animated and supports alpha
  // It consists of either:
  // Graphic Control Extension + Image Block
  // or:
  // Application Extension
  // [ Graphic Control Extension + Image Block ]* (each frame)

  if (aBuffer.buffer[4] === 0x39) {
    // graphic control extension.

    // Havent figured out how to parse GIF in a nice way without
    // reading full image yet.
    await aBuffer.waitUntilEnd();
    const buffer = aBuffer.buffer;
    let frames = 0;
    let animated = false;
    let interlacing = false;
    let alpha = false;
    for (let i = 14; i < buffer.length; i++) {
      // BLOCK_TERMINATOR
      if (buffer[i] === BLOCK_TERMINATOR &&
          buffer[i + 1] === EXTENSION_INTRODUCER &&
          buffer[i + 2] === GRAPHIC_CONTROL_LABEL) {
        frames++;
        alpha = !!(buffer[i + 4] & TRANSPARENT_COLOR_FLAG); // tslint:disable-line
        if (frames > 1) {
          animated = true;
          break;
        }
      }
      if (buffer[i] === BLOCK_TERMINATOR && buffer[i + 1] === IMAGE_SEPARATOR) {
        interlacing = !!(buffer[i + 10] & INTERLACE_FLAG); // tslint:disable-line
      }
    }
    return {
      width,
      height,
      type: 'gif',
      alpha,
      animated,
      interlacing,
      size: buffer.length,
    };
  }
  return;
};
