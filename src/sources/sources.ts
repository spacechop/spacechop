import { SourceOptions } from '../types/SourceOptions';
import Source from './source';

interface SourceInstances {
  [key: string]: {
    instance: Source;
  } & SourceOptions;
}

export default SourceInstances;
