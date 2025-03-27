import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  AlertTitle,
  Box,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Local = () => {
  const navigate = useNavigate();

  // Lista de productos agotados (simulada)
  const [productosAgotados] = useState([
    { id: 1, nombre: "Laptop", cantidad: 0 },
    { id: 2, nombre: "Teclado", cantidad: 0 },
    { id: 3, nombre: "Mouse", cantidad: 0 },
    { id: 4, nombre: "Monitor", cantidad: 0 },
    { id: 5, nombre: "Impresora", cantidad: 0 },
    { id: 6, nombre: "Cámara", cantidad: 0 },
    { id: 7, nombre: "Tablet", cantidad: 0 },
    { id: 8, nombre: "Auriculares", cantidad: 0 },
    { id: 9, nombre: "Parlante", cantidad: 0 },
    { id: 10, nombre: "Cargador", cantidad: 0 },
  ]);

  // Filtrar y limitar los productos a mostrar en la alerta
  const productosMostrar = productosAgotados.slice(0, 3);
  const restantes = productosAgotados.length - 3;

  // Función para "enviar" la petición de abastecimiento
  const handleEnviarPeticion = () => {
    console.log("Petición de abastecimiento enviada:", productosAgotados);
    alert("Petición de abastecimiento enviada. Revisa la consola.");
  };

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Botón para volver al Dashboard */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
          onClick={() => navigate("/dashboard")}
        >
          Volver al Panel Principal
        </Button>

        <Typography variant="h4" gutterBottom>
          Local - Petición de Abastecimiento
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Aquí se listan los productos que están agotados. Puedes enviar una petición de reabastecimiento.
        </Typography>


        {/* Tabla con scroll */}
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosAgotados.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Botón para enviar la petición */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, mr: 2 }}
          onClick={handleEnviarPeticion}
        >
          Enviar Petición de Abastecimiento
        </Button>
      </Container>
    </Fade>
  );
};

export default Local;
