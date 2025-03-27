import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  TextField,
  Alert,
  AlertTitle,
  Box,
  Fade,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AgregarProducto from "./Agregarproducto";
import EditarProducto from "./Editarproducto";
import EliminarProducto from "./Eliminarproducto";

// Importamos los servicios de la API
import { getProductos, addProducto, updateProducto, deleteProducto } from "../services/ApiServices";

const Inventario = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" }); // Nuevo estado para mensajes

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.id.toString().includes(filtro) ||
      producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const productosBajoStock = productos.filter((producto) => producto.cantidad < 5);
  const productosMostrar = productosBajoStock.slice(0, 3);
  const restantes = productosBajoStock.length - 3;

  // Agregar producto en la API
  const handleAgregarProducto = async (nuevoProducto) => {
    try {
      const productoGuardado = await addProducto(nuevoProducto);
      setProductos([...productos, productoGuardado]);
      setOpenAgregar(false);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Editar producto en la API
  const handleEditarProducto = async (productoEditado) => {
    try {
      await updateProducto(productoEditado.id, productoEditado);
      setProductos(
        productos.map((p) =>
          p.id === productoEditado.id ? productoEditado : p
        )
      );
      setOpenEditar(false);
      setMensaje({ tipo: "success", texto: "Producto editado correctamente." });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setMensaje({ tipo: "error", texto: "Error al editar el producto." });
    }
  };

  // Eliminar producto en la API
  const handleEliminarProducto = async (id) => {
    try {
      await deleteProducto(id);
      setProductos((prevProductos) => prevProductos.filter((p) => p.id !== id));
      setOpenEliminar(false);
      setProductoSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMensaje({ tipo: "error", texto: "El producto tiene referencias en la tabla Surtido_producto" });
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
    <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
    >
    Volver al Panel Principal
    </Button>

    <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/surtido")}
    >
        Ir a Surtido
        </Button>
    </Box>

        <Typography variant="h4" gutterBottom>
          Inventario
        </Typography>

        {/* Mostrar mensaje después de editar */}
        {mensaje.texto && (
          <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
            {mensaje.texto}
          </Alert>
        )}

        {productosBajoStock.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="warning">
              <AlertTitle>¡Atención! Stock Bajo</AlertTitle>
              {productosMostrar.map((producto) => (
                <div key={producto.id}>
                  <strong>{producto.nombre}</strong> tiene solo {producto.stock} unidades disponibles.
                </div>
              ))}
              {restantes > 0 && <div><strong>+{restantes} más...</strong></div>}
            </Alert>
          </Box>
        )}

        <TextField
          label="Buscar por ID o Nombre"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ mb: 2 }}
          onClick={() => setOpenAgregar(true)}
        >
          Agregar Producto
        </Button>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio ($)</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.id}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>{producto.precio}</TableCell>
                    <TableCell>
                      <IconButton
                        color="warning"
                        onClick={() => {
                          setProductoSeleccionado(producto);
                          setOpenEditar(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setProductoSeleccionado(producto);
                          setOpenEliminar(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Modales para agregar, editar y eliminar */}
        <AgregarProducto
          open={openAgregar}
          handleClose={() => setOpenAgregar(false)}
          handleGuardar={handleAgregarProducto}
        />
        {productoSeleccionado && (
          <EditarProducto
            open={openEditar}
            handleClose={() => setOpenEditar(false)}
            producto={productoSeleccionado}
            handleActualizar={handleEditarProducto}
          />
        )}
        {productoSeleccionado && (
          <EliminarProducto
            open={openEliminar}
            handleClose={() => {
              setOpenEliminar(false);
              setProductoSeleccionado(null);
            }}
            handleEliminar={handleEliminarProducto}
            producto={productoSeleccionado}
          />
        )}
      </Container>
    </Fade>
  );
};

export default Inventario;
