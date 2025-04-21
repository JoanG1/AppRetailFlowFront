import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Checkbox,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getProductos, crearSurtido, getLocales } from "../services/ApiServices";
import { useNavigate } from "react-router-dom";

const CrearSurtido = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const [locales, setLocales] = useState([]);
  const [localSeleccionado, setLocalSeleccionado] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, localesData] = await Promise.all([
          getProductos(),
          getLocales(),
        ]);
        setProductos(productosData);
        setLocales(localesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setMensaje("❌ No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleSeleccionar = (productoId) => {
    setProductosSeleccionados((prev) => {
      const existe = prev.find((p) => p.productoId === productoId);
      if (existe) {
        return prev.filter((p) => p.productoId !== productoId);
      } else {
        return [...prev, { productoId, cantidad: 0 }];
      }
    });
  };

  const handleCantidadChange = (productoId, cantidad) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) =>
        p.productoId === productoId
          ? { ...p, cantidad: parseInt(cantidad, 10) || 0 }
          : p
      )
    );
  };

  const handleFinalizarSurtido = async () => {
    if (!localSeleccionado) {
      setMensaje("❗Por favor, selecciona un local.");
      return;
    }

    const productosFiltrados = productosSeleccionados.filter((p) => p.cantidad > 0);
    if (productosFiltrados.length === 0) {
      setMensaje("❗Debes seleccionar al menos un producto con cantidad mayor a 0.");
      return;
    }

    const surtido = {
      fechaSurtido: new Date().toISOString(),
      productos: productosFiltrados,
    };

    try {
      await crearSurtido(surtido, localSeleccionado);
      setMensaje("✅ Surtido creado exitosamente.");
      setProductosSeleccionados([]);
    } catch (error) {
      console.error("Error al crear surtido:", error);
      setMensaje("❌ No se pudo crear el surtido.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          Crear Surtido
        </Typography>

        {/* Selector de Local */}
        <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
          <InputLabel id="select-local-label">Seleccionar Local</InputLabel>
          <Select
            labelId="select-local-label"
            value={localSeleccionado}
            label="Seleccionar Local"
            onChange={(e) => setLocalSeleccionado(e.target.value)}
          >
            {locales.map((local) => (
              <MenuItem key={local.id} value={local.id}>
                {local.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Seleccionar</strong></TableCell>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Precio</strong></TableCell>
                  <TableCell><strong>Cantidad a Surtir</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => {
                  const seleccionado = productosSeleccionados.find(
                    (p) => p.productoId === producto.id
                  );

                  return (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <Checkbox
                          checked={!!seleccionado}
                          onChange={() => handleSeleccionar(producto.id)}
                        />
                      </TableCell>
                      <TableCell>{producto.id}</TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>{producto.precio}</TableCell>
                      <TableCell>
                        {seleccionado ? (
                          <TextField
                            type="number"
                            value={seleccionado.cantidad}
                            onChange={(e) =>
                              handleCantidadChange(producto.id, e.target.value)
                            }
                            size="small"
                            inputProps={{ min: 0 }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinalizarSurtido}
            disabled={
              productosSeleccionados.length === 0 || !localSeleccionado
            }
          >
            Finalizar Surtido
          </Button>
        </Box>

        {mensaje && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default CrearSurtido;
