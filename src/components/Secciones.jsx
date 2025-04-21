import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProductosConNombrePorSeccion,
  eliminarProductoBodega,
  getProductosDisponibles,
  agregarProductoABodega,
} from "../services/ApiServices";

const Secciones = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const seccion = location.state?.seccion;

  const [productos, setProductos] = useState([]);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [precioEditado, setPrecioEditado] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [errorCarga, setErrorCarga] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [dialogAgregarOpen, setDialogAgregarOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [stockProductoAgregar, setStockProductoAgregar] = useState("");
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosApi = await getProductosConNombrePorSeccion(seccion.id);
        setProductos(productosApi);
      } catch (error) {
        setErrorCarga("❌ Error al cargar productos de la sección.");
        console.error(error);
      }
    };

    if (seccion?.id) {
      cargarProductos();
    }
  }, [seccion]);

  const cargarProductosDisponibles = async () => {
    try {
      const data = await getProductosDisponibles();
      const productosTransformados = data.map(p => ({
        ...p,
        stock: p.surtidos.reduce((acc, s) => acc + s.cantidad, 0),
      }));
      setProductosDisponibles(productosTransformados);
    } catch (error) {
      console.error("❌ Error al cargar productos disponibles:", error);
    }
  };

  useEffect(() => {
    cargarProductosDisponibles();
  }, []);

  if (!seccion) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          No se ha recibido la información de la sección.
        </Alert>
      </Container>
    );
  }

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialogEditar = (producto) => {
    setProductoAEditar(producto);
    setPrecioEditado(producto.stock.toString());
  };

  const guardarPrecioEditado = () => {
    const nuevoStock = parseInt(precioEditado, 10);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
      alert("⚠️ Ingresa un valor válido para el stock.");
      return;
    }

    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoAEditar.id ? { ...p, stock: nuevoStock } : p
      )
    );
    setProductoAEditar(null);
    setPrecioEditado("");
  };

  const handleEliminarProducto = (productoId) => {
    setProductoAEliminar(productoId);
    setConfirmDialogOpen(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarProductoBodega(productoAEliminar);
      setProductos((prev) =>
        prev.filter((p) => p.id !== productoAEliminar)
      );
      mostrarSnackbar("✅ Producto eliminado exitosamente.");
    } catch (error) {
      console.error(error);
      mostrarSnackbar("❌ Error al eliminar el producto.", "error");
    } finally {
      setProductoAEliminar(null);
      setConfirmDialogOpen(false);
    }
  };

  const agregarProducto = async () => {
    if (!productoSeleccionado || stockProductoAgregar.trim() === "") return;

    const stockNumerico = parseInt(stockProductoAgregar, 10);
    if (isNaN(stockNumerico) || stockNumerico < 0) {
      mostrarSnackbar("⚠️ Ingresa un stock válido.", "warning");
      return;
    }

    const yaExiste = productos.some((p) => p.nombre === productoSeleccionado.nombre);
    if (yaExiste) {
      mostrarSnackbar("⚠️ El producto ya está agregado.", "warning");
      return;
    }

    try {
      const nuevoProducto = await agregarProductoABodega({
        productoId: productoSeleccionado.id,
        seccionId: seccion.id,
        stock: stockNumerico,
      });

      const productoFinal = {
        id: nuevoProducto.id,
        nombre: productoSeleccionado.nombre,
        stock: nuevoProducto.stock,
      };

      setProductos((prev) => [...prev, productoFinal]);
      mostrarSnackbar("✅ Producto agregado correctamente.");
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      mostrarSnackbar("❌ Error al agregar el producto.", "error");
    } finally {
      setDialogAgregarOpen(false);
      setProductoSeleccionado(null);
      setBusqueda("");
      setStockProductoAgregar("");
      await cargarProductosDisponibles(); // 🔁 ACTUALIZA lista disponibles
    }
  };

  const productosFiltrados = productosDisponibles.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Productos de la Sección: {seccion.nombre}
      </Typography>

      {errorCarga && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorCarga}
        </Alert>
      )}

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => setDialogAgregarOpen(true)}
      >
        Agregar producto
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => abrirDialogEditar(producto)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminarProducto(producto.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay productos en esta sección.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de edición */}
      <Dialog open={Boolean(productoAEditar)} onClose={() => setProductoAEditar(null)}>
        <DialogTitle>Editar Stock</DialogTitle>
        <DialogContent>
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={precioEditado}
            onChange={(e) => setPrecioEditado(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductoAEditar(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={guardarPrecioEditado}
            color="primary"
            variant="contained"
            disabled={precioEditado.trim() === ""}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este producto de la sección?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={confirmarEliminacion}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de agregar producto */}
      <Dialog open={dialogAgregarOpen} onClose={() => setDialogAgregarOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent>
          <TextField
            label="Buscar producto"
            fullWidth
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {productosFiltrados.map((producto) => (
            <Box
              key={producto.id}
              sx={{
                p: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
                mb: 1,
                backgroundColor: productoSeleccionado?.id === producto.id ? "#e3f2fd" : "#fff",
                cursor: "pointer",
              }}
              onClick={() => {
                setProductoSeleccionado(producto);
                setStockProductoAgregar(producto.stock.toString());
              }}
            >
              <Typography variant="body1">
                <strong>{producto.nombre}</strong>
              </Typography>
            </Box>
          ))}
          {productoSeleccionado && (
            <TextField
              label="Stock del producto"
              type="number"
              fullWidth
              value={stockProductoAgregar}
              onChange={(e) => setStockProductoAgregar(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAgregarOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={agregarProducto}
            variant="contained"
            disabled={!productoSeleccionado || stockProductoAgregar.trim() === ""}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Secciones;
