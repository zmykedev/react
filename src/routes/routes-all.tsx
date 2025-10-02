import type {RouteObject} from 'react-router';
import {Suspense} from 'react';
import Main from '@/pages/Main.tsx';

export const routesAll: RouteObject[] = [
  {
    index: true,
    element: (
      <Suspense>
        <Main />
      </Suspense>
    ),
  },
];
