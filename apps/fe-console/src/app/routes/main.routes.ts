import { HomePage } from '@pages/home/home';
import { NgExpandedRoutes } from '@common/types';

export const MainRoutes: NgExpandedRoutes = [
  {
    path: 'home',
    component: HomePage,
    title: 'Tổng quan',
    data: {
      absoluteUrl: '/home',
    },
  },
  /*{
    path: 'analyze',
    loadComponent: () => import('@pages/setting/setting').then((c) => c.SettingPage),
    title: 'Thống kê',
    data: {
      absoluteUrl: '/analyze',
    },
  },*/
  {
    path: 'category',
    title: `Phân loại`,
    loadComponent: () => import('@pages/category/category').then((c) => c.CategoryPage),
    data: {
      absoluteUrl: '/category',
    },
  },
  {
    path: 'setting',
    title: `Thiết lập`,
    loadComponent: () => import('@pages/setting/setting').then((c) => c.SettingPage),
    data: {
      absoluteUrl: '/setting',
    },
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    title: 'Tổng quan',
    data: {
      absoluteUrl: '/home',
    },
  },
];
export default MainRoutes;
