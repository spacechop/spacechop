import * as t from 'runtypes';
declare const PostiveNumber: t.Constraint<t.Number, {}>;
export declare type Gravity = t.Static<typeof PostiveNumber>;
export default PostiveNumber;
