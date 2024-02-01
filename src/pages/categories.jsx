import { Helmet } from 'react-helmet-async';

import { CategoriesView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products </title>
      </Helmet>

      <CategoriesView />
    </>
  );
}
