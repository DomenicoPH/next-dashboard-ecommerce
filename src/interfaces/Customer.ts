export interface Customer {
    id: string;
    name: string | null;
    nDni: string;
    lastName: string | null;
    email: string | null;
    phone: string;
    address: string | null;
    status: 'Frecuente' | 'Nuevo' | 'Inactivo';
}