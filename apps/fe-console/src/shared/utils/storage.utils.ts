import { LocalStorageKey } from '@common/constants';

export const clearStorage = () => {
  localStorage.removeItem(LocalStorageKey.accessToken);
};
