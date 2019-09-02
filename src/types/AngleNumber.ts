import * as t from 'runtypes';

const PositiveNumber = t.Number.withConstraint((n) => {
  if (n < -180) {
    return 'angle must be larger than or equal to -180';
  }
  if (n > 180) {
    return 'angle must be less than or equal to 180';
  }
  return true;
});

export type PositiveNumber = t.Static<typeof PositiveNumber>;
export default PositiveNumber;
