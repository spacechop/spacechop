import { ImageDefinition } from '../../types';

export default (buffer): ImageDefinition => {
  if (buffer.length < 3 ||
    buffer[0] !== 255 ||
    buffer[1] !== 216 ||
    buffer[2] !== 255
  ) {
    return;
  }

  let width = null;
  let height = null;
  let interlacing = false;
  let offset = 4;
  while (offset < buffer.length) {
    const i = buffer.readUInt16BE(offset);
    // Every JPEG block must begin with a 0xFF
    if (buffer[offset + i] === 0xFF) {
      const next = buffer[offset + i + 1];
      if (next === 0xC2) {
        interlacing = true;
      }
      if (next === 0xC0 || next === 0xC1 || next === 0xC2) {
        const j = offset + i + 2 + 2 + 1;
        width = buffer.readUInt16BE(j + 2, true);
        height = buffer.readUInt16BE(j, true);
        break;
      }
    }
    // move to the next block
    offset += i + 2;
  }

  return {
    width,
    height,
    type: 'jpeg',
    alpha: false,
    animated: false,
    interlacing,
    size: buffer.length,
  };
};
