export interface Categoria {
  id: number;
  titulo: string;
  fecha: string;
  status: "Activo" | "Inactivo";
}

const STORAGE_KEY = "categorias";

// Helpers localStorage
const load = (): Categoria[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved
    ? JSON.parse(saved)
    : [
        { id: 1, titulo: "Promociones", fecha: "2025-09-01", status: "Activo" },
        { id: 2, titulo: "Nuevos productos", fecha: "2025-09-05", status: "Activo" },
      ];
};

const save = (cats: Categoria[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  }
};

// Métodos preparados a backend
export const getCategorias = async (): Promise<Categoria[]> => {
  return load();
};

export const addCategoria = async (c: Categoria): Promise<void> => {
  const cats = load();
  cats.push(c);
  save(cats);
};

export const updateCategoria = async (c: Categoria): Promise<void> => {
  let cats = load();
  cats = cats.map((cat) => (cat.id === c.id ? c : cat));
  save(cats);
};

export const deleteCategorias = async (ids: number[]): Promise<void> => {
  let cats = load();
  cats = cats.filter((cat) => !ids.includes(cat.id));
  save(cats);
};
