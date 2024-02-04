import { useState, useEffect, useContext } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  Select,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

// import { products } from 'src/_mock/products';

import { useRouter } from 'src/routes/hooks';

import { BACKEND_URL, accountContext } from 'src/utils/constants';

import Label from 'src/components/label';

// import ShopProductCard from '../product-card';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [categoriesAndSubcategories, setCategoriesAndSubcategories] = useState([
    {
      categoryId: '1',
      name: 'Category 1',
      subcategories: ['Subcategory 1.1', 'Subcategory 1.2', 'Subcategory 1.3'],
    },
    {
      categoryId: '2',
      name: 'Category 2',
      subcategories: ['Subcategory 2.1', 'Subcategory 2.2', 'Subcategory 2.3'],
    },
    // Add more categories and subcategories as needed
  ]);
  const router = useRouter();
  const account = useContext(accountContext);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discount: '',
    available_amount: '',
    wholesale_offers: [],
    description: '',
    images: [],
    categoriesAndSub: [
      {
        id: '65abad6425715658c6d165cf',
        subcat: ['1', '3'],
      },
    ],
  });
  const [openModal, setOpenModal] = useState(false);
  const [p, setP] = useState({});

  const handleOpenModal = async (pr) => {
    try {
      // console.log(pr);
      const response = await fetch(`${BACKEND_URL}/client/products/getproduct/${pr.id}`);
      if (response.ok) {
        const result = await response.json();
        // console.log(result.product.wholesale_offers.join('\n'));
        result.product.wholesale_offers = result.product.wholesale_offers.join('\n');
        result.product.discount = Number(result.product.discount)
          ? Number(result.product.discount) * 100
          : 0;

        setP(result.product);
        setOpenModal(true);
      } else {
        console.error('Failed to fetch product');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [showAddProduct, setShowAddProduct] = useState(false); // State to manage visibility

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleChangeCategories = (event) => {
    setSelectedCategories(event.target.value);
    // console.log(event.target.value);
  };

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const onDelete = async () => {
    try {
      // console.log(p.id);
      const response = await fetch(`${BACKEND_URL}/admin/deleteproduct`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          id: p.id,
        }),
      });
      if (Number(response.status) === 200) {
        router.reload();
      } else {
        alert('مشكلة في سيرفر الموقع');
      }
    } catch (error) {
      console.error(error);
      alert('مشكلة في سيرفر الموقع');
    }
  };

  const handleAddProduct = async () => {
    let flag = true;
    if (
      !newProduct.images.length > 0 ||
      !selectedCategories.length > 0 ||
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.available_amount ||
      // !newProduct.wholesale_offers ||
      !newProduct.description
    ) {
      alert('ادخل بيانات المنتج بشكل صحيح');
      flag = false;
    } else {
      let totalSize = 0;
      newProduct.images.forEach((im) => {
        if (!im?.type.includes('image')) {
          flag = false;
        }
        totalSize += im.size;
      });
      const totalSizeInMegabytes = totalSize / (1024 * 1024);
      if (totalSizeInMegabytes > 50) {
        alert('حجم مجموع الصور يجب ان يكون اقل من 50 ميجا');
        flag = false;
      }
    }
    if (flag) {
      const formData = new FormData();
      newProduct.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      selectedCategories.forEach((c, index) => {
        formData.append(`subcategories`, c);
      });
      // console.log(selectedCategories);
      formData.append('name', newProduct.name);
      // formData.append('subcategories', selectedCategories);
      formData.append('price', newProduct.price);
      formData.append('discount', newProduct.discount === '' ? '0' : newProduct.discount);
      formData.append('available_amount', newProduct.available_amount);

      // formData.append(
      //   'wholesale_offers',
      //   newProduct.wholesale_offers.trim() === '' ? null : newProduct.wholesale_offers
      // );
      if (newProduct.wholesale_offers.split('\n').filter((line) => line.trim() !== '').length > 0) {
        // formData.append('wholesale_offers', null);
        newProduct.wholesale_offers
          .split('\n')
          .filter((line) => line.trim() !== '')
          .forEach((offer) => {
            formData.append('wholesale_offers', offer);
          });
      }
      // console.log(formData);
      formData.append('description', newProduct.description);

      try {
        const response = await fetch(`${BACKEND_URL}/admin/addproduct`, {
          method: 'POST',
          headers: {
            // 'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: formData,
        });

        if (Number(response.status) === 200) {
          // Update admins state with the new admin
          router.reload();
        } else {
          // Handle error case
          console.error(response);

          // alert('مشكلة في سيرفر الموقع');
        }
      } catch (error) {
        console.error(error);
        alert('مشكلة في سيرفر الموقع');
      }
    }

    // console.log(newProduct.images);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/client/products/getproducts`);
        const responseCategories = await fetch(`${BACKEND_URL}/client/products/getcategories`);
        if (response.ok) {
          const result = await response.json();
          const resultCategories = await responseCategories.json();
          // console.log(result.products);
          setProducts(result.products);
          setCategoriesAndSubcategories(resultCategories.categories);

          setIsLoading(false);
        } else {
          console.error('Failed to fetch products');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [account]);

  const editAvailableAmount = async () => {
    let flag = true;
    if (!Number(p.available_amount)) {
      alert('ادخل رقم للكمية المتاحة');
      flag = false;
    }
    if (Number(p.available_amount) < 0) {
      alert('ادخل رقم للكمية المتاحة اكبر من او يساوي صفر');
      flag = false;
    }
    if (flag) {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/updateproductamount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            id: p.id,
            amount: p.available_amount,
          }),
        });
        // console.log(p.id);
        // console.log(p.available_amount);
        if (response.ok) {
          router.reload();

          // setIsLoading(false);
        } else {
          // console.error('Failed to fetch products');
          // setIsLoading(false);
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        // console.error('Error fetching products:', error);
        // setIsLoading(false);
      }
    }
  };
  const editPrice = async () => {
    let flag = true;
    if (!Number(p.price)) {
      alert('ادخل رقم للسعر');
      flag = false;
    }
    if (Number(p.price) < 0) {
      alert('ادخل رقم للسعر اكبر من او يساوي صفر');
      flag = false;
    }
    if (flag) {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/editproductprice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            id: p.id,
            price: p.price,
          }),
        });
        // console.log(p.id);
        // console.log(p.available_amount);
        if (response.ok) {
          router.reload();

          // setIsLoading(false);
        } else {
          // console.error('Failed to fetch products');
          // setIsLoading(false);
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        // console.error('Error fetching products:', error);
        // setIsLoading(false);
      }
    }
  };
  const editWholesale = async () => {
    let wholesale_offers = [''];
    // console.log(p.wholesale_offers.split('\n').filter((line) => line.trim() !== ''));
    if (p.wholesale_offers.split('\n').filter((line) => line.trim() !== '').length > 0) {
      // formData.append('wholesale_offers', null);
      wholesale_offers = p.wholesale_offers.split('\n').filter((line) => line.trim() !== '');
    }
    try {
      const response = await fetch(`${BACKEND_URL}/admin/editproductwholesale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          id: p.id,
          wholesale_offers,
        }),
      });
      // console.log(p.id);
      // console.log(p.available_amount);
      if (response.ok) {
        router.reload();

        // setIsLoading(false);
      } else {
        // console.error('Failed to fetch products');
        // setIsLoading(false);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      // console.error('Error fetching products:', error);
      // setIsLoading(false);
    }
  };
  const editDiscount = async () => {
    let flag = true;
    // let discount =0
    if (!Number(p.discount)) {
      alert('ادخل رقم للخصم');
      flag = false;
    }
    if (Number(p.discount) < 0 || Number(p.discount) >= 100) {
      alert('ادخل رقم للخصم بالنسبة المئوية اكبر من او يساوي صفر و اصغر من 100');
      flag = false;
    }
    if (flag) {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/editproductdiscount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            id: p.id,
            discount: p.discount,
          }),
        });
        // console.log(p.id);
        // console.log(p.available_amount);
        if (response.ok) {
          router.reload();

          // setIsLoading(false);
        } else {
          // console.error('Failed to fetch products');
          // setIsLoading(false);
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        // console.error('Error fetching products:', error);
        // setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        المنتجات
      </Typography>

      <Button variant="outlined" onClick={() => setShowAddProduct(true)}>
        اضف منتج
      </Button>
      {showAddProduct && (
        <Card>
          <Stack spacing={2} p={3}>
            <TextField
              label="الاسم"
              variant="outlined"
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="الوصف"
              variant="outlined"
              fullWidth
              value={newProduct.description}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              label="السعر"
              variant="outlined"
              fullWidth
              value={newProduct.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
            />
            <TextField
              label="خصم بنسبة مئوية ان وجد و يجب ان يكون قيمة من 1 ل 99"
              variant="outlined"
              fullWidth
              value={newProduct.discount}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, discount: e.target.value }))}
            />
            <TextField
              label="الكمية المتاحة"
              variant="outlined"
              fullWidth
              value={newProduct.available_amount}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, available_amount: e.target.value }))
              }
            />
            <TextField
              label="عروض الجملة"
              variant="outlined"
              fullWidth
              multiline
              value={newProduct.wholesale_offers}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  wholesale_offers: e.target.value,
                }))
              }
            />
            <Label htmlFor="images">ادخل صور بمجموع 50 ميجابايت ك حد اقصى</Label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setNewProduct((prev) => ({ ...prev, images: files }));
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="categories-label">الفئات</InputLabel>
              <Select
                labelId="categories-label"
                id="categories-select"
                multiple
                value={selectedCategories}
                onChange={handleChangeCategories}
                label="Categories"
                renderValue=""
              >
                {categoriesAndSubcategories.map(
                  (category) =>
                    // <MenuItem key={category.categoryId} value={category.categoryId}>
                    //   {category.name}

                    category.subcategories.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        &nbsp;&nbsp;&nbsp;{subcategory.name}
                      </MenuItem>
                    ))
                  // </MenuItem>
                )}
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={handleAddProduct}>
              اضف
            </Button>
          </Stack>
        </Card>
      )}

      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} xs={12} sm={6} md={3}>
              <Container>
                <Card
                  onClick={async () => {
                    await handleOpenModal(product);
                  }}
                >
                  <Box sx={{ pt: '100%', position: 'relative' }}>
                    <Box
                      component="img"
                      alt={product.name}
                      src={product.image_url}
                      sx={{
                        top: 0,
                        width: 1,
                        height: 1,
                        objectFit: 'cover',
                        position: 'absolute',
                      }}
                    />
                  </Box>
                  <Box sx={{ pt: '100%', position: 'relative' }}>
                    <Typography variant="subtitle1">
                      <Typography component="span" variant="body1">
                        {product.price} : السعر
                        {/* {product.image_url} : السعر */}
                      </Typography>
                    </Typography>
                  </Box>

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Button color="inherit" underline="hover" variant="subtitle2" noWrap>
                      {product.name}
                    </Button>

                    {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
            <ColorPreview colors={product.colors} />
            {renderPrice}
          </Stack> */}
                  </Stack>
                </Card>

                {openModal && (
                  <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>تفاصيل المنتج</DialogTitle>
                    <DialogContent>
                      <Typography variant="body1"> {p.name}</Typography>
                      <Divider />
                      <br />
                      <Typography variant="body1"> {p.description}</Typography>
                      <Divider />
                      <br />
                      <TextField
                        label="السعر بالجنيه"
                        variant="outlined"
                        fullWidth
                        value={p.price}
                        onChange={(e) => setP((prev) => ({ ...prev, price: e.target.value }))}
                      />{' '}
                      <Button onClick={editPrice} color="primary">
                        عدل السعر
                      </Button>
                      {/* <Typography variant="body1">جنيه {p.price}</Typography> */}
                      <br />
                      <Divider />
                      <TextField
                        label="الخصم بالنسبة المئوية"
                        variant="outlined"
                        fullWidth
                        value={p.discount}
                        onChange={(e) => setP((prev) => ({ ...prev, discount: e.target.value }))}
                      />{' '}
                      <Button onClick={editDiscount} color="primary">
                        عدل الخصم
                      </Button>
                      {/* <Typography variant="body1">{Number(p.discount) * 100}% خصم</Typography> */}
                      <br />
                      <Divider />
                      <br />
                      <TextField
                        label="الكمية المتاحة من المنتج"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={p.available_amount}
                        onChange={(e) =>
                          setP((prev) => ({ ...prev, available_amount: e.target.value }))
                        }
                      />{' '}
                      <Button onClick={editAvailableAmount} color="primary">
                        عدل الكمية المتاح
                      </Button>
                      <Divider />
                      <br />
                      {p?.wholesale_offers?.length > 0 ? (
                        <>
                          <TextField
                            label="عروض الجملة"
                            variant="outlined"
                            fullWidth
                            multiline
                            value={p.wholesale_offers}
                            onChange={(e) =>
                              setP((prev) => ({ ...prev, wholesale_offers: e.target.value }))
                            }
                          />{' '}
                          <Button onClick={editWholesale} color="primary">
                            عدل العرض
                          </Button>
                          {/* <Typography variant="body1"> : عروض الجملة</Typography>
                          {p?.wholesale_offers?.map((o) => (
                            <Typography variant="body1">
                              {' '}
                              {!o || o?.trim() === '' ? '' : o}
                            </Typography>
                          ))} */}
                        </>
                      ) : (
                        ''
                      )}
                      <Divider />
                      <br />
                      {p?.image_urls?.length > 0
                        ? p.image_urls.map((im) => (
                            <img src={im} alt={`Product - ${p.name}`} style={{ maxWidth: '50%' }} />
                          ))
                        : ''}
                      <Divider />
                      <br />
                      <Typography variant="body1"> : الفئات </Typography>
                      <Divider />
                      {p.categories.map((c) => (
                        <>
                          <Typography variant="body2"> {c.name} و فئاته الفرعية </Typography>
                          {c.subcategories.map((s) => (
                            <Typography variant="body2">{s.name}</Typography>
                          ))}
                          <Divider />
                        </>
                      ))}
                      <Divider />
                      <br />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={onDelete} color="error">
                        احذف المنتج
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Container>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
