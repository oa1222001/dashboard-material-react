import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import { accountContext } from 'src/utils/constants';

import { OrdersView } from 'src/sections/orders/view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  const account = useContext(accountContext);
  return account?.role === '' ? (
    <Navigate to="/login" replace />
  ) : (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <OrdersView />
    </>
  );
}
