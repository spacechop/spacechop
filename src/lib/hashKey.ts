import hash from 'object-hash';

export default (key: string): string => {
  return hash(key);
};
