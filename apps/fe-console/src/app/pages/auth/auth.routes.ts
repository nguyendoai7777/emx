import { Routes } from '@angular/router';
import { NonAuthGuard } from '@common/guards';

const AuthRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@components/login').then((c) => c.Login),
    canActivate: [NonAuthGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

export default AuthRoutes;
