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

export default function ContactUsMessagesPage() {
  const [Messages, setMessages] = useState([
    { _id: '1', name: 'name', email: 'email', number: 'number', message: 'message' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const account = useContext(accountContext);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (account.token !== '') {
        try {
          const responseMessages = await fetch(`${BACKEND_URL}/admin/getcontactus`, {
            headers: {
              authorization: `Bearer ${account.token}`,
            },
          });

          if (Number(responseMessages.status) === 200) {
            const resultMessages = await responseMessages.json();
            // console.log(resultMessages.messages);
            resultMessages.messages.sort((a, b) => new Date(b.date) - new Date(a.date));

            setMessages((prev) => [...resultMessages.messages]);
            setIsLoading(false);
          } else {
            alert('مشكلة في سيرفر الموقع');
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
        <Typography variant="h4">رسائل العملاء</Typography>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                rowCount={Messages?.length ? Messages.length : 0}
                headLabel={[
                  { id: 'name', label: 'الاسم' },
                  { id: 'email', label: 'الايميل' },
                  { id: 'number', label: 'رقم التليفون' },
                  { id: 'message', label: 'الرسالة' },
                ]}
              />
              <TableBody>
                {Messages.map((row) => (
                  <UserTableRow
                    router={router}
                    key={row._id}
                    id={row._id}
                    name={row.name}
                    number={row.number}
                    email={row.email}
                    message={row.message}
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
