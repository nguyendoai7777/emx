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
      {
        path: 'signal-form',
        title: 'Signal Form New API',
        data: { animation: 5 },
        loadComponent: () => import('./pages/signal-form-ex/signal-form-ex').then((m) => m.SignalFormEx),
      },
      {
        path: 'ex-signal-form',
        title: 'Experimental Signal Form New API',
        data: { animation: 6 },
        loadComponent: () => import('./pages/ex-signal-form/ex-signal-form').then((m) => m.ExSignalForm),
      },
    ],
  },
];

export default PlaygroundRoutes;
