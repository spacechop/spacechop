import * as t from 'runtypes';

const PositiveNumber = t.Number.withConstraint((n) => {
  if (n < 0) {
    return 'please no negative number';
  }
  return true;
});

export type PositiveNumber = t.Static<typeof PositiveNumber>;
export default PositiveNumber;
