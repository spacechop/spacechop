import { formatToMime, mimeToFormat } from "../Format";

describe('formatToMime', () => {
  it('should throw error on invalid format', () => {
    const format: any = 'something';
    expect(() => formatToMime(format)).toThrow();
  })
})
describe('mimeToFormat', () => {
  it('should throw error on invalid mime', () => {
    const mime: any = 'something';
    expect(() => mimeToFormat(mime)).toThrow();
  })
})
