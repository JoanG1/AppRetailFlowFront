import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography, Alert, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../services/ApiServices"; 

const Register = () => {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Estado inicial vacío
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!role) {
      setError("Por favor, selecciona un rol.");
      return;
    }

    try {
      const userData = { username, password, role };
      await register(userData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Error al registrarse");
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
          Registro
        </Typography>

        {error && <Alert severity="error">{"El nombre de usuario ya esta tomado"}</Alert>}
        {success && <Alert severity="success">Registro exitoso. Redirigiendo...</Alert>}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Nombre de usuario"
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          {/* Selector de Rol */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="USER">Usuario</MenuItem>
            </Select>
          </FormControl>

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
            color="success"
            sx={{ mt: 2 }}
          >
            Registrarse
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta?{" "}
          <Button onClick={() => navigate("/login")} sx={{ textTransform: "none" }}>
            Iniciar Sesión
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;

