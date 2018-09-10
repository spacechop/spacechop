import ImageDefinition from '../../imagedef';

/**
 * @see http://en.wikipedia.org/wiki/Portable_Network_Graphics
 *
 * A PNG file starts with an 8-byte signature. The hexadecimal byte values are
 * 89 50 4E 47 0D 0A 1A 0A; the decimal values are 137 80 78 71 13 10 26 10.
 * Each of the header bytes is there for a specific reason:[7]
 * Bytes Purpose
 * 89  Has the high bit set to detect transmission systems that do not support 8
 * bit data and to reduce the chance that a text file is mistakenly interpreted
 * as a PNG, or vice versa.
 * 50 4E 47  In ASCII, the letters PNG, allowing a person to identify the format
 * easily if it is viewed in a text editor.
 * 0D 0A A DOS-style line ending (CRLF) to detect DOS-Unix line ending conversion of the data.
 * 1A  A byte that stops display of the file under DOS when the command type has been used—the end-of-file character
 * 0A  A Unix-style line ending (LF) to detect Unix-DOS line ending conversion.
 */
export default (buffer): ImageDefinition => {
  if (buffer.length < 16 ||
      buffer[0] !== 0x89 ||
      // PNG
      buffer[1] !== 0x50 || buffer[2] !== 0x4E || buffer[3] !== 0x47 ||
      // \r\n
      buffer[4] !== 0x0D || buffer[5] !== 0x0A ||
      buffer[6] !== 0x1A || buffer[7] !== 0x0A) {
    return;
  }
  // Length  Chunk type  Chunk data  CRC
  // 4 bytes 4 bytes Length bytes  4 bytes
  const length = buffer.readUInt32BE(8);
  // var chunkType = buf.slice(12, 16).toString(); // should be 'IHDR'
  const chunkData = buffer.slice(16, 16 + length);
  // Width:              4 bytes   0
  // Height:             4 bytes   4
  // Bit depth:          1 byte    8
  // Color type:         1 byte    9
  // Compression method: 1 byte    10
  // Filter method:      1 byte    11
  // Interlace method:   1 byte    12
  const width = chunkData.readUInt32BE(0, true);
  const height = chunkData.readUInt32BE(4, true);
  const color = chunkData.readUInt8(9, true);
  const interlace = chunkData.readUInt8(12, true);
  const part = buffer.slice(0, 48).toString('utf8');
  return {
    width,
    height,
    type: 'png',
    animated: /acTL/.test(part),
    alpha: !!(color & 4), // tslint:disable-line
    interlacing: interlace > 0,
    size: buffer.length,
  };
};
