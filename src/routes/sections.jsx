// import { lazy, Suspense, useContext } from 'react';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

// import { accountContext } from 'src/utils/constants';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ContactUsMessagesPage = lazy(() => import('src/pages/contactusmessages'));
export const AdminPage = lazy(() => import('src/pages/admin'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  // const account = useContext(accountContext);

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'contactus', element: <ContactUsMessagesPage /> },
        { path: 'admin', element: <AdminPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'orders', element: <OrdersPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
