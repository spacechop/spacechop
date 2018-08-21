import * as t from 'runtypes';

const PostiveNumber = t.Number.withConstraint((n) => {
  if (n < 0) {
    return 'please no negative number';
  }
  return true;
});

export type Gravity = t.Static<typeof PostiveNumber>;
export default PostiveNumber;
