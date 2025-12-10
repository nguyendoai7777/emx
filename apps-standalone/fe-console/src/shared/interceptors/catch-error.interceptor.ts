import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageKey } from '@common/constants';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const CatchErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check unauthorized
      if (error.status === HttpStatusCode.Unauthorized) {
        console.log('Unauthorized - Redirecting to login');
        localStorage.removeItem(LocalStorageKey.accessToken);
        void router.navigateByUrl('/auth/login');
      }

      return throwError(() => error);
    })
  );
};
