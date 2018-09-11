import ImageDefinition from '../../imagedef';
import AsyncBuffer from '../../lib/asyncBuffer';

export default async (aBuffer: AsyncBuffer): Promise<ImageDefinition> => {
  await aBuffer.waitForSize(4);
  if (aBuffer.buffer.length < 3 ||
    aBuffer.buffer[0] !== 255 ||
    aBuffer.buffer[1] !== 216 ||
    aBuffer.buffer[2] !== 255
  ) {
    return;
  }

  let block = 0;
  let offset = 2;
  // Inspect at most 20 blocks
  // Should be more than fine.
  while (block < 20) {
    await aBuffer.waitForSize(offset + 8);

    const marker = aBuffer.buffer[offset + 1];

    // We are looking for marker 0xC2 and 0xC0 but the markers could
    // be in any order. So we need to skip each marker that we dont care about.

    if (marker === 0xC0 || marker === 0xC2) {
      const j = offset + 2 + 2 + 1;
      const width = aBuffer.buffer.readUInt16BE(j);
      const height = aBuffer.buffer.readUInt16BE(j + 2);
      const interlacing = marker === 0xC2;
      return {
        type: 'jpeg',
        width,
        height,
        alpha: false,
        animated: false,
        interlacing,
      };
    }

    // Some markers contain data and some do not
    // If the marker contains data we should skip all the data as well as the marker.
    const markersWithData = [
      0xC4, 0xDB, 0xDD, 0xDA,
      0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xFE,
    ];
    if (markersWithData.indexOf(marker) > -1 ) {
      const dataLength = aBuffer.buffer.readUInt16BE(offset + 2);
      offset += (2 + dataLength);
    } else {
      offset += 2;
    }
    block++;
  }

  return;
};
