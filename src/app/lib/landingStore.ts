// landingStore.ts

export interface LandingPage {
  id: number;
  titulo: string;
  expirationDate: string;
  creationDate: string;
  status: "Activo" | "Inactivo";
  imagen: string;
  publish: boolean;
  termsUrl?: string;
  metaTitle: string;
  metaDescription: string;
  allowIndex: boolean;
  contentFields: ContentField[];
  formFields: FormField[];
  formButtonText: string;
  categoriaId: number;
}

export interface ContentField {
  label: string;
  value: string;
  variant: VariantType;
}

export interface FormField {
  label: string;
  type: string;
  required: boolean;
}

type VariantType = "title" | "subtitle" | "highlight";

// ---------------------------
// Helpers localStorage
// ---------------------------
const STORAGE_KEY = "landingPages";

const load = (): LandingPage[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const save = (pages: LandingPage[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  }
};

// ---------------------------
// Métodos preparados a backend
// ---------------------------

export const getLandingPages = async (): Promise<LandingPage[]> => {
  return load();
};

export const addLandingPage = async (lp: LandingPage): Promise<void> => {
  const pages = load();
  pages.push(lp);
  save(pages);
};

export const updateLandingPage = async (lp: LandingPage): Promise<void> => {
  let pages = load();
  pages = pages.map((p) => (p.id === lp.id ? lp : p));
  save(pages);
};

export const deleteLandingPages = async (ids: number[]): Promise<void> => {
  let pages = load();
  pages = pages.filter((p) => !ids.includes(p.id));
  save(pages);
};
