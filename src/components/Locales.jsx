import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    Fade,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { crearLocal, getLocales, editarLocal, deleteLocal } from "../services/ApiServices";

const Locales = () => {
    const [nombreLocal, setNombreLocal] = useState("");
    const [locales, setLocales] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [localAEditar, setLocalAEditar] = useState(null);
    const [nombreEditado, setNombreEditado] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocales = async () => {
            try {
                const data = await getLocales();
                setLocales(data);
            } catch (error) {
                console.error("Error al cargar locales:", error);
                setMensaje("❌ Error al cargar los locales.");
            }
        };

        fetchLocales();
    }, []);

    const agregarLocal = async () => {
        const nombre = nombreLocal.trim();
        if (!nombre) {
            setMensaje("⚠️ El nombre del local no puede estar vacío.");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        try {
            const response = await crearLocal({ nombre });
            setLocales((prev) => [...prev, response]);
            setNombreLocal("");
            setMensaje("✅ ¡Local creado correctamente!");
        } catch (error) {
            console.error("Error al crear local:", error);
            setMensaje("❌ Error al crear el local. Intenta nuevamente.");
        }

        setTimeout(() => setMensaje(""), 3000);
    };

    const eliminarLocal = async (id) => {
        try {
            await deleteLocal(id);
            setLocales((prev) => prev.filter((local) => local.id !== id));
            setMensaje("✅ Local eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar local:", error);
            setMensaje("❌ Error al eliminar el local.");
        }

        setTimeout(() => setMensaje(""), 3000);
    };


    const abrirModalEdicion = (local) => {
        setLocalAEditar(local);
        setNombreEditado(local.nombre);
    };

    const guardarNombreEditado = async () => {
        const nuevoNombre = nombreEditado.trim();
        if (!nuevoNombre) return;

        try {
            const response = await editarLocal(localAEditar.id, { nombre: nuevoNombre });
            setLocales((prev) =>
                prev.map((local) =>
                    local.id === localAEditar.id ? { ...local, nombre: response.nombre } : local
                )
            );
            setMensaje("✅ Nombre del local actualizado.");
            setLocalAEditar(null);
            setNombreEditado("");
        } catch (error) {
            console.error("Error al editar local:", error);
            setMensaje("❌ Error al actualizar el nombre del local.");
        }

        setTimeout(() => setMensaje(""), 3000);
    };

    const irAProductosDelLocal = (local) => {
        navigate("/editarLocales", { state: { local } });
        console.log("Local recibido:", local);
    };

    return (
        <Fade in={true} timeout={500}>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => window.history.back()}
                    >
                        Volver
                    </Button>
                </Box>

                <Typography variant="h4" gutterBottom>
                    Crear Nuevo Local
                </Typography>

                {mensaje && (
                    <Alert
                        severity={mensaje.startsWith("✅") ? "success" : "warning"}
                        sx={{ mb: 2 }}
                    >
                        {mensaje}
                    </Alert>
                )}

                <Paper sx={{ p: 3, mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Nombre del Local"
                        variant="outlined"
                        value={nombreLocal}
                        onChange={(e) => setNombreLocal(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={agregarLocal}
                        disabled={!nombreLocal.trim()}
                    >
                        Agregar Local
                    </Button>
                </Paper>

                <Typography variant="h6" gutterBottom>
                    Locales Creados:
                </Typography>

                <Grid container spacing={2}>
                    {locales.map((local) => (
                        <Grid item xs={12} sm={6} md={4} key={local.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    cursor: "pointer",
                                    position: "relative",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                                onClick={() => irAProductosDelLocal(local)}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    {local.nombre}
                                </Typography>

                                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            abrirModalEdicion(local);
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            eliminarLocal(local.id);
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Dialog
                    open={Boolean(localAEditar)}
                    onClose={() => setLocalAEditar(null)}
                >
                    <DialogTitle>Editar Nombre del Local</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Nuevo Nombre"
                            variant="outlined"
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setLocalAEditar(null)} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            onClick={guardarNombreEditado}
                            variant="contained"
                            color="primary"
                            disabled={!nombreEditado.trim()}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Fade>
    );
};

export default Locales;