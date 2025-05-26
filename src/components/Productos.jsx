import React, { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { crearProducto, getProductos } from "../services/ApiServices";

const Productos = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await getProductos();
                setProductos(data);
            } catch (err) {
                console.error("Error al obtener productos:", err);
                setError("❌ Error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        if (!nombre.trim() || !precio) {
            setError("⚠️ Todos los campos son obligatorios.");
            return;
        }

        const precioNumero = parseFloat(precio);
        if (isNaN(precioNumero) || precioNumero <= 0) {
            setError("⚠️ El precio debe ser un número válido mayor a 0.");
            return;
        }

        try {
            const nuevoProducto = await crearProducto({ nombre, precio: precioNumero });
            setMensaje("✅ Producto creado exitosamente.");
            setProductos((prev) => [...prev, nuevoProducto]);
            setNombre("");
            setPrecio("");
        } catch (err) {
            console.error("Error al crear producto:", err);
            setError("❌ No se pudo crear el producto.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4 }}>
                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        id="boton-volver"
                    >
                        Volver
                    </Button>
                </Box>

                <Typography variant="h5" gutterBottom>
                    Crear Nuevo Producto
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="input-nombre-producto"
                        fullWidth
                        label="Nombre del producto"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        id="input-precio-producto"
                        fullWidth
                        label="Precio"
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        margin="normal"
                        inputProps={{ step: "0.01", min: "0" }}
                    />

                    {error && (
                        <Alert id="alerta-error-producto" severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {mensaje && (
                        <Alert id="alerta-exito-producto" severity="success" sx={{ mt: 2 }}>
                            {mensaje}
                        </Alert>
                    )}

                    <Button
                        id="boton-crear-producto"
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Crear Producto
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Productos Creados
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : productos.length === 0 ? (
                    <Typography>No hay productos disponibles.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table size="small" id="tabla-productos">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Precio</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map((producto) => (
                                    <TableRow key={producto.id}>
                                        <TableCell>{producto.id}</TableCell>
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell>{producto.precio}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
};

export default Productos;
