import { formatToMime, mimeToFormat } from "../Format";

describe('formatToMime', () => {
  it('should throw error on invalid format', () => {
    const format: any = 'something';
    expect(() => formatToMime(format)).toThrow();
  })

  it('should return image/jpeg for jpeg', () => {
    expect(formatToMime('jpeg')).toBe('image/jpeg');
  })
})
describe('mimeToFormat', () => {
  it('should throw error on invalid mime', () => {
    const mime: any = 'something';
    expect(() => mimeToFormat(mime)).toThrow();
  })

  it('should return jpeg for image/jpeg', () => {
    expect(mimeToFormat('image/jpeg')).toBe('jpeg');
  })
})
