'use client';

import React from 'react';
import { TableRow, TableCell, Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Customer } from '@/interfaces/Customer';
import { useRouter } from 'next/navigation';

interface CustomerRowProps {
  customer: Customer;
  getStatusColor: (status: Customer['status']) => { bgColor: string; textColor: string };
}

const CustomerRow: React.FC<CustomerRowProps> = ({ customer, getStatusColor }) => {
  const router = useRouter();
  const statusColors = getStatusColor(customer.status);

  return (
    <TableRow hover>
      <TableCell>{`${customer.name} ${customer.lastName}`}</TableCell>
      <TableCell>{customer.nDni}</TableCell>
      <TableCell>{customer.email}</TableCell>
      <TableCell>{customer.phone}</TableCell>
      <TableCell>
        <Chip
          label={customer.status}
          sx={{
            backgroundColor: statusColors.bgColor,
            color: statusColors.textColor,
            fontWeight: 'bold',
          }}
        />
      </TableCell>
      <TableCell align="center">
        <IconButton
          color="primary"
          onClick={() => router.push(`/customers/${customer.nDni}`)}
        >
          <VisibilityIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CustomerRow;
