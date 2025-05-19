import React, { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getHistorialVentas } from "../services/ApiServices";

const HistorialVentas = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorialVentas();
        setVentas(data);
      } catch (e) {
        console.error(e);
        setError("Error al cargar el historial de ventas");
      }
    };

    fetchHistorial();
  }, []);

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = filtro.toLowerCase();
    return (
      venta.nombreUsuario.toLowerCase().includes(texto) ||
      venta.productos.some((p) =>
        p.nombreProducto.toLowerCase().includes(texto)
      )
    );
  });

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Historial de Ventas
      </Typography>

      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate("/venta")}>
        Volver a Registrar Venta
      </Button>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Buscar por usuario o producto"
          variant="outlined"
          fullWidth
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </Box>

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Productos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventasFiltradas.map((venta, index) => (
              <TableRow key={index}>
                <TableCell>{venta.nombreUsuario}</TableCell>
                <TableCell>{new Date(venta.fecha).toLocaleString()}</TableCell>
                <TableCell>${venta.total.toFixed(2)}</TableCell>
                <TableCell>
                  <List dense>
                    {venta.productos.map((p, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={p.nombreProducto}
                          secondary={`Cantidad: ${p.cantidad}, Precio: $${p.precioUnitario}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HistorialVentas;
