import { Route } from '@angular/router';
import { AuthGuard, NonAuthGuard } from '@common/guards';
import { HomePage } from '@pages/home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('@ui/layouts/main/main.layout'),
    loadChildren: () => import('@ui/routes/main.routes'),
  },
  {
    path: 'pg',
    loadChildren: () => import('@pages/playground/playground.routes'),
  },
  {
    path: 'auth',
    loadComponent: () => import('@pages/auth/auth.layout'),
    loadChildren: () => import('@pages/auth/auth.routes'),
  },
];
