// import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';
import {lazy, Suspense} from 'react';
import Main from "@/pages/Main.tsx";

const LoginPage = lazy(() => import('../pages/auth/login'));
const RegisterPage = lazy(() => import('../pages/auth/register'));

export const routesAll: RouteObject[] = [
  {
    index: true,
    element: (
      // <Suspense fallback={<Fallback />}>
      <Suspense>
        <Main />
      </Suspense>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <Suspense>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <Suspense>
        <RegisterPage />
      </Suspense>
    ),
  }
];
