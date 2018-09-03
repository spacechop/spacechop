import * as t from 'runtypes';
import CompressConfig from '../operations/compress/types';
import CropConfig from '../operations/crop/types';
import FillConfig from '../operations/fill/types';
import FitConfig from '../operations/fit/types';
import FormatConfig from '../operations/format/types';
import ResizeConfig from '../operations/resize/types';
import StripConfig from '../operations/strip/types';

const Step = t.Partial({
  $compress: CompressConfig,
  $crop: CropConfig,
  $fill: FillConfig,
  $fit: FitConfig,
  $format: FormatConfig,
  $resize: ResizeConfig,
  $strip: StripConfig,
}).withConstraint(
  (n) => {
    if (Object.keys(n).length > 1) {
      return 'please only one operation per step';
    }
    if (Object.keys(n).length === 0) {
      return 'please no empty step';
    }
    return true;
  },
);

export type Step = t.Static<typeof Step>;
export default Step;
