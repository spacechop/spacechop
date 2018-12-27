import isBinaryFile from 'isbinaryfile';
import XML from 'pixl-xml';
import { ImageDefinition } from '../../types';

export default (buffer): ImageDefinition => {
  
  const bufferByteLength = buffer.byteLength; // Get the number of bytes

  // Check if the data indicates an empty or binary file.
  if (buffer.length < 3 || isBinaryFile.sync(buffer, bufferByteLength)) {
    return;
  }

  let width;
  let height;
  let interlacing = false;
  let alpha = false;
  let animated = false;

  try {
    const svgDoc = XML.parse(buffer.toString());
    let svgHeight;
    let svgWidth;

    // Logic borrowed from https://github.com/fixiecoder/node-svg-dimensions/blob/master/svg-dimensions.js
    const hasWidthHeightAttr = svgDoc.height && svgDoc.width;
    if (hasWidthHeightAttr) {
      svgHeight = svgDoc.height;
      svgWidth = svgDoc.width;
    } else {
      svgHeight = svgDoc.viewBox.replace(/^\d+\s\d+\s(\d+\.?[\d])\s(\d+\.?[\d])/, '$2');
      svgWidth = svgDoc.viewBox.replace(/^\d+\s\d+\s(\d+\.?[\d])\s(\d+\.?[\d])/, '$1');
    }
    
    width = parseFloat(svgWidth);
    height = parseFloat(svgHeight);
    
  } catch (err) {
    return;
  }

  return {
    width,
    height,
    type: 'svg',
    alpha,
    animated,
    interlacing,
    size: buffer.length,
  };
};
