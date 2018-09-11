import ImageDefinition from '../../imagedef';

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
export default (buffer): ImageDefinition => {
  const BLOCK_TERMINATOR = 0x00;
  const EXTENSION_INTRODUCER = 0x21;
  const GRAPHIC_CONTROL_LABEL = 0xf9;
  const TRANSPARENT_COLOR_FLAG = 0x01;
  const IMAGE_SEPARATOR = 0x2c;
  const INTERLACE_FLAG = 0x64;
  if (buffer.length < 13 ||
      // "GIF" 0x47 0x49 0x46
      buffer[0] !== 0x47 || buffer[1] !== 0x49 || buffer[2] !== 0x46 ||
      // "87a" or "89a"
      buffer[3] !== 0x38 || (buffer[4] !== 0x39 && buffer[4] !== 0x37) || buffer[5] !== 0x61) {
    return;
  }
  const width = buffer.readUInt16LE(6);
  const height = buffer.readUInt16LE(8);
  let interlacing = false;
  let alpha = false;
  let animated = false;

  // version: 8[9]a
  if (buffer[4] === 0x39) {
    // graphic control extension.
    let frames = 0;
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
};
