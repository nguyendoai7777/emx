import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../services';
import { LocalStorageKey } from '@common/constants';

export const NetworkInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigService).config;

  if (req.url === '/config.json' || req.url.startsWith('http')) {
    return next(req);
  }

  const configHeader = (token: string, url: string) => {
    return req.clone({
      // url: isDevMode() ? undefined : url, // use this to enable proxy.conf.json if facing CORS
      url,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const token = localStorage.getItem(LocalStorageKey.accessToken);
  const url = `${config.apiUrl}/api${req.url}`;
  const n = configHeader(token!, url);
  return next(n);
};
