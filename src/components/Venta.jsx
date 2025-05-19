import React, { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { getLocales, getProductosConNombrePorLocal } from "../services/ApiServices";

const Venta = () => {
  const [locales, setLocales] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [localId, setLocalId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [cantidadEditada, setCantidadEditada] = useState("");

  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const data = await getLocales();
        setLocales(data);
      } catch (e) {
        setError("Error al obtener locales");
      }
    };
    fetchLocales();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      if (!localId) return;
      try {
        const productos = await getProductosConNombrePorLocal(localId);
        setProductosDisponibles(productos);
      } catch (e) {
        setError("Error al obtener productos del local");
        console.error(e);
      }
    };
    fetchProductos();
  }, [localId]);

  const agregarProducto = () => {
    setError(null);
    const cantidadNum = parseInt(cantidad);
    if (!productoId || !cantidadNum || cantidadNum <= 0) {
      setError("Por favor selecciona un producto y una cantidad válida.");
      return;
    }

    const idNum = parseInt(productoId);
    const productoExistente = productos.find((p) => p.id === idNum);

    if (productoExistente) {
      const nuevosProductos = productos.map((p) =>
        p.id === idNum ? { ...p, cantidad: p.cantidad + cantidadNum } : p
      );
      setProductos(nuevosProductos);
    } else {
      const productoInfo = productosDisponibles.find((p) => p.id === idNum);
      setProductos([
        ...productos,
        { ...productoInfo, cantidad: cantidadNum },
      ]);
    }

    setProductoId("");
    setCantidad("");
  };

  const editarProducto = (id) => {
    const prod = productos.find((p) => p.id === id);
    setEditandoId(id);
    setCantidadEditada(prod.cantidad.toString());
  };

  const guardarEdicion = (id) => {
    const cantidadNum = parseInt(cantidadEditada);
    if (!cantidadNum || cantidadNum <= 0) {
      setError("Cantidad no válida.");
      return;
    }

    const nuevosProductos = productos.map((p) =>
      p.id === id ? { ...p, cantidad: cantidadNum } : p
    );
    setProductos(nuevosProductos);
    setEditandoId(null);
    setCantidadEditada("");
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const registrarVenta = () => {
    setError(null);
    setSuccess(false);

    const userId = localStorage.getItem("userId");

    if (!userId || !localId || productos.length === 0) {
      setError("Completa todos los campos antes de registrar la venta.");
      return;
    }

    const venta = {
      usuarioId: parseInt(userId),
      localId: parseInt(localId),
      productos: productos.map((p) => ({
        productoId: p.id,
        cantidad: p.cantidad,
        precioUnitario: 0, // Puedes actualizar esto cuando tengas el precio real
      })),
    };

    try {
      console.log("Enviando venta al backend:", venta);
      // await crearVenta(venta);
      setSuccess(true);
      setLocalId("");
      setProductos([]);
    } catch (e) {
      setError("Error al registrar la venta");
      console.error(e);
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
          Registrar Venta
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && (
          <Alert severity="success">Venta registrada exitosamente ✅</Alert>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Local</InputLabel>
          <Select
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            required
            label="Local"
          >
            {locales.map((local) => (
              <MenuItem key={local.id} value={local.id}>
                {local.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            marginTop: 2,
            width: "100%",
          }}
        >
          <Autocomplete
            options={productosDisponibles}
            getOptionLabel={(option) => option.nombre}
            value={
              productosDisponibles.find((p) => p.id === parseInt(productoId)) ||
              null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setProductoId(newValue.id.toString());
              } else {
                setProductoId("");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Producto" variant="outlined" />
            )}
            sx={{ flex: 2 }}
          />

          <TextField
            type="number"
            label="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            sx={{ flex: 1 }}
            inputProps={{ min: 1 }}
          />

          <Button variant="contained" onClick={agregarProducto} color="primary">
            Agregar
          </Button>
        </Box>

        {productos.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Productos Agregados
            </Typography>
            <List sx={{ width: "100%" }}>
              {productos.map((p) => (
                <ListItem
                  key={p.id}
                  divider
                  secondaryAction={
                    <>
                      {editandoId === p.id ? (
                        <>
                          <TextField
                            type="number"
                            size="small"
                            value={cantidadEditada}
                            onChange={(e) => setCantidadEditada(e.target.value)}
                            sx={{ width: 80, mr: 1 }}
                          />
                          <IconButton onClick={() => guardarEdicion(p.id)}>
                            <SaveIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={() => editarProducto(p.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => eliminarProducto(p.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </>
                  }
                >
                  <ListItemText
                    primary={p.nombre}
                    secondary={`Cantidad: ${p.cantidad}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Button
          variant="contained"
          color="success"
          onClick={registrarVenta}
          sx={{ mt: 3 }}
        >
          Registrar Venta
        </Button>
      </Box>
    </Container>
  );
};

export default Venta;
