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

// TEMPORAL: data en memoria hasta conectar al backend
let landingPages: LandingPage[] = [];

// ---------------------------
// Métodos preparados a backend
// ---------------------------

export const getLandingPages = async (): Promise<LandingPage[]> => {
  // Futuro: `return fetch('/api/landing-pages').then(r => r.json())`
  return landingPages;
};

export const addLandingPage = async (lp: LandingPage): Promise<void> => {
  landingPages.push(lp);
  // Futuro: POST -> fetch('/api/landing-pages', { method:'POST', body: JSON.stringify(lp) })
};

export const updateLandingPage = async (lp: LandingPage): Promise<void> => {
  landingPages = landingPages.map(page => page.id === lp.id ? lp : page);
  // Futuro: PUT -> fetch(`/api/landing-pages/${lp.id}`, { method:'PUT', body: JSON.stringify(lp) })
};

export const deleteLandingPages = async (ids: number[]): Promise<void> => {
  landingPages = landingPages.filter(page => !ids.includes(page.id));
  // Futuro: DELETE -> fetch('/api/landing-pages', { method:'DELETE', body: JSON.stringify(ids) })
};
