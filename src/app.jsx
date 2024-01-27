/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { useState } from 'react';
import { accountContext } from './utils/constants';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const [account, setAccount] = useState({
    email: localStorage.getItem('email') ? localStorage.getItem('email') : '',
    name: localStorage.getItem('name') ? localStorage.getItem('name') : '',
    role: localStorage.getItem('role') ? localStorage.getItem('role') : '',
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    updateAccount: (newData) => {
      setAccount((prevValue) => ({
        ...prevValue,
        ...newData,
      }));
    },
  });

  return (
    <accountContext.Provider value={account}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </accountContext.Provider>
  );
}
