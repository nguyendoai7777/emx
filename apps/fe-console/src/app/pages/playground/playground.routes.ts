import { Routes } from '@angular/router';

const PlaygroundRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./playground').then((c) => c.Playground),
  },
];

export default PlaygroundRoutes;
