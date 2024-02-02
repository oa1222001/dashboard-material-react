import { useState, useEffect, useContext } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';

import { BACKEND_URL, accountContext } from 'src/utils/constants';

import Scrollbar from 'src/components/scrollbar';

import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [clients, setClients] = useState([
    { id: '1', name: 'name', email: 'email', number: 'number' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const account = useContext(accountContext);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (account.token !== '') {
        try {
          const responseClients = await fetch(`${BACKEND_URL}/admin/getclients`, {
            headers: {
              authorization: `Bearer ${account.token}`,
            },
          });

          if (Number(responseClients.status) === 200) {
            const resultClients = await responseClients.json();
            // console.log(resultClients.clients);

            setClients((prev) => [...resultClients.clients]);
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
  return isLoading ? (
    <CircularProgress color="inherit" />
  ) : (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">العملاء</Typography>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                rowCount={clients?.length ? clients.length : 0}
                headLabel={[
                  { id: 'name', label: 'الاسم' },
                  { id: 'email', label: 'الايميل' },
                  { id: 'number', label: 'رقم التليفون' },
                ]}
              />
              <TableBody>
                {clients.map((row) => (
                  <UserTableRow
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
