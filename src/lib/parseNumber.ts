import { Param } from '../types/Param';

export default (input: number | Param): number => {
  if (typeof input === 'number') {
    return input;
  }
  if (typeof input === 'string') {
    return parseFloat(input);
  }
  return null;
};
