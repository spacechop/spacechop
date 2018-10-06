import { Step } from '@spacechop/types';
import hash from 'object-hash';

export default (steps: Step[]): string => {
  return hash(steps, {});
};
