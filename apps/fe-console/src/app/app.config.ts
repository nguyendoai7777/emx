import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { PartialOptions, provideWindowScroll } from 'ng-scrollable';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfigService } from '@common/services';
import { firstValueFrom, tap } from 'rxjs';
import { AppInitConfig } from '@common/types';
import { NetworkInterceptor } from '../shared/interceptors';
const _scrollConfig: PartialOptions = {
  scrollbars: {
    autoHide: 'leave',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const http = inject(HttpClient),
        cg = inject(ConfigService);

      return firstValueFrom(
        http.get<AppInitConfig>('/config.json').pipe(
          tap((config) => {
            cg.setConfig(config);
          })
        )
      );
    }),
    provideWindowScroll(_scrollConfig),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([NetworkInterceptor])),
    provideRouter(appRoutes),
  ],
};
