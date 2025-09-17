// TEMPORAL: eliminar cuando tengamos la conexión con el back..

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

let landingPages: LandingPage[] = [];

export const getLandingPages = () => landingPages;

export const addLandingPage = (lp: LandingPage) => {
  landingPages.push(lp);
};

// TEMPORAL: eliminar cuando tengamos la conexión con el back..