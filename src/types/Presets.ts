import * as t from 'runtypes';
import Preset from './Preset';

const Presets = t.Record({
  public: t.Dictionary(Preset, 'string'),
}).And(t.Partial({
  private: t.Dictionary(Preset, 'string'),
}));

export type Presets = t.Static<typeof Presets>;
export default Presets;
