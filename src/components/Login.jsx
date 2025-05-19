import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../services/ApiServices"; // Asegúrate de que la ruta es correcta

const Login = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos  

    try {
      const userData = { username, password };
      const response = await login(userData);
      console.log("Autenticación exitosa:", response);
      console.log("Token: ", response.token)
      console.log("userId: ", response.usuarioId)

      // Guarda el token en localStorage
    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.usuarioId);

      // Redirigir al dashboard después de iniciar sesión
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Usuario"
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;

