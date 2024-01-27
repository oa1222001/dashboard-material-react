import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import { accountContext } from 'src/utils/constants';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const account = useContext(accountContext);
  return account?.role === '' ? (
    <Navigate to="/login" replace />
  ) : (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <AppView />
    </>
  );
}
