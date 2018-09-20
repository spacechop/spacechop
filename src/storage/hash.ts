import hash from 'object-hash';
import { Step } from '../types/Step';

export default (steps: Step[]): string => {
  return hash(steps, {});
};
