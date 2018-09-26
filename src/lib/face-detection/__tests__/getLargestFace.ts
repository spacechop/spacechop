import { ImageFaceBox } from '../../../imagedef';
import getLargestFace from '../getLargestFace';

describe('getLargestFace', () => {
  it('normal order', () => {
    const faces: ImageFaceBox[] = [{
      x: 140,
      y: 20,
      width: 250,
      height: 300,
    }, {
      x: 10,
      y: 60,
      width: 150,
      height: 300,
    }];
    expect(getLargestFace(faces)).toEqual(faces[0]);
  });

  it('reverse order', () => {
    const faces: ImageFaceBox[] = [{
      x: 10,
      y: 60,
      width: 300,
      height: 300,
    }, {
      x: 140,
      y: 20,
      width: 400,
      height: 300,
    }];
    expect(getLargestFace(faces)).toEqual(faces[1]);
  });

  it('only one', () => {
    const faces: ImageFaceBox[] = [{
      x: 10,
      y: 60,
      width: 300,
      height: 300,
    }];
    expect(getLargestFace(faces)).toEqual(faces[0]);
  });

  it('empty list', () => {
    const faces: ImageFaceBox[] = [];
    expect(getLargestFace(faces)).toEqual(null);
  });

  it('null list', () => {
    const faces: ImageFaceBox[] = null;
    expect(getLargestFace(faces)).toEqual(null);
  });

  it('undefined list', () => {
    const faces: ImageFaceBox[] = undefined;
    expect(getLargestFace(faces)).toEqual(null);
  });
});
