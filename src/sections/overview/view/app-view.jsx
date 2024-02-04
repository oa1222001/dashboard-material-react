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
            // console.log(resultSlider);
            // console.log(resultFaq);

            setIsLoading(false);

            // console.log(resultLogocallussocial);

            setFormData({
              logo: resultLogocallussocial.logo,
              email: resultLogocallussocial.call_us.email,
              number: resultLogocallussocial.call_us.number,
              location: resultLogocallussocial.call_us.location,
              socialMedia: {
                Facebook: resultLogocallussocial.socialmedia.facebook,
                Instagram: resultLogocallussocial.socialmedia.instagram,
                Snapchat: resultLogocallussocial.socialmedia.snapchat,
                Tiktok: resultLogocallussocial.socialmedia.tiktok,
                'X (Twitter)': resultLogocallussocial.socialmedia['x (twitter)'],
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
    let flag = true;

    if (!formData.logoFile || !formData.logoFile?.type?.includes('image')) {
      alert('ادخل صورة لوجو');
      flag = false;
    } else {
      const fileSizeInMegabytes = formData.logoFile / (1024 * 1024); // Convert bytes to megabytes

      if (fileSizeInMegabytes > 10) {
        alert('الصورة يجب ان تكون اقل من 10 ميجابايت');
        flag = false;
      }
    }
    if (flag) {
      const form = new FormData();
      form.append('image', formData.logoFile);
      console.log(formData.logoFile.type);
      try {
        const response = await fetch(`${BACKEND_URL}/admin/editlogo`, {
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
        console.error(error);
      }
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
      !formData.socialMedia.Snapchat ||
      !formData.socialMedia.Tiktok ||
      !formData.socialMedia['X (Twitter)'] ||
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
            instagram: formData.socialMedia.Instagram,
            snapchat: formData.socialMedia.Snapchat,
            tiktok: formData.socialMedia.Tiktok,
            twitter: formData.socialMedia['X (Twitter)'],
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
    let flag = true;
    if (
      !formData?.newPromocode &&
      !formData?.newPromocodeType &&
      !formData?.newDiscountValue &&
      !formData?.newDiscountType
    ) {
      // console.log(formData);
      alert('يرجى ادخال البيانات بشكل صحيح في الخصومات');
      flag = false;
    }
    if (!Number(formData?.newDiscountValue)) {
      alert('يرجى ادخال قيمة الخصم ك رقم كما هو موضح');
      flag = false;
    }
    if (Number(formData?.newDiscountValue) <= 0 && formData?.newDiscountType === 'amount') {
      alert('قيمة الخصم يجب ان تكون موجبة');
      flag = false;
    }
    if (
      formData?.newDiscountType === 'percentage' &&
      (!Number(formData?.newDiscountValue) ||
        Number(formData?.newDiscountValue) >= 100 ||
        Number(formData?.newDiscountValue) <= 0)
    ) {
      flag = false;
      alert('ادخل قيمة خصم ابتداءا من 1 و اصغر من مئة');
    }

    if (flag) {
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
        console.log(discountvalue);
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

  const handleDeleteSlide = async (index) => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/deletesliderimage`, {
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

  const handleSliderImageAdd = (e) => {
    setFormData((prev) => ({ ...prev, newSlideImage: e.target.files[0] }));
  };

  const handleAddSlide = async () => {
    let flag = true;
    if (
      !formData.newSlideImage ||
      !formData.newSlideImage?.type?.includes('image') ||
      !formData.newSlideTitle ||
      !formData.newSlideDescription
    ) {
      alert('ادخل بيانات السلايد بشكل صحيح, صورة و عنوان و وصف');
      flag = false;
    } else {
      const fileSizeInMegabytes = formData.newSlideImage / (1024 * 1024); // Convert bytes to megabytes

      if (fileSizeInMegabytes > 10) {
        alert('الصورة يجب ان تكون اقل من 10 ميجابايت');
        flag = false;
      }
    }
    if (flag) {
      const form = new FormData();
      form.append('image', formData.newSlideImage);
      form.append('title', formData.newSlideTitle);
      form.append('description', formData.newSlideDescription);

      try {
        // console.log(account.token);
        const response = await fetch(`${BACKEND_URL}/admin/addsliderimage`, {
          method: 'POST',
          body: form,
          headers: {
            authorization: `Bearer ${account.token}`, // Include the authorization header
          },
        });

        if (response.ok) {
          router.reload();
          // console.log('Slider uploaded successfully!');
          // You may update the state or perform additional actions upon success
        } else {
          // console.error('Slider upload failed.');
          console.log(response);
        }
      } catch (error) {
        console.error('Error uploading Slider:', error.message);
      }
    }
  };

  const handleAboutProductsSubmit = async () => {
    let flag = true;
    if (
      !formData.aboutProducts.newAboutImage ||
      !formData.aboutProducts.newAboutImage?.type?.includes('image') ||
      !formData.aboutProducts.message
    ) {
      alert('ادخل بيانات عن منتجاتنا بشكل صحيح, صورة و وصف');
      flag = false;
    } else {
      const fileSizeInMegabytes = formData.aboutProducts.newAboutImage / (1024 * 1024); // Convert bytes to megabytes

      if (fileSizeInMegabytes > 10) {
        alert('الصورة يجب ان تكون اقل من 10 ميجابايت');
        flag = false;
      }
    }

    if (flag) {
      const form = new FormData();
      form.append('image', formData.aboutProducts.newAboutImage);
      form.append('message', formData.aboutProducts.message);

      try {
        // console.log(account.token);
        const response = await fetch(`${BACKEND_URL}/admin/editaboutproducts`, {
          method: 'POST',
          body: form,
          headers: {
            authorization: `Bearer ${account.token}`, // Include the authorization header
          },
        });

        if (response.ok) {
          router.reload();
          // console.log('Slider uploaded successfully!');
          // You may update the state or perform additional actions upon success
        } else {
          // console.error('Slider upload failed.');
          console.log(response);
        }
      } catch (error) {
        console.error('Error uploading Slider:', error.message);
      }
    }
  };

  const handleDeleteFAQ = async (index) => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/deletefaq`, {
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

  const handleAddFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      isAddingFaq: true,
    }));
  };

  const handleSubmitFaq = async () => {
    if (formData.newFaqQuestion && formData.newFaqAnswer) {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/addfaq`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            question: formData.newFaqQuestion,
            answer: formData.newFaqAnswer,
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
      alert('يرجى إدخال بيانات في السؤال والجواب');
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
            المدن المدعوم التوصيل لها و اسعارها
          </Typography>
          <List>
            {formData.cities.map((city, index) => (
              <ListItem key={city.id}>
                <ListItemText primary={`${city.name}  `} />
                <ListItemText primary={` ${city.price}  `} />
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
                <ListItemText primary={`${p?.promocode}`} />
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
                قيمة الخصم, لو نسبة ف يجب ان تكون من 1 الى 100
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
                label="عنوان"
                value={formData.newSlideTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newSlideTitle: e.target.value }))
                }
              />
              <TextField
                label="وصف"
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
          عن منتجاتنا
        </Typography>
        <img src={formData.aboutProducts.image} alt="About Products" style={{ maxWidth: '100%' }} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              aboutProducts: { ...formData.aboutProducts, newAboutImage: e.target.files[0] },
            }))
          }
        />
        <TextField
          label="الرسالة"
          value={formData.aboutProducts.message}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              aboutProducts: { ...formData.aboutProducts, message: e.target.value },
            }))
          }
        />
        <Button variant="contained" color="primary" onClick={handleAboutProductsSubmit}>
          احفظ
        </Button>
      </Grid>

      {/* faq section */}
      <Grid item xs={12} mt={4}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          الأسئلة الشائعة
        </Typography>
        {formData.faq.map((item, index) => (
          <div key={index}>
            <Typography variant="body1">
              <strong>السؤال:</strong> {item.question}
            </Typography>
            <Typography variant="body1">
              <strong>الجواب:</strong> {item.answer}
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteFAQ(item.id)}>
              احذف
            </Button>
            <Divider sx={{ my: 2 }} />
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddFAQ}>
          إضافة سؤال جديد
        </Button>
        {formData.isAddingFaq && (
          <div>
            <TextField
              label="السؤال"
              value={formData.newFaqQuestion}
              onChange={(e) => setFormData((prev) => ({ ...prev, newFaqQuestion: e.target.value }))}
            />
            <TextField
              label="جواب"
              value={formData.newFaqAnswer}
              onChange={(e) => setFormData((prev) => ({ ...prev, newFaqAnswer: e.target.value }))}
            />
            <Button variant="contained" color="primary" onClick={handleSubmitFaq}>
              احفظ
            </Button>
          </div>
        )}
      </Grid>
    </Container>
  );
}
