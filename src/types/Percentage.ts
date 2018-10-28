import * as t from 'runtypes';

const Percentage = t.String.withConstraint((n) => {
  if (/^(\d|\d\d|100)%$/.test(n)) {
    return 'please only 1-100 percentage';
  }
  return true;
});

export type Percentage = t.Static<typeof Percentage>;
export default Percentage;
