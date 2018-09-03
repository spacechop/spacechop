import { Gravity } from '../operations/Gravity';
import { magickGravityMap } from '../operations/magickGravityMap';
import { Param } from '../types/Param';

export default (gravity: Gravity | Param): string => {
  if (typeof gravity === 'string') {
    return magickGravityMap[gravity];
  }
  return null;
};
