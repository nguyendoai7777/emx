import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageKey } from '@common/constants';
import { inject } from '@angular/core';

export const NonAuthGuard: CanActivateFn = (route, state) => {
  console.log({ route, state });
  const token = localStorage.getItem(LocalStorageKey.accessToken);
  if (!token) {
    return true;
  }
  const router = inject(Router);
  void router.navigateByUrl(`/`);
  return false;
};
