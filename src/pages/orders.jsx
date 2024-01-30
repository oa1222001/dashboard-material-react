import { Helmet } from 'react-helmet-async';

import { OrdersView } from 'src/sections/orders/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <OrdersView />
    </>
  );
}
