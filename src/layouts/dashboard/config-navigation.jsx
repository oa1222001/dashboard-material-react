import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'لوحة التحكم',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'العملاء',
    path: '/clients',
    icon: icon('ic_user'),
  },
  {
    title: 'اداريين الموقع',
    path: '/admins',
    icon: icon('ic_user'),
  },
  {
    title: 'المنتجات',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'الطلبات',
    path: '/orders',
    icon: icon('ic_cart'),
  },
];

export default navConfig;
