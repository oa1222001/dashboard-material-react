import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { BACKEND_URL } from 'src/utils/constants';

// ----------------------------------------------------------------------

export default function UserTableRow({
  role,
  name,
  avatarUrl,
  email,
  number,
  id,
  router,
  account,
}) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/deleteadmin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${account.token}`,
        },
        body: JSON.stringify({
          email,
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

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={avatarUrl} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>{email}</TableCell>

      <TableCell>{number}</TableCell>
      <TableCell>{role}</TableCell>

      <TableCell>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  account: PropTypes.any,
  email: PropTypes.any,
  name: PropTypes.any,
  number: PropTypes.any,
  id: PropTypes.any,
  role: PropTypes.any,
  router: PropTypes.any,
};
