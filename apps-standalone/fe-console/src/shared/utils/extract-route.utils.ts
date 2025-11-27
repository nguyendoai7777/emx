import { NgExpandedRoutes } from '@common/types';

export const extractRoutes = (routes: NgExpandedRoutes) => {
  return routes.filter((r) => !r.redirectTo);
};
