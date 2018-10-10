import Source from './../../source';
import lookThroughSources from './../look-through-sources';

describe('lookThroughSources', () => {
  it('should return null if image does not exist in source', async () => {
    const sources: Source[] = [
      {
        key: jest.fn(),
        exists: jest.fn(() => Promise.resolve(false)),
        stream: jest.fn(() => Promise.resolve()),
      },
    ];

    const { stream } = await lookThroughSources(sources, {});
    expect(stream).toBeNull();
  });
  it('should only check sources until image is found', async () => {
    const sources: Source[] = [
      {
        key: jest.fn(),
        exists: jest.fn(() => Promise.resolve(true)),
        stream: jest.fn(() => Promise.resolve()),
      },
      {
        key: jest.fn(),
        exists: jest.fn(() => Promise.resolve(false)),
        stream: jest.fn(() => Promise.resolve()),
      },
    ];

    await lookThroughSources(sources, {});

    expect(sources[0].exists).toHaveBeenCalled();
    expect(sources[1].exists).not.toHaveBeenCalled();
  });

});
