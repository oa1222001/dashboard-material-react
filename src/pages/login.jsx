import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import { accountContext } from 'src/utils/constants';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const account = useContext(accountContext);
  return account?.role?.toString() === 'admin' || account?.role?.toString() === 'superadmin' ? (
    <Navigate to="/" replace />
  ) : (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <LoginView />
    </>
  );
}
