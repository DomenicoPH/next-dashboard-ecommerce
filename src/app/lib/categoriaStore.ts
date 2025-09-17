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

export const getCategorias = () => categorias;

export const addCategoria = (c: Categoria) => {
  categorias.push(c);
};

export const updateCategoria = (c: Categoria) => {
  categorias = categorias.map(cat => cat.id === c.id ? c : cat);
};
