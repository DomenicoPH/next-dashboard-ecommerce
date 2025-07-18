import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, // azul estándar
    secondary: { main: '#9c27b0' }, // morado estándar
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
    secondary: { main: '#ce93d8' },
    background: { default: '#17153B', paper: '#2E236C' },
    text: { primary: '#ffffff', secondary: '#bdbdbd' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});
