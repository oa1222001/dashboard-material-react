import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import { accountContext } from 'src/utils/constants';

import { ContactUsMessages } from 'src/sections/get_contact_us/view';

// ----------------------------------------------------------------------

export default function ContactUsMessagesPage() {
  const account = useContext(accountContext);

  return account?.role === '' ? (
    <Navigate to="/login" replace />
  ) : (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <ContactUsMessages />
    </>
  );
}
