import { Storage } from './../../types/Storage';
import IStorage from './../storage';
import Storages from './../index';

export default (storage: Storage): IStorage => {
  const name = Object.keys(storage)[0];
  const props = storage[name];
  const storageInstance: IStorage = new Storages[name](props);
  return storageInstance;
};
