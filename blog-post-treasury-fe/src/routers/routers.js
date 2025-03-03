import { lazy } from 'react';

const routers = [
  {
    path: '/',
    component: lazy(() => import('@pages/Blog/Blog'))
  },
  {
    path: '/create',
    component: lazy(() => import('@pages/Blog/BlogCreate'))
  },
  {
    path: '/blog/:id',
    component: lazy(() => import('@pages/Blog/BlogDetail'))
  },
  {
    path: '/edit/:id',
    component: lazy(() => import('@pages/Blog/BlogEdit'))
  },
  {
    path: '/sign-in',
    component: lazy(() => import('@pages/Auth/Login'))
  },
];

export default routers;
