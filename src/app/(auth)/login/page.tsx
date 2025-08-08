"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useThemeContext } from '@/context/ThemeContext';
import CustomAlert from '@/components/ui/CustomAlert';

const LoginForm: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">("info");


  const router = useRouter();
  const login = useUser();
  const { mode } = useThemeContext();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password }),
        }
      );

      if (!res.ok) throw new Error('Credenciales incorrectas');

      const data = await res.json();
      const token = data.token;

      if (!token) throw new Error('Token no recibido');

      // Guarda el token en localStorage
      localStorage.setItem('token', token);
      document.cookie = `token=${token}; path=/; max-age=86400;`;

      setAlertSeverity("success");
      setAlertMessage("¡Login exitoso!");
      setAlertOpen(true);

      setTimeout(() => {
        router.push('/dashboard/general');
      }, 800);

    } catch (err) {

      console.error(err);
      setAlertSeverity("error");
      setAlertMessage("Error al iniciar sesión. Verifica tus credenciales.");
      setAlertOpen(true);

    }
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
        <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>

            {/* Logo */}
            <div className="flex flex-col items-center justify-center py-6">
              <Image
                src={mode === 'light' ? '/logo_light.png' : '/logo_dark.png'}
                alt="Logo"
                width={200}
                height={40}
                priority
                style={{ objectFit: 'contain', height: 'auto', width: '200px' }}
              />
              <p className="opacity-40 font-extralight tracking-[6px] mt-2">
                Administración
              </p>
            </div>

            <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
        </Paper>

        {/* Alertas */}
        <CustomAlert
          open={alertOpen}
          message={alertMessage}
          severity={alertSeverity}
          onClose={() => setAlertOpen(false)}
        />
        
    </Box>
  );
};

export default LoginForm;
