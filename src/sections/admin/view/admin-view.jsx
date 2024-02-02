import { useState, useEffect, useContext } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Button, TextField, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { BACKEND_URL, accountContext } from 'src/utils/constants';

import Scrollbar from 'src/components/scrollbar';

import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';

// ----------------------------------------------------------------------

export default function AdminPage() {
  const [admins, setAdmins] = useState([
    { id: '1', name: 'name', email: 'email', number: 'number' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false); // State to manage visibility
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  });

  const account = useContext(accountContext);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (account.token !== '') {
        try {
          const responseAdmins = await fetch(`${BACKEND_URL}/admin/getadmins`, {
            headers: {
              authorization: `Bearer ${account.token}`,
            },
          });

          if (Number(responseAdmins.status) === 200) {
            const resultAdmins = await responseAdmins.json();
            // console.log(account.token);

            setAdmins((prev) => [...resultAdmins.admins]);
            setIsLoading(false);
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

  const handleAddAdmin = async () => {
    // Implement your logic to add a new admin
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password || !newAdmin.number) {
      alert('ادخل بيانات الادمن بشكل صحيح كما هو موضح و الرقم الدولي يبدأ ب +');
    } else {
      try {
        const response = await fetch(`${BACKEND_URL}/admin/addadmin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify({
            name: newAdmin.name,
            email: newAdmin.email,
            number: newAdmin.number,
            password: newAdmin.password,
          }),
        });

        if (Number(response.status) === 200) {
          // Update admins state with the new admin
          router.reload();
        } else {
          // Handle error case
          // console.error(response);

          alert('مشكلة في سيرفر الموقع, تأكد من ان بياناتك سليمة');
        }
      } catch (error) {
        console.error(error);
        alert('مشكلة في سيرفر الموقع');
      }
    }
  };

  return isLoading ? (
    <CircularProgress color="inherit" />
  ) : (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Admins</Typography>
        {/* Add Admin Button */}
        <Button variant="outlined" onClick={() => setShowAddAdmin(true)}>
          اضف ادمن
        </Button>
      </Stack>

      {/* Add Admin Form */}
      {showAddAdmin && (
        <Card>
          <Stack spacing={2} p={3}>
            <TextField
              label="الاسم"
              variant="outlined"
              fullWidth
              value={newAdmin.name}
              onChange={(e) => setNewAdmin((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="الايميل"
              variant="outlined"
              fullWidth
              value={newAdmin.email}
              onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              label=" رقم الموبايل مثل بالكود الدولي"
              variant="outlined"
              fullWidth
              value={newAdmin.number}
              onChange={(e) => setNewAdmin((prev) => ({ ...prev, number: e.target.value }))}
            />
            <TextField
              label="كلمة السر من 8 حروف عالاقل"
              variant="outlined"
              fullWidth
              value={newAdmin.password}
              onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
            />
            <Button variant="contained" color="primary" onClick={handleAddAdmin}>
              اضف
            </Button>
          </Stack>
        </Card>
      )}

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                rowCount={admins?.length ? admins.length : 0}
                headLabel={[
                  { id: 'name', label: 'الاسم' },
                  { id: 'email', label: 'الايميل' },
                  { id: 'number', label: 'رقم التليفون' },
                ]}
              />
              <TableBody>
                {admins.map((row) => (
                  <UserTableRow
                    account={account}
                    router={router}
                    key={row.id}
                    id={row.id}
                    name={row.name}
                    number={row.number}
                    email={row.email}
                  />
                ))}

                {/* <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                /> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}
