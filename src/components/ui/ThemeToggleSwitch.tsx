'use client';
import { Stack, Switch, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '@/context/ThemeContext';

export default function ThemeToggleSwitch() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        justifyContent: 'center',
        bgcolor: 'transparent',
        p: 1,
        borderRadius: 0,
      }}
    >
      <Brightness7 color={mode === 'light' ? 'primary' : 'disabled'} />
      <Switch
        checked={mode === 'dark'}
        onChange={toggleTheme}
        color="default"
        inputProps={{ 'aria-label': 'toggle theme' }}
      />
      <Brightness4 color={mode === 'dark' ? 'primary' : 'disabled'} />
    </Stack>
  );
}
