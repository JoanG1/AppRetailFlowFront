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
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getProductos, surtirProductos } from "../services/ApiServices"; // 🔹 Importamos el servicio real

const Surtido = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]); // Estado para los productos reales
  const [loading, setLoading] = useState(true); // Estado de carga
  const [filtro, setFiltro] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cantidades, setCantidades] = useState({});

  // 🔹 Obtener productos reales al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data); // Guardamos los productos obtenidos
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false); // Desactivamos la carga
      }
    };
    fetchProductos();
  }, []);

  // 🔹 Filtrar productos según el texto ingresado
  const productosFiltrados = productos.filter(
    (p) =>
      p.id.toString().includes(filtro) ||
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // 🔹 Manejar la selección de productos
  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 🔹 Manejar el cambio de cantidad
  const handleCantidadChange = (id, cantidad) => {
    setCantidades((prev) => ({ ...prev, [id]: cantidad }));
  };

  // 🔹 Confirmar Surtido (llamada a API)
  const confirmarSurtido = async () => {
    const productosSurtidos = seleccionados.map((id) => ({
      id: id,
      cantidad: cantidades[id] ? parseInt(cantidades[id], 10) : 0, // Convertir a número
    }));

    try {
        
        console.log(productosSurtidos)
        
      await surtirProductos( productosSurtidos );
      alert("Surtido realizado con éxito");
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al surtir productos:", error);
      alert("Error al realizar el surtido");
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
          onClick={() => navigate("/inventario")}
        >
          Volver al Inventario
        </Button>

        <Typography variant="h4" gutterBottom>
          Surtido de Productos
        </Typography>

        <TextField
          label="Buscar por ID o Nombre"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seleccionar</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Precio ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <Checkbox
                        checked={seleccionados.includes(producto.id)}
                        onChange={() => toggleSeleccion(producto.id)}
                      />
                    </TableCell>
                    <TableCell>{producto.id}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>{producto.precio}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setModalAbierto(true)}
          disabled={seleccionados.length === 0}
        >
          Continuar
        </Button>

        {/* MODAL para ingresar las cantidades */}
        <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth maxWidth="sm">
          <DialogTitle>Ingresar Cantidad para Surtido</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Stock Disponible</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seleccionados.map((id) => {
                    const producto = productos.find((p) => p.id === id);
                    return (
                      <TableRow key={id}>
                        <TableCell>{producto.id}</TableCell>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.stock}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            value={cantidades[id] || ""}
                            onChange={(e) => handleCantidadChange(id, e.target.value)}
                            inputProps={{ min: 1, max: producto.stock }}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalAbierto(false)} color="error">
              Cancelar
            </Button>
            <Button onClick={confirmarSurtido} color="primary" variant="contained">
              Confirmar Surtido
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
};

export default Surtido;
