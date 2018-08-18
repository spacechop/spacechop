import * as t from 'runtypes';
import CompressOperation from './CompressOperation';
import CropOperation from './CropOperation';
import FillOperation from './FillOperation';
import FitOperation from './FitOperation';
import FormatOperation from './FormatOperation';
import ResizeOperation from './ResizeOperation';
import StripOperation from './StripOperation';

export default t.Union(
  CompressOperation,
  CropOperation,
  FillOperation,
  FitOperation,
  FormatOperation,
  ResizeOperation,
  StripOperation,
);
