import { spawn } from 'duplex-child-process';
import streamToBuffer from './streamToBuffer';

export default async (data, filter) => {
  const buffer = await streamToBuffer(spawn('sh', ['-c', [
    `echo '${data}'`, `jq '${filter}'`,
  ].join('|')]));
  return JSON.parse(buffer.toString());
};
