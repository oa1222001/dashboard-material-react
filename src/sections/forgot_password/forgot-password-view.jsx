import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { BACKEND_URL } from 'src/utils/constants';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const onChangeEmail = (e) => {
    setEmail(e.target.value.trim());
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value.trim());
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('ادخل ايميل صحيح و كلمة سر صحيحة');
    } else {
      try {
        const response = await fetch(`${BACKEND_URL}/client/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Replace with your actual data
        });
        if (Number(response.status) === 200) {
          const result = await response.json();
          if (result.role.toLowerCase() === 'admin' || result.role.toLowerCase() === 'superadmin') {
            localStorage.setItem('token', result.token);
            router.replace('/');
          } else {
            alert('غير مصرح لك بالدخول هنا');
          }
        } else {
          alert('ادخل ايميل صحيح و كلمة سر صحيحة');
        }
      } catch (error) {
        console.error(error);
        alert('مشكلة في سيرفر الموقع');
      }
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={onChangeEmail} value={email} />

        <TextField
          value={password}
          name="password"
          label="Password"
          onChange={onChangePassword}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" href="sdds">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Dashboard</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
