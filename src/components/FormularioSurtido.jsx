import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FormularioSurtido = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productosSeleccionados = location.state?.productosSeleccionados || [];

  const [cantidades, setCantidades] = useState({});

  // Manejar el cambio de cantidad
  const handleCantidadChange = (id, cantidad) => {
    setCantidades((prev) => ({ ...prev, [id]: cantidad }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate("/surtido")}
      >
        Volver a Selección
      </Button>

      <Typography variant="h4" gutterBottom>
        Ingresar Cantidad para Surtido
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Stock Disponible</TableCell>
              <TableCell>Cantidad a Retirar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosSeleccionados.map((id) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>Nombre Producto</TableCell> {/* Aquí debes reemplazarlo con el nombre real */}
                <TableCell>Stock Producto</TableCell> {/* Aquí debes reemplazarlo con el stock real */}
                <TableCell>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    value={cantidades[id] || ""}
                    onChange={(e) => handleCantidadChange(id, e.target.value)}
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2 }}
        onClick={() => console.log("Procesar Surtido:", cantidades)}
      >
        Confirmar Surtido
      </Button>
    </Container>
  );
};

export default FormularioSurtido;
