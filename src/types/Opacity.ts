import * as t from 'runtypes';

const Opacity = t.Number.withConstraint((n) => {
  if (n < 0) {
    return 'please no negative number';
  }
  if (n > 0) {
    return 'please no larger number than 1';
  }
  return true;
});

export type Opacity = t.Static<typeof Opacity>;
export default Opacity;
