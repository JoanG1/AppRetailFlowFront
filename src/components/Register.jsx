import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../services/ApiServices";

const Register = () => {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUppercase && hasSpecialChar && hasNumber;
  };

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    /*
    if (!role) {
      setError("Por favor, selecciona un rol.");
      return;
    }
*/
    if (!validatePassword(password)) {
      setError(
        "La contraseña debe contener al menos una mayúscula, un número y un carácter especial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
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

        {error && <Alert severity="error" data-testid="alerta-error" id="alerta-error">{error}</Alert>}
        {success && (
          <Alert severity="success" data-testid="alerta-exito" id="alerta-exito">Registro exitoso. Redirigiendo...</Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Nombre de usuario"
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
            id="input-usuario"
          />
{/*
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
*/}
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="input-clave"
          />

          <TextField
            fullWidth
            label="Confirmar Contraseña"
            type="password"
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={isPasswordMismatch}
            helperText={isPasswordMismatch ? "Las contraseñas no coinciden" : ""}
            id="input-confirmar-clave"
          />

          <Button
            id="boton-registro"
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            disabled={isPasswordMismatch}
          >
            Registrarse
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta?{" "}
          <Button
            id="boton-ir-login"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none" }}
          >
            Iniciar Sesión
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
