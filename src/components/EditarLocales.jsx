import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getProductosConNombrePorLocal,
    eliminarProductoLocal,
    editarStockProductoLocal,
} from "../services/ApiServices";

const EditarLocales = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const local = state?.local;

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [productoAEditar, setProductoAEditar] = useState(null);
    const [stockEditado, setStockEditado] = useState("");

    useEffect(() => {
        const cargarProductos = async () => {
            if (!local?.id) {
                console.error("No se recibió ID del local en EditarLocales.");
                return;
            }

            try {
                const data = await getProductosConNombrePorLocal(local.id);
                setProductos(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [local]);

    const abrirDialogEditar = (producto) => {
        setProductoAEditar(producto);
        setStockEditado(producto.stock.toString());
    };

    const guardarStockEditado = async () => {
        const nuevoStock = parseInt(stockEditado, 10);
        if (isNaN(nuevoStock) || nuevoStock < 0) {
            alert("⚠️ Ingresa un valor numérico válido para el stock.");
            return;
        }

        try {
            await editarStockProductoLocal(productoAEditar.id, nuevoStock);
            setProductos((prev) =>
                prev.map((p) =>
                    p.id === productoAEditar.id ? { ...p, stock: nuevoStock } : p
                )
            );
            setProductoAEditar(null);
            setStockEditado("");
        } catch (error) {
            console.error("❌ Error al actualizar stock:", error);
            alert("❌ No se pudo actualizar el stock.");
        }
    };

    const handleEliminarProducto = (productoId) => {
        setProductoAEliminar(productoId);
        setConfirmDialogOpen(true);
    };

    const confirmarEliminacion = async () => {
        try {
            await eliminarProductoLocal(productoAEliminar);
            setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar));
            console.log("✅ Producto eliminado correctamente.");
        } catch (error) {
            console.error("❌ Error al eliminar producto del local:", error);
            alert("❌ No se pudo eliminar el producto del local.");
        } finally {
            setConfirmDialogOpen(false);
            setProductoAEliminar(null);
        }
    };

    if (!local) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">
                    ❌ No se recibió información del local.
                </Typography>
                <Button variant="outlined" onClick={() => navigate("/locales")} sx={{ mt: 2 }}>
                    Volver a Locales
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/locales")}
                >
                    Volver
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Editar Local
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Nombre del Local:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {local.nombre}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Productos Asociados:
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : productos.length === 0 ? (
                    <Typography variant="body2">Este local no tiene productos asignados.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Stock</strong></TableCell>
                                    <TableCell align="right"><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map((producto) => (
                                    <TableRow key={producto.id}>
                                        <TableCell>{producto.id}</TableCell>
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell>{producto.stock}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => abrirDialogEditar(producto)}>
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Modal de edición de stock */}
            <Dialog
                open={Boolean(productoAEditar)}
                onClose={() => setProductoAEditar(null)}
            >
                <DialogTitle>Editar Stock</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Stock"
                        type="number"
                        fullWidth
                        value={stockEditado}
                        onChange={(e) => setStockEditado(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProductoAEditar(null)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={guardarStockEditado}
                        color="primary"
                        variant="contained"
                        disabled={stockEditado.trim() === ""}
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
                        ¿Estás seguro de que deseas eliminar este producto del local?
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
        </Container>
    );
};

export default EditarLocales;