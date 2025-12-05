import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageKey } from '@common/constants';
import { inject } from '@angular/core';
import { clearStorage } from '@common/utils';

export const AuthGuard: CanActivateFn = () => {
  const token = localStorage.getItem(LocalStorageKey.accessToken);
  if (token) {
    return true;
  }
  const router = inject(Router);
  void router.navigateByUrl('/auth/login');
  clearStorage();
  return false;
};
