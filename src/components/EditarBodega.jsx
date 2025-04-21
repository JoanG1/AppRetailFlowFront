import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    TextField,
    Fade,
    Grid,
    Divider,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import {
    getBodegas,
    eliminarBodega,
    getSeccionesPorBodega,
    crearSeccion,
} from "../services/ApiServices";

const EditarBodega = () => {
    const [bodegas, setBodegas] = useState([]);
    const [bodegaSeleccionada, setBodegaSeleccionada] = useState(null);
    const [nombreEditado, setNombreEditado] = useState("");
    const [bodegaAEliminar, setBodegaAEliminar] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [seccionesBodega, setSeccionesBodega] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBodegas = async () => {
            try {
                const data = await getBodegas();
                setBodegas(data);
            } catch (error) {
                console.error("Error al cargar las bodegas:", error);
            }
        };
        fetchBodegas();
    }, []);

    const seleccionarBodega = async (bodega) => {
        setBodegaSeleccionada(bodega);
        setNombreEditado(bodega.nombre);

        try {
            const secciones = await getSeccionesPorBodega(bodega.id);
            setSeccionesBodega(secciones);
        } catch (error) {
            console.error("Error al cargar secciones de la bodega:", error);
            setSeccionesBodega([]);
        }
    };

    const confirmarEliminarBodega = async () => {
        if (!bodegaAEliminar) return;

        try {
            const secciones = await getSeccionesPorBodega(bodegaAEliminar.id);

            if (secciones.length > 0) {
                setMensaje("❌ No se puede eliminar la bodega porque tiene secciones asociadas.");
                return;
            }

            await eliminarBodega(bodegaAEliminar.id);
            setBodegas((prev) => prev.filter((b) => b.id !== bodegaAEliminar.id));

            if (bodegaSeleccionada?.id === bodegaAEliminar.id) {
                setBodegaSeleccionada(null);
                setNombreEditado("");
                setSeccionesBodega([]);
            }

            setMensaje("✅ Bodega eliminada correctamente.");
        } catch (error) {
            console.error("Error al eliminar la bodega:", error);
            setMensaje("❌ No se pudo eliminar la bodega. Verifica si tiene productos asignados.");
        }

        setBodegaAEliminar(null);
        setTimeout(() => setMensaje(""), 5000);
    };

    const handleGuardarCambios = () => {
        console.log("Guardar cambios para:", {
            ...bodegaSeleccionada,
            nombre: nombreEditado,
        });
        // Aquí puedes hacer un PUT a la API si lo deseas
    };

    const bodegasFiltradas = bodegas.filter((b) =>
        b.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Fade in={true} timeout={500}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => window.history.back()}
                    sx={{ mb: 2 }}
                >
                    Volver
                </Button>

                <Typography variant="h4" gutterBottom>
                    Editar Bodega
                </Typography>

                {mensaje && (
                    <Box sx={{ mb: 2 }}>
                        <Alert severity={mensaje.startsWith("✅") ? "success" : "error"}>
                            {mensaje}
                        </Alert>
                    </Box>
                )}

                {!bodegaSeleccionada && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Selecciona una bodega para editar:
                        </Typography>

                        <TextField
                            label="Buscar bodega"
                            variant="outlined"
                            fullWidth
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Grid container spacing={2}>
                            {bodegasFiltradas.map((bodega) => (
                                <Grid item xs={12} sm={6} md={4} key={bodega.id}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            position: "relative",
                                            cursor: "pointer",
                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                        }}
                                        onClick={() => seleccionarBodega(bodega)}
                                    >
                                        <IconButton
                                            size="small"
                                            color="error"
                                            sx={{ position: "absolute", top: 4, right: 4 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBodegaAEliminar(bodega);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="subtitle1">{bodega.nombre}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                            {bodegasFiltradas.length === 0 && (
                                <Typography variant="body1" sx={{ pl: 2 }}>
                                    No se encontraron bodegas con ese nombre.
                                </Typography>
                            )}
                        </Grid>
                    </Box>
                )}

                {bodegaSeleccionada && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                            Editando: {bodegaSeleccionada.nombre}
                        </Typography>

                        <Paper sx={{ p: 3, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Nombre de la Bodega"
                                variant="outlined"
                                value={nombreEditado}
                                onChange={(e) => setNombreEditado(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Secciones Asignadas:
                            </Typography>

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                                {seccionesBodega.length > 0 ? (
                                    seccionesBodega.map((seccion) => (
                                        <Paper
                                            key={seccion.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                p: 1,
                                                pl: 2,
                                                pr: 1,
                                                gap: 1,
                                                backgroundColor: "#e3f2fd",
                                                cursor: "pointer",
                                                "&:hover": { backgroundColor: "#bbdefb" },
                                            }}
                                            onClick={() =>
                                                navigate(/secciones/${seccion.id}, {
                                                state: { seccion },
                                            })
                                            }
                                        >
                                            <Typography className="nombre-seccion">
                                                {seccion.nombre}
                                            </Typography>
                                            <IconButton size="small" color="primary" disabled>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" disabled>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Esta bodega no tiene secciones asignadas.
                                    </Typography>
                                )}
                            </Box>

                            <CrearSeccionForm
                                bodegaId={bodegaSeleccionada.id}
                                onCrear={(nueva) =>
                                    setSeccionesBodega((prev) => [...prev, nueva])
                                }
                                setMensaje={setMensaje}
                            />

                            <Box mt={3}>
                                <Button variant="contained" color="primary" onClick={handleGuardarCambios}>
                                    Guardar Cambios
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                )}

                <Dialog
                    open={Boolean(bodegaAEliminar)}
                    onClose={() => setBodegaAEliminar(null)}
                >
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Estás seguro de que quieres eliminar la bodega{" "}
                            <strong>{bodegaAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setBodegaAEliminar(null)} color="inherit">
                            Cancelar
                        </Button>
                        <Button onClick={confirmarEliminarBodega} color="error">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Fade>
    );
};

const CrearSeccionForm = ({ bodegaId, onCrear, setMensaje }) => {
    const [nuevaSeccion, setNuevaSeccion] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const crearSeccionHandler = async () => {
        const nombre = nuevaSeccion.trim();

        if (!nombre) {
            setError("El nombre no puede estar vacío.");
            return;
        }

        const existe = document.querySelectorAll(".nombre-seccion");
        const existeYa = Array.from(existe).some(
            (el) => el.textContent.toLowerCase() === nombre.toLowerCase()
        );

        if (existeYa) {
            setError("Ya existe una sección con ese nombre.");
            return;
        }

        try {
            setCargando(true);
            const nueva = await crearSeccion({ nombre, bodegaId });
            setNuevaSeccion("");
            setError("");
            onCrear(nueva);
            setMensaje("✅ Sección creada correctamente.");
            setTimeout(() => setMensaje(""), 5000);
        } catch (error) {
            console.error("Error al crear la sección:", error);
            setError(
                typeof error === "string" ? error : "❌ No se pudo crear la sección."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                Añadir nueva sección
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        label="Nombre de la nueva sección"
                        variant="outlined"
                        value={nuevaSeccion}
                        onChange={(e) => {
                            setNuevaSeccion(e.target.value);
                            setError("");
                        }}
                        error={!!error}
                        helperText={error}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={crearSeccionHandler}
                        disabled={cargando}
                    >
                        {cargando ? "Creando..." : "Crear Sección"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditarBodega;