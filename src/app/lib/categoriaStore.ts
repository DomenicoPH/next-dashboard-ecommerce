export interface Categoria {
  id: number;
  titulo: string;
  fecha: string;
  status: "Activo" | "Inactivo";
}

let categorias: Categoria[] = [
  { id: 1, titulo: "Promociones", fecha: "2025-09-01", status: "Activo" },
  { id: 2, titulo: "Nuevos productos", fecha: "2025-09-05", status: "Activo" },
];

export const getCategorias = async (): Promise<Categoria[]> => {
  return categorias;
};

export const addCategoria = async (c: Categoria): Promise<void> => {
  categorias.push(c);
};

export const updateCategoria = async (c: Categoria): Promise<void> => {
  categorias = categorias.map(cat => cat.id === c.id ? c : cat);
};

export const deleteCategorias = async (ids: number[]): Promise<void> => {
  categorias = categorias.filter(cat => !ids.includes(cat.id));
};