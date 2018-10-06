import { Storage } from '@spacechop/types';
import Storages from './../index';
import IStorage from './../storage';

export default (storage: Storage): IStorage => {
  const name = Object.keys(storage)[0];
  const props = storage[name];
  const storageInstance: IStorage = new Storages[name](props);
  return storageInstance;
};
