import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, // azul estándar
    secondary: { main: '#9c27b0' }, // morado estándar
    error: { main: '#d32f2f' }, // Rojo
    warning: { main: '#ed6c02' }, // Naranja
    info: { main: '#0288d1' }, // Azul
    success: { main: '#2e7d32' }, // Verde
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#4f4f4f' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' }, // azul claro
    secondary: { main: '#ce93d8' }, // morado claro
    error: { main: '#f44336' }, // Rojo
    warning: { main: '#ffa726' }, // Naranja
    info: { main: '#29b6f6' }, // Azul
    success: { main: '#66bb6a' }, // Verde
    background: { default: '#17153B', paper: '#243067' },
    text: { primary: '#ffffff', secondary: '#bdbdbd' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});
