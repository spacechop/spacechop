import { Storage } from './../../types/Storage';
import Storages from './../index';
import StorageInstance from './../storage';

export default (storage: Storage): StorageInstance => {
  const type = Object.keys(storage)[0];
  const props = storage[type];
  return new Storages[type](props);
};
