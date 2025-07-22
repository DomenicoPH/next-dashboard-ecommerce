'use client';

import { useParams } from 'next/navigation';
import { Customer } from '@/interfaces/Customer';
import React, { useEffect, useState } from 'react';
import CustomerDetailView from '@/components/customers/CustomerDetailView';

const CustomerDetailPage: React.FC = () => {
  const { nDni } = useParams<{ nDni: string }>(); // ✅ Tipamos los params

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!nDni) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customers/${nDni}`);
        if (!res.ok) {
          throw new Error(`Error al obtener cliente: ${res.status}`);
        }

        const data: Customer = await res.json();
        setCustomer(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el cliente.');
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [nDni]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando cliente...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  if (!customer) {
    return <div className="container mx-auto px-4 py-8">Cliente no encontrado</div>;
  }

  return <CustomerDetailView customer={customer} />;
};

export default CustomerDetailPage;
