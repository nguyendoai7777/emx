import { Route } from '@angular/router';
import { Prettify } from '@emx/types';

export type NgExpandedRoute = Prettify<
  Route & {
    title: string;
    data: {
      absoluteUrl: string;
    };
  }
>;
export type NgExpandedRoutes = NgExpandedRoute[];
