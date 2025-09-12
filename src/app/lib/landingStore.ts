// TEMPORAL: eliminar cuando tengamos la conexión con el back..
export interface LandingPage {
  id: number;
  categoria: string;
  titulo: string;
  fechaCreacion: string;
  fechaExpiracion: string;
  terminos: string;
  imagen: string;
  status: string;
}

let landingPages: LandingPage[] = [];

export const getLandingPages = () => landingPages;

export const addLandingPage = (lp: LandingPage) => {
  landingPages.push(lp);
};
// TEMPORAL: eliminar cuando tengamos la conexión con el back..