import * as t from 'runtypes';

const Param = t.String.withConstraint((n) => {
  if (/^[^$]\w+$/.test(n)) {
    return 'please only $ on parameters';
  }
  return true;
});

export type Param = t.Static<typeof Param>;
export default Param;
