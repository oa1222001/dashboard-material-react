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

// import ShopProductCard from '../product-card';

// ----------------------------------------------------------------------

export default function CategoriesView() {
  const router = useRouter();
  const account = useContext(accountContext);

  const [newCategory, setNewCategory] = useState([
    {
      id: '65abad6425715658c6d165cf',
      subcat: ['1', '3'],
    },
  ]);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState({});

  const handleOpenModal = async (categor) => {
    setCategory(categor);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewSubCategory('');
  };

  const [showAddCategory, setShowAddCategory] = useState(false); // State to manage visibility

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const onDelete = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/deletecategory`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          id: category.id,
        }),
      });
      if (Number(response.status) === 200) {
        router.reload();
      } else {
        console.log(response);
        alert('مشكلة في سيرفر الموقع');
      }
    } catch (error) {
      console.error(error);
      alert('مشكلة في سيرفر الموقع');
    }
  };

  const handleAddCategory = async () => {
    const form = new FormData();
    form.append('image', newCategory.image);
    form.append('name', newCategory.name);
    console.log(newCategory);

    try {
      // console.log(account.token);
      const response = await fetch(`${BACKEND_URL}/admin/addcategory`, {
        method: 'POST',
        body: form,
        headers: {
          authorization: `Bearer ${account.token}`, // Include the authorization header
        },
      });

      if (response.ok) {
        router.reload();
        // console.log('Logo uploaded successfully!');
        // You may update the state or perform additional actions upon success
      } else {
        // console.error('Logo upload failed.');
        console.log(response);
      }
    } catch (error) {
      console.error('Error uploading logo:', error.message);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/addsubcat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          id: category.id,
          name: newSubCategory,
        }),
      });
      if (response.ok) {
        router.reload();
      } else {
        alert('مشكلة في سيرفر الموقع');
      }
    } catch (error) {
      console.error(error);
      alert('مشكلة في سيرفر الموقع');
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/client/products/getcategories`);
        if (response.ok) {
          const result = await response.json();
          console.log(result.categories);
          setCategories(result.categories);

          setIsLoading(false);
        } else {
          console.error('Failed to fetch categories');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [account]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        الفئات
      </Typography>

      <Button variant="outlined" onClick={() => setShowAddCategory(true)}>
        اضف فئة
      </Button>
      {showAddCategory && (
        <Card>
          <Stack spacing={2} p={3}>
            <TextField
              label="الاسم"
              variant="outlined"
              fullWidth
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
            />

            <input
              type="file"
              onChange={(e) => {
                setNewCategory((prev) => ({ ...prev, image: e.target.files[0] }));
              }}
            />
            <Button variant="contained" color="primary" onClick={handleAddCategory}>
              اضف
            </Button>
          </Stack>
        </Card>
      )}

      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid key={cat.id} xs={12} sm={6} md={3}>
              <Container>
                <Card
                  onClick={async () => {
                    await handleOpenModal(cat);
                  }}
                >
                  <Box sx={{ pt: '100%', position: 'relative' }}>
                    <Box
                      component="img"
                      alt={cat.name}
                      src={cat.image_url}
                      sx={{
                        top: 0,
                        width: 1,
                        height: 1,
                        objectFit: 'cover',
                        position: 'absolute',
                      }}
                    />
                  </Box>
                  {/* <Box sx={{ pt: '100%', position: 'relative' }}>
                    <Typography variant="subtitle1">
                      <Typography component="span" variant="body1">
                        {product.price} : السعر
                      </Typography>
                    </Typography>
                  </Box> */}

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Button color="inherit" underline="hover" variant="subtitle2" noWrap>
                      {cat.name}
                    </Button>

                    {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
            <ColorPreview colors={product.colors} />
            {renderPrice}
          </Stack> */}
                  </Stack>
                </Card>

                {openModal && (
                  <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle> تفاصيل الفئة : {category.name} </DialogTitle>
                    <DialogContent>
                      {category.subcategories.map((c) => (
                        <>
                          <Typography variant="body2"> {c.name} </Typography>

                          <Divider />
                        </>
                      ))}
                      <Divider />
                      <br />
                      <TextField
                        label="اضف اسم فئة فرعية"
                        variant="outlined"
                        fullWidth
                        value={newSubCategory}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                      />
                      <Button variant="contained" color="primary" onClick={handleAddSubcategory}>
                        اضف
                      </Button>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={onDelete} color="error">
                        احذف الفئة
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
