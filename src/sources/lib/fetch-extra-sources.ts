import { Params } from '../../config/params';
import populatePresetParams from '../../lib/populatePresetParams';
import saveStreamToFile from '../../lib/saveStreamToFile';
import transform from '../../transform';
import { Config } from '../../types/Config';
import { ExtraSource } from '../../types/ExtraSource';
import SourceInstances from '../sources';

export default async (
  extras: ExtraSource[],
  config: Config,
  sources: SourceInstances,
  params: Params,
): Promise<void> => {
  const promises = [];
  for (const extra of extras) {
    for (const key of Object.keys(sources[extra.source])) {
      const source = sources[extra.source][key];
      // Combine params and extra params.
      const parameters = { ...params, ...extra.params };
      if (source && await source.exists(parameters)) {
        const extraStream = source.stream(parameters);
        if (extra.preset) {
          const preset = config.presets.public[extra.preset]
            || config.presets.private[extra.preset];
          const steps = populatePresetParams(preset.steps, params, extra.state);
          promises.push(transform(extraStream, steps).then(
            ({ stream }) => saveStreamToFile(stream, extra.handle),
          ));
        } else {
          promises.push(saveStreamToFile(extraStream, extra.handle));
        }
      }
    }
  }
  await Promise.all(promises);
};
