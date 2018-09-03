import { Format } from '../types/Format';
import { Param } from '../types/Param';

export default (format: Format | Param): Format => {
  if (typeof format === 'string') {
    return format;
  }
  return null;
};
