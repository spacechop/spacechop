import * as t from 'runtypes';
import Preset from './Preset';

const Presets = t.Dictionary(Preset, 'string');

export type Presets = t.Static<typeof Presets>;
export default Presets;
