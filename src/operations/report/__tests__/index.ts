import path from 'path';
import { PassThrough } from 'stream';
import streamToBuffer from '../../../lib/streamToBuffer';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import ImageDefinition from './../../../imagedef';
import { allFormats } from './../../../types/Format';
import { allFormats as allReportFormats } from './../../../types/ReportFormat';
import Report from './../index';

expect.extend({ toMatchImageSnapshot });

describe('Report', () => {
  describe('Requirements', () => {
    it('should not have any requirements', () => {
      const compress = new Report({ format: 'json' });
      expect(compress.requirements()).toEqual([]);
    });
  });

  describe('Transformation of state', () => {
    it('should not return same state', () => {
      const r = new Report({ format: 'json' });
      const stateBefore: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };
      const { state: stateAfter } = r.execute(stateBefore);
      expect(stateBefore === stateAfter).toBe(false);
    });

    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };
    it('should not update width & height', () => {
      const op = new Report({ format: 'json' });
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        width: 400,
        height: 400,
      }));
    });

    it('should update mime', () => {
      const op = new Report({ format: 'json' });
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        mime: 'application/json',
      }));
    });
  });

  describe('Command', () => {
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg'};

    it('should use echo', () => {
      const op = new Report({ format: 'json'});
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/echo/));
    });
  });

  const assetsFolder = path.join(__dirname, '../../../test/assets');
  const inputPaths = {
    jpeg: path.join(assetsFolder, 'grid.jpg'),
    png: path.join(assetsFolder, 'grid.png'),
    gif: path.join(assetsFolder, 'grid.gif'),
    webp: path.join(assetsFolder, 'grid.webp'),
  };

  // Test converting between different formats
  for (const fromFormat of allFormats) {
    for (const toFormat of allReportFormats) {
      describe(`report from [${fromFormat}] to [${toFormat}]`, async () => {

        const resultCopies = [];
        const numberOfCopies = 1;
        const source = inputPaths[fromFormat];
        const operation = new Report({ format: 'json' });
        const state = { width: 100, height: 100, type: fromFormat };
        beforeAll(() => {
          const result = createTransformedStream(
            source,
            operation,
            state,
          );

          for (let i = 0; i < numberOfCopies; i++) {
            const pt = new PassThrough();
            result.pipe(pt);
            resultCopies.push(pt);
          }
        });

        it('should match snapshot', async () => {
          const buffer: Buffer = await streamToBuffer(resultCopies[0]);
          const data = JSON.parse(buffer.toString());
          expect(data).toEqual(
            expect.objectContaining(state),
          );
          await expect(data).toMatchSnapshot();
        });
      });
    }
  }
});
