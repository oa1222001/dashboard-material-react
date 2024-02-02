import React, { useState, useEffect, useContext } from 'react';

import {
  Card,
  Table,
  Button,
  Dialog,
  Divider,
  TableRow,
  Container,
  TableBody,
  TableCell,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  CircularProgress,
} from '@mui/material';

// import { useRouter } from 'src/routes/hooks';

import { BACKEND_URL, accountContext } from 'src/utils/constants';

export default function OrdersPage() {
  const account = useContext(accountContext);
  // const router = useRouter();

  const [orders, setOrders] = useState([]);
  // const [orderProducts, setOrderProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/getorders`, {
          headers: {
            authorization: `Bearer ${account.token}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          // console.log(result);
          result.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOrders(result.orders);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch orders');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [account]);

  const handleViewDetails = async (order) => {
    // let isProductOk = true;
    // console.log(order.products);
    // console.log(order.products[0].id);
    const promises = order.products.map(async (p) => {
      const response = await fetch(`${BACKEND_URL}/client/products/getproduct/${p.id}`);
      // console.log(response);
      const product = await response.json();
      // console.log(product);

      return {
        amount: p.amount,
        price: p.price,
        discount: p.discount,
        total: p.total,
        name: product.product.name,
        image: product.product.image_urls[0],
      };
      // .then((r) => ({
      //   amount: p.amount,
      //   price: p.price,
      //   discount: p.discount,
      //   total: p.total,
      //   name: r.name,
      //   image: r.image_urls[0],
      // }));
    });
    const products = await Promise.all(promises);
    // console.log(products);
    order.products = products;
    // order.isProductOk = isProductOk;
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setSelectedOrder(null);
  };

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        الطلبات
      </Typography>

      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>رقم الموبايل الاول</TableCell>

                  <TableCell>الرقم الثاني</TableCell>

                  <TableCell>طريقة الدفع</TableCell>
                  <TableCell>اجمالي السعر</TableCell>
                  <TableCell>الايميل</TableCell>
                </TableRow>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      {order.first_name
                        .concat(' ')
                        .concat(order?.last_name === '' ? '' : order?.last_name)}
                    </TableCell>
                    <TableCell>{order.first_number}</TableCell>
                    {order.second_number ? (
                      <TableCell>{order.second_number}</TableCell>
                    ) : (
                      <TableCell>لا يوجد رقم اخر</TableCell>
                    )}
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell>{order.total_price}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(order)}
                      >
                        اظهر تفاصيل الطلب
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Order Details Modal */}
      <Dialog open={showDetailsDialog} onClose={handleCloseDetailsDialog}>
        <DialogTitle>تفاصيل الطلب</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography variant="body1">
                التاريخ : {` `}
                {new Date(selectedOrder.date).toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
              <Typography variant="body1"> معلومات التوصيل</Typography>
              <Typography variant="body1"> {selectedOrder.city.name} :مدينة</Typography>
              <Typography variant="body1"> {selectedOrder.destination} :عنوان</Typography>

              <Divider />
              <Typography variant="body1"> : المنتجات المطلوبة</Typography>
              <Divider />
              {selectedOrder.products.map((product, index) => (
                <div key={index}>
                  <Typography variant="body1">{product.name} : الاسم </Typography>
                  <Typography variant="body1">{product.amount} : الكمية</Typography>
                  <Typography variant="body1">{product.price} : سعر المنتج</Typography>
                  <Typography variant="body1">{Number(product.discount) * 100}% : الخصم</Typography>
                  <Typography variant="body1">{product.total} : الاجمالي</Typography>

                  {/* Display image using the <img> tag */}
                  <img
                    src={product.image}
                    alt={`Product - ${product.name}`}
                    style={{ maxWidth: '100%' }}
                  />

                  {/* Add more product details as needed */}
                  <br />
                  <Divider />
                </div>
              ))}
              <Typography variant="body1"> : اكواد الخصومات المستخدمة</Typography>
              <Divider />
              {selectedOrder.promocodes.map((promocode, index) => (
                <div key={index}>
                  <Typography variant="body1">{promocode.promocode} : بروموكود </Typography>
                  <Typography variant="body1">
                    نوع الخصم :{promocode.type === 'percentage' ? 'نسبة مئوية' : 'قيمة مالية'}
                  </Typography>
                  <Typography variant="body1">
                    {promocode.type === 'percentage'
                      ? `${Number(promocode.value) * 100}%`
                      : promocode.value}{' '}
                    : قيمة الخصم
                  </Typography>
                  <Divider />
                </div>
              ))}
              <Typography variant="body1">
                {selectedOrder.total_price} : اجمالي مبلغ الطلب بعد الخصومات{' '}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            اغلق
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
