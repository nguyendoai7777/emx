import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { ConfigService } from '@common/services';
import { firstValueFrom, tap } from 'rxjs';
import { AppInitConfig } from '@common/types';
import { CatchErrorInterceptor, NetworkInterceptor, PackerInterceptor } from '@common/interceptors';
import { AppRoutes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { PartialOptions, provideWindowScroll } from 'ng-scrollable';

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
    provideHttpClient(withInterceptors([NetworkInterceptor, PackerInterceptor, CatchErrorInterceptor])),
    provideRouter(
      AppRoutes,
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
  ],
};
