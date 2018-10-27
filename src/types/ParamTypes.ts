import * as t from 'runtypes';

const StringParam = t.Union(
  t.Literal('string'),
  t.Record({
    type: t.Literal('string'),
  }).And(t.Partial({
    default: t.String,
    enum: t.Array(t.String),
  })),
);

const formatString = (
  type: t.Static<typeof StringParam>,
  value: any,
): string => {
  if (typeof type === 'object') {
    if (type.default && value === undefined || value === null) {
      return type.default;
    }
  }
  const parsed = `${value}`;
  if (typeof type === 'object') {
    if (type.enum && type.enum.indexOf(parsed) < 0) {
      throw new Error('Bad param');
    }
  }
  return parsed;
};

const FloatParam = t.Union(
  t.Literal('float'),
  t.Record({
    type: t.Literal('float'),
  }).And(t.Partial({
    default: t.Number,
    enum: t.Array(t.Number),
    min: t.Number,
    max: t.Number,
    round: t.Number,
  })),
);

const formatFloat = (
  type: t.Static<typeof FloatParam>,
  value: any,
): number => {
  if (typeof type === 'object') {
    if (type.default && value === undefined || value === null) {
      return type.default;
    }
  }
  const parsed = parseFloat(value);
  if (typeof type === 'object') {
    if (type.enum && type.enum.indexOf(parsed) < 0) {
      throw new Error('Bad param');
    }
    if (type.min && type.min > parsed) {
      throw new Error('Bad param');
    }
    if (type.max && type.max < parsed) {
      throw new Error('Bad param');
    }
  }
  return parsed;
};

const IntegerParam = t.Union(
  t.Literal('integer'),
  t.Record({
    type: t.Literal('integer'),
  }).And(t.Partial({
    default: t.Number,
    enum: t.Array(t.Number),
    min: t.Number,
    max: t.Number,
  })),
);

const formatInteger = (
  type: t.Static<typeof IntegerParam>,
  value: any,
): number => {
  if (typeof type === 'object') {
    if (type.default && value === undefined || value === null) {
      return type.default;
    }
  }
  const parsed = parseInt(value, 10);
  if (typeof type === 'object') {
    if (type.enum && type.enum.indexOf(parsed) < 0) {
      throw new Error('Bad param');
    }
    if (type.min && type.min > parsed) {
      throw new Error('Bad param');
    }
    if (type.max && type.max < parsed) {
      throw new Error('Bad param');
    }
  }
  return parsed;
};

const BooleanParam = t.Union(
  t.Literal('boolean'),
  t.Record({
    type: t.Literal('boolean'),
  }).And(t.Partial({
    default: t.Boolean,
  })),
);

const formatBoolean = (
  type: t.Static<typeof BooleanParam>,
  value: any,
): boolean => {
  if (typeof type === 'object') {
    if (type.default && value === undefined || value === null) {
      return type.default;
    }
  }
  const parsed = !!value;
  return parsed;
};

const ParamTypes = t.Union(
  StringParam,
  FloatParam,
  IntegerParam,
  BooleanParam,
);

type Case<T extends t.Runtype, Result> = (type: T, value: t.Static<T>) => Result;
declare type PairCase<A extends t.Runtype, Z> = [A, Case<A, Z>];

function match<X, Z>(...cases: Array<PairCase<any, Z>>): (type: X, x: any) => Z {
  return (type, x) => {
    for (const [T, f] of cases) {
      if (T.guard(type)) {
        return f(type, x);
      }
    }
    throw new Error('No alternatives were matched');
  };
}

export const format = match<ParamTypes, string | number | boolean>(
  [StringParam, formatString],
  [FloatParam, formatFloat],
  [IntegerParam, formatInteger],
  [BooleanParam, formatBoolean],
);

export type ParamTypes = t.Static<typeof ParamTypes>;
export default ParamTypes;
