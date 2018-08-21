import * as t from 'runtypes';
import CompressConfig from '../operations/compress/types';
import CropConfig from '../operations/crop/types';
import FillConfig from '../operations/fill/types';
import FitConfig from '../operations/fit/types';
import FormatConfig from '../operations/format/types';
import ResizeConfig from '../operations/resize/types';
import StripConfig from '../operations/strip/types';


export default t.Union(
  t.Record({ $compress: CompressConfig }),
  t.Record({ $crop: CropConfig }),
  t.Record({ $fill: FillConfig }),
  t.Record({ $fit: FitConfig }),
  t.Record({ $format: FormatConfig }),
  t.Record({ $resize: ResizeConfig }),
  t.Record({ $strip: StripConfig }),
);
