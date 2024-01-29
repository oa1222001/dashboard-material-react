import React, { useState, useEffect, useContext } from 'react';

import {
  Grid,
  List,
  Select,
  Button,
  Divider,
  ListItem,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { BACKEND_URL, accountContext } from 'src/utils/constants';

export default function AppView() {
  const [isLoading, setIsLoading] = useState(true);
  const account = useContext(accountContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    logo: '/logo.png',
    email: '',
    number: '',
    location: '',
    socialMedia: {
      Facebook: '',
      Youtube: '',
      Instagram: '',
    },
    cities: [
      { name: 'City1', price: '100' },
      { name: 'City2', price: '150' },
    ],
    isAddingCity: false,
    promocodes: [
      { type: 'client', discount: { type: 'amount', value: '2222' }, promocode: '99999' },
    ],
    slider: [
      { id: 1, image: '/path/to/image1.jpg', title: 'Slide 1', description: 'Description 1' },
      { id: 2, image: '/path/to/image2.jpg', title: 'Slide 2', description: 'Description 2' },
      { id: 3, image: '/path/to/image3.jpg', title: 'Slide 3', description: 'Description 3' },
    ],
    aboutProducts: {
      image: '/path/to/about-image.jpg',
      message: 'Our products are amazing!',
    },
    faq: [
      {
        id: 1,
        question: 'What is the first question?',
        answer: 'This is the answer to the first question.',
      },
      {
        id: 2,
        question: 'What is the second question?',
        answer: 'This is the answer to the second question.',
      },
      {
        id: 3,
        question: 'What is the third question?',
        answer: 'This is the answer to the third question.',
      },
      {
        id: 4,
        question: 'What is the fourth question?',
        answer: 'This is the answer to the fourth question.',
      },
    ],
  });

  useEffect(() => {
    const loadData = async () => {
      if (account.token !== '') {
        try {
          const responseLogoCallusSocialmedia = await fetch(`${BACKEND_URL}/admin/getbasicpage`, {
            headers: {
              authorization: `Bearer ${account.token}`,
            },
          });
          const responseCities = await fetch(`${BACKEND_URL}/client/unauthcart/getcitydelivery`);
          const responsePromocodes = await fetch(`${BACKEND_URL}/admin/getpromocodes`, {
            headers: {
              authorization: `Bearer ${account.token}`,
            },
          });
          const responseSlider = await fetch(`${BACKEND_URL}/client/home/getslider`);
          const responseAboutProducts = await fetch(`${BACKEND_URL}/client/home/aboutproducts`);
          const responseFaq = await fetch(`${BACKEND_URL}/client/basic/faq`);

          if (
            Number(responseLogoCallusSocialmedia.status) === 200 &&
            Number(responseCities.status) === 200 &&
            Number(responsePromocodes.status) === 200 &&
            Number(responseSlider.status) === 200 &&
            Number(responseAboutProducts.status) === 200 &&
            Number(responseFaq.status) === 200
          ) {
            const resultLogocallussocial = await responseLogoCallusSocialmedia.json();
            const resultCities = await responseCities.json();
            const resultSlider = await responseSlider.json();
            const resultAboutProducts = await responseAboutProducts.json();
            const resultPromocodes = await responsePromocodes.json();
            const resultFaq = await responseFaq.json();
            // console.log(resultLogocallussocial);
            // console.log(resultCities);
            // console.log(resultAboutProducts);
            // console.log(resultPromocodes);
            console.log(resultSlider);
            // console.log(resultFaq);

            setIsLoading(false);

            setFormData({
              logo: resultLogocallussocial.logo,
              email: resultLogocallussocial.call_us.email,
              number: resultLogocallussocial.call_us.number,
              location: resultLogocallussocial.call_us.location,
              socialMedia: {
                Facebook: resultLogocallussocial.socialmedia.facebook,
                Youtube: resultLogocallussocial.socialmedia.youtube,
                Instagram: resultLogocallussocial.socialmedia.instagram,
              },
              cities: resultCities.cities.map((c) => ({
                name: c.name,
                price: c.delivery_price,
                id: c.id,
              })),
              promocodes: resultPromocodes.promocodes.map((p) => ({
                promocode: p.promocode,
                type: p.type,
                id: p._id,
                discount: p.discount,
              })),
              slider: resultSlider.slider.map((s) => ({
                id: s.id,
                image: s.image_url,
                title: s.title,
                description: s.description,
              })),
              aboutProducts: {
                image: resultAboutProducts.image,
                message: resultAboutProducts.aboutProducts,
              },
              faq: resultFaq.faq.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
            });
          } else {
            // alert('مشكلة في سيرفر الموقع');
          }
        } catch (error) {
          console.error(error);
          alert('مشكلة في سيرفر الموقع');
        }
      }
    };
    loadData();
  }, [account]);

  const handleLogoChange = (e) => {
    setFormData((prev) => ({ ...prev, logoFile: e.target.files[0] }));
  };

  const handleLogoUpload = async () => {
    const form = new FormData();
    form.append('image', formData.logoFile);

    try {
      console.log(account.token);
      const response = await fetch(`${BACKEND_URL}/admin/editlogo`, {
        method: 'POST',
        body: form,
        headers: {
          authorization: `Bearer ${account.token}`, // Include the authorization header
        },
      });

      if (response.ok) {
        router.reload();
        console.log('Logo uploaded successfully!');
        // You may update the state or perform additional actions upon success
      } else {
        console.error('Logo upload failed.');
        console.log(response);
      }
    } catch (error) {
      console.error('Error uploading logo:', error.message);
    }
  };

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.number || !formData.location) {
      alert('ادخل بيانات التواصل');
    } else {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/editcontactus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            email: formData.email,
            location: formData.location,
            number: formData.number,
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
    }
  };

  const handleSocialMediaSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.socialMedia.Facebook ||
      !formData.socialMedia.Youtube ||
      !formData.socialMedia.Instagram
    ) {
      alert('ادخل بيانات روابط التواصل');
    } else {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/editsocialmedia`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            facebook: formData.socialMedia.Facebook,
            youtube: formData.socialMedia.Youtube,
            instagram: formData.socialMedia.Instagram,
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
    }
  };

  const handleDeleteCity = async (index) => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/deletecity`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          id: index,
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

  const handleAddCity = async () => {
    if (formData.newCityName && formData.newCityPrice) {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/addcity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            name: formData.newCityName,
            price: formData.newCityPrice,
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
    } else {
      alert('يرجى إدخال اسم المدينة وسعر التوصيل');
    }
  };

  const handlePromoCodeSubmit = async () => {
    if (
      formData?.newPromocode &&
      formData?.newPromocodeType &&
      formData?.newDiscountValue &&
      formData?.newDiscountType
    ) {
      let discountvalue;
      if (formData.newDiscountType === 'amount' && Number(formData.newDiscountValue)) {
        discountvalue = formData.newDiscountValue;
      } else if (
        formData.newDiscountType === 'percentage' &&
        Number(formData.newDiscountValue) &&
        Number(formData.newDiscountValue) < 100 &&
        Number(formData.newDiscountValue) > 0
      ) {
        discountvalue = Number(formData.newDiscountValue) / 100;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/admin/addpromocode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            promocode: formData.newPromocode,
            type: formData.newPromocodeType,
            discount: {
              type: formData.newDiscountType,
              value: discountvalue.toString(),
            },
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
    } else {
      alert('يرجى ادخال البيانات بشكل صحيح في الخصومات');
    }
  };

  const handleDeletePromoCode = async (index) => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/deletepromocode`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          id: index,
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

  const handleDeleteSlide = (id) => {
    setFormData({
      ...formData,
      slider: formData.slider.filter((slide) => slide.id !== id),
    });
  };

  const handleSliderImageAdd = (e) => {
    setFormData((prev) => ({ ...prev, newSlideImage: e.target.files[0] }));
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: formData.slider.length + 1,
      image: '',
      title: '',
      description: '',
    };

    setFormData({
      ...formData,
      slider: [...formData.slider, newSlide],
    });
  };

  const handleAboutProductsSubmit = async () => {
    try {
      const response = await fetch('YOUR_BACKEND_ABOUT_PRODUCTS_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: formData.aboutProducts.image,
          message: formData.aboutProducts.message,
        }),
      });

      if (response.ok) {
        console.log('About Products data submitted successfully!');
        // You may update the state or perform additional actions upon success
      } else {
        console.error('About Products data submission failed.');
      }
    } catch (error) {
      console.error('Error submitting About Products data:', error.message);
    }
  };

  const handleEditFAQ = (index, field, value) => {
    const updatedFAQ = [...formData.faq];
    updatedFAQ[index][field] = value;
    setFormData({ ...formData, faq: updatedFAQ });
  };

  const handleDeleteFAQ = (id) => {
    setFormData({
      ...formData,
      faq: formData.faq.filter((item) => item.id !== id),
    });
  };

  const handleAddFAQ = () => {
    const newFAQ = {
      id: formData.faq.length + 1,
      question: '',
      answer: '',
    };

    setFormData({
      ...formData,
      faq: [...formData.faq, newFAQ],
    });
  };

  const handleFAQSubmit = async () => {
    try {
      const response = await fetch('YOUR_BACKEND_FAQ_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.faq),
      });

      if (response.ok) {
        console.log('FAQ data submitted successfully!');
        // You may update the state or perform additional actions upon success
      } else {
        console.error('FAQ data submission failed.');
      }
    } catch (error) {
      console.error('Error submitting FAQ data:', error.message);
    }
  };

  return isLoading ? (
    <CircularProgress color="inherit" />
  ) : (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Logo Section */}
        <Grid item xs={12}>
          <img src={formData.logo} alt="Logo" style={{ maxWidth: '100%' }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            اللوجو
          </Typography>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          <Button variant="contained" color="primary" onClick={handleLogoUpload}>
            ارفع اللوجو
          </Button>
        </Grid>

        {/* User Data Section */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            معلومات الاتصال بنا
          </Typography>
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
          <TextField
            label="Phone Number"
            value={formData.number}
            onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
          />
          <TextField
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          />
          <Button variant="contained" color="primary" onClick={handleUserDataSubmit}>
            احفظ معلومات الاتصال بنا
          </Button>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            روابط التواصل الاجتماعي
          </Typography>
          {Object.keys(formData.socialMedia).map((platform) => (
            <TextField
              key={platform}
              label={platform}
              value={formData.socialMedia[platform]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, [platform]: e.target.value },
                })
              }
            />
          ))}
          <Button variant="contained" color="primary" onClick={handleSocialMediaSubmit}>
            احفظ روابط التواصل الاجتماعي
          </Button>
        </Grid>

        {/* Cities Section */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            المدن المدعوم التوصيل لها
          </Typography>
          <List>
            {formData.cities.map((city, index) => (
              <ListItem key={city.id}>
                <ListItemText primary={`${city.name}  -  السعر: ${city.price}`} />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteCity(city.id)}
                >
                  امسح
                </Button>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormData((prev) => ({ ...prev, isAddingCity: true }))}
          >
            إضافة مدينة
          </Button>

          {/* Display Input Fields for Adding City */}
          {formData.isAddingCity && (
            <div>
              <TextField
                label="اسم المدينة"
                value={formData.newCityName}
                onChange={(e) => setFormData((prev) => ({ ...prev, newCityName: e.target.value }))}
              />
              <TextField
                label="سعر التوصيل"
                value={formData.newCityPrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, newCityPrice: e.target.value }))}
              />
              <Button variant="contained" color="primary" onClick={handleAddCity}>
                إضافة
              </Button>
            </div>
          )}
        </Grid>

        {/* Promo Codes Section */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            اكواد خصومات
          </Typography>
          <List>
            {formData.promocodes.map((p, index) => (
              <ListItem key={p.id}>
                <ListItemText primary={`${p?.promocode},`} />
                <ListItemText primary={`${p?.type === 'client' ? 'عميل' : 'بائع'} ,`} />

                <ListItemText
                  primary={
                    p.discount.type === 'amount'
                      ? `${p.discount.value} جنيه ,`
                      : `${Number(p.discount.value) * 100}%`
                  }
                />
                <ListItemText
                  primary={`${p.discount.type === 'amount' ? 'قيمة مالية' : 'نسبة مئوية'}   `}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePromoCode(p.id)}
                >
                  امسح
                </Button>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormData((prev) => ({ ...prev, isAddingPromocode: true }))}
          >
            إضافة خصم
          </Button>

          {/* Display Input Fields for Adding City */}
          {formData.isAddingPromocode && (
            <div>
              <TextField
                label="البروموكود"
                value={formData.newPromocode}
                onChange={(e) => setFormData((prev) => ({ ...prev, newPromocode: e.target.value }))}
              />
              <InputLabel id="newPromocodeTypeLabel">نوع البروموكود</InputLabel>
              <Select
                labelId="newPromocodeTypeLabel"
                label="بروموكود عن طريق بائع ام عميل"
                value={formData.newPromocodeType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newPromocodeType: e.target.value }))
                }
              >
                <MenuItem value="client">عميل</MenuItem>
                <MenuItem value="seller">بائع</MenuItem>
              </Select>
              <InputLabel id="newDiscountTypeLabel">نوع الخصم</InputLabel>
              <Select
                labelId="newDiscountTypeLabel"
                label="نوع الخصم"
                value={formData.newDiscountType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newDiscountType: e.target.value }))
                }
              >
                <MenuItem value="percentage">مئوي</MenuItem>
                <MenuItem value="amount">قيمة مالية</MenuItem>
              </Select>
              <InputLabel id="valuePromocode">
                قيمة الخصم, لو نسبة ف يجب ان تكون من 0 الى 100
              </InputLabel>

              <TextField
                labelId="valuePromocode"
                label="قيمة الخصم بالقيمة المالية او بالنسبة المئوية, لو بالنسبة ف يجب ان تكون رقم بين 1 و100"
                value={formData.newDiscountValue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newDiscountValue: e.target.value }))
                }
              />

              <Button variant="contained" color="primary" onClick={handlePromoCodeSubmit}>
                إضافة
              </Button>
            </div>
          )}
        </Grid>
        <Typography variant="h6" sx={{ mb: 2 }}>
          سلايدر الصفحة الرئيسية
        </Typography>
        {/* Slider Section */}
        <Grid item xs={12}>
          {formData.slider.map((slide) => (
            <div key={slide.id}>
              <img src={slide.image} alt={slide.title} style={{ maxWidth: '20%' }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                {slide.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {slide.description}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteSlide(slide.id)}
              >
                امسح
              </Button>
              <Divider sx={{ my: 2 }} />
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setFormData((prev) => ({ ...prev, isAddingSlider: true }));
            }}
          >
            اضف
          </Button>
          {formData.isAddingSlider && (
            <div>
              <input type="file" accept="image/*" onChange={handleSliderImageAdd} />

              <TextField
                label="Title"
                value={formData.newSlideTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newSlideTitle: e.target.value }))
                }
              />
              <TextField
                label="Description"
                value={formData.newSlideDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newSlideDescription: e.target.value }))
                }
              />
              <Button variant="contained" color="primary" onClick={handleAddSlide}>
                احفظ
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
      {/* about products section  */}
      <Grid item xs={12} mt={4}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          About Our Products
        </Typography>
        <img src={formData.aboutProducts.image} alt="About Products" style={{ maxWidth: '100%' }} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({
              ...formData,
              aboutProducts: { ...formData.aboutProducts, image: e.target.files[0] },
            })
          }
        />
        <TextField
          label="Message"
          value={formData.aboutProducts.message}
          onChange={(e) =>
            setFormData({
              ...formData,
              aboutProducts: { ...formData.aboutProducts, message: e.target.value },
            })
          }
        />
        <Button variant="contained" color="primary" onClick={handleAboutProductsSubmit}>
          Submit About Products
        </Button>
      </Grid>

      {/* faq section */}
      <Grid item xs={12} mt={4}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          FAQs
        </Typography>
        {formData.faq.map((item, index) => (
          <div key={index}>
            <TextField
              label={`Question ${index + 1}`}
              value={item.question}
              onChange={(e) => handleEditFAQ(index, 'question', e.target.value)}
            />
            <TextField
              label={`Answer ${index + 1}`}
              value={item.answer}
              onChange={(e) => handleEditFAQ(index, 'answer', e.target.value)}
            />
            <Button variant="contained" color="secondary" onClick={() => handleDeleteFAQ(item.id)}>
              Delete FAQ
            </Button>
            <Divider sx={{ my: 2 }} />
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddFAQ}>
          Add FAQ
        </Button>
        <Button variant="contained" color="primary" onClick={handleFAQSubmit}>
          Submit FAQs
        </Button>
      </Grid>
    </Container>
  );
}
