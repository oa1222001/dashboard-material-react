import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import { accountContext } from 'src/utils/constants';

import { AdminView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AdminPage() {
  const account = useContext(accountContext);

  if (account?.role === '') {
    return <Navigate to="/login" replace />;
  }
  if (account?.role === 'superadmin') {
    return (
      <>
        <Helmet>
          <title> Dashboard </title>
        </Helmet>

        <AdminView />
      </>
    );
  }

  return <Navigate to="/" replace />;
}
