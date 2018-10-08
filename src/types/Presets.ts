import * as t from 'runtypes';
import PresetConfig from './PresetConfig';

const Presets = t.Dictionary(PresetConfig, 'string');

export type Presets = t.Static<typeof Presets>;
export default Presets;
