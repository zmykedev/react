import type { RouteObject } from 'react-router';
import NotFound from '@/views/common/not-found';
import Layout from '@/views/common/layout';
import { routesAll } from '@/routes/routes-all';

export const routesApp: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [...routesAll],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
