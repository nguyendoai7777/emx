import { Routes } from '@angular/router';

const PlaygroundRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./playground').then((c) => c.Playground),
    children: [
      {
        path: '',
        data: { animation: 1 },
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'd',
        title: 'Dialog Viewer',
        data: { animation: 2 },
        loadComponent: () => import('./pages/dialog-viewer/dialog-viewer').then((m) => m.DialogViewer),
      },
      {
        path: 'scroll',
        title: 'Scroll Example',
        data: { animation: 3 },
        loadComponent: () => import('./pages/scroll-example/scroll-example').then((m) => m.ScrollExample),
      },
      {
        path: 'named-timeline',
        title: 'Named Timeline',
        data: { animation: 4 },
        loadComponent: () => import('./pages/named-timeline/named-timeline').then((m) => m.NamedTimeline),
      },
    ],
  },
];

export default PlaygroundRoutes;
