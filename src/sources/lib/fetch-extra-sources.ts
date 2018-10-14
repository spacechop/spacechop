import { Params } from '../../config/params';
import saveStreamToFile from '../../lib/saveStreamToFile';
import { ExtraSource } from '../../types/ExtraSource';
import SourceInstances from '../sources';

export default async (
  extras: ExtraSource[],
  sources: SourceInstances,
  params: Params,
): Promise<void> => {
  const promises = [];
  for (const extra of extras) {
    const source = sources[extra.source];
    // Combine params and extra params.
    const parameters = { ...params, ...extra.params };
    if (source && await source.instance.exists(parameters)) {
      const stream = source.instance.stream(parameters);
      promises.push(saveStreamToFile(stream, extra.handle));
    }
  }
  await Promise.all(promises);
};
