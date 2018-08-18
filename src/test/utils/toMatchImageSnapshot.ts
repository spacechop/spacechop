import fs from 'fs';
import { PassThrough, Stream } from 'stream';
import imageSimilarity from './imageSimilarity';
import path from 'path';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(options: toMatchImageSnapshotOptions): typeof toMatchImageSnapshot
    }
  }
}

const makeDirIfNeeded = (directory: string) => {
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }
}

const writeStreamAsync = (source: NodeJS.ReadableStream, destination: NodeJS.WritableStream) => {
  return new Promise((resolve, reject) => {
    source.pipe(destination);
    destination.on('finish', resolve);
    destination.on('error', reject);
  })
}


type SnapshotResult = {
  message(): string,
  pass: boolean
};

type toMatchImageSnapshotOptions ={
  threshold?: number;
  extension: string;
}
export default async function toMatchImageSnapshot(
  received: NodeJS.ReadableStream,
  {
    threshold = .9,
    extension = ''
  }: toMatchImageSnapshotOptions
) : Promise<SnapshotResult>{
  const {
    snapshotState,
    isNot,
    currentTestName,
    testPath,
    utils
  } = this; // this refers to jes: t expectof s
  if (!(received instanceof Stream)) {
    throw new Error(
      'Jest: invalid value passed to .toMatchImageSnapshot(). ' +
      'Can only handle Stream but recieved: ' + typeof received
    );
  }

  if (isNot) {
    throw new Error('Jest: `.not` cant be used with .toMatchImageSnapshot()');
  }

  // Update number of tests run for this test
  const testCounter = (snapshotState._counters.get(currentTestName) || 0) + 1;
  snapshotState._counters.set(currentTestName, testCounter);

  // Remove all illegal characters from filename
  const fileSuffix = currentTestName.toLowerCase().replace(/[/\\?%*:|"<> ]/g, '-');
  let fileName = `${path.basename(testPath)}-${fileSuffix}.snap`;
  if (extension && extension.length > 0) {
    fileName += '.' + extension;
  }
  const filePath = path.join(
    path.dirname(testPath),
    '__image-snapshots__',
    fileName
  );

  makeDirIfNeeded(path.dirname(filePath));

  if (!fs.existsSync(filePath)) {
    const snapshot = fs.createWriteStream(filePath);
    await writeStreamAsync(received, snapshot);
    snapshotState.added += 1;
    return {
      message: () => 'Added snapshot',
      pass: true
    }
  }


  const stream1 = new PassThrough();
  const stream2 = new PassThrough();

  received.pipe(stream1);
  received.pipe(stream2);

  let similarity;
  try {
    similarity = await imageSimilarity(stream1, filePath);
  } catch(e) {
    snapshotState.fail(currentTestName, received);
    throw e;
  }

  if (similarity < threshold) {
    
    // Jest attempted to update snapshot.
    // We only want to update snaphots for images that failed.
    // Therefore we check similarity against threshold first and then
    // depending on the result we update the snapshot.
    const shouldUpdate = snapshotState._updateSnapshot === 'all';
    if (shouldUpdate) {
      const snapshot = fs.createWriteStream(filePath);
      await writeStreamAsync(stream2, snapshot);
      snapshotState.added += 1;
      return {
        message: () => 'Updated snapshot',
        pass: true
      }
    }
    snapshotState.fail(currentTestName, received);
    
    return {
      pass: false,
      message: () => 
        'Similarity between received image and stored snapshot too low \n\n' +
        `Expected similarity greater than ${utils.RECEIVED_COLOR(threshold)} but recieved ${utils.EXPECTED_COLOR(similarity)} \n\n` +
        `Snapshot is stored at: ${filePath}`,
    };
  } else {
    snapshotState.matched += 1;
    return {
      message: () => `Passed with similarity ${similarity}`,
      pass: true
    }
  }
};
