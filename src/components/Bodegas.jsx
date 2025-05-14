import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    Fade,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { crearBodega, crearBodegaConSecciones } from "../services/ApiServices";

const Bodegas = () => {
    const [nombreBodega, setNombreBodega] = useState("");
    const [mostrarSecciones, setMostrarSecciones] = useState(false);
    const [seccionesSeleccionadas, setSeccionesSeleccionadas] = useState([]);
    const [nombreNuevaSeccion, setNombreNuevaSeccion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const agregarSeccion = () => {
        const nombre = nombreNuevaSeccion.trim();
        if (!nombre) return;
        if (seccionesSeleccionadas.includes(nombre)) return;

        setSeccionesSeleccionadas((prev) => [...prev, nombre]);
        setNombreNuevaSeccion("");
    };

    const eliminarSeccion = (nombre) => {
        setSeccionesSeleccionadas((prev) => prev.filter((s) => s !== nombre));
    };

    const handleCrearBodega = async () => {
        const nuevaBodega = { nombre: nombreBodega };
        try {
            const response = await crearBodega(nuevaBodega);
            console.log("Bodega creada:", response);
            setMensaje("✅ ¡Bodega creada exitosamente sin secciones!");
            resetFormulario();
        } catch (error) {
            setMensaje(`❌ Error: ${error}`);
        }
    };

    const handleCrearBodegaSecciones = async () => {
        const nuevaBodega = {
            nombre: nombreBodega,
            secciones: seccionesSeleccionadas,
        };
        try {
            const response = await crearBodegaConSecciones(nuevaBodega);
            console.log("Bodega con secciones creada:", response);
            setMensaje("✅ ¡Bodega creada exitosamente con secciones asignadas!");
            resetFormulario();
        } catch (error) {
            setMensaje(`❌ Error: ${error}`);
        }
    };

    const handleSubmit = () => {
        if (mostrarSecciones) {
            if (seccionesSeleccionadas.length === 0) {
                setMensaje("⚠️ Debes agregar al menos una sección.");
                return;
            }
            handleCrearBodegaSecciones();
        } else {
            handleCrearBodega();
        }
    };

    const resetFormulario = () => {
        setNombreBodega("");
        setSeccionesSeleccionadas([]);
        setNombreNuevaSeccion("");
        setMostrarSecciones(false);
    };

    return (
        <Fade in={true} timeout={500}>
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => window.history.back()}
                        sx={{ borderRadius: 3 }}
                    >
                        Volver
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/editarBodegas")}
                        sx={{ borderRadius: 3 }}
                    >
                        Ir a Editar Bodegas
                    </Button>
                </Box>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "primary.main", textAlign: "center" }}
                >
                    Crear Nueva Bodega
                </Typography>

                {mensaje && (
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                        {mensaje}
                    </Alert>
                )}

                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        backgroundColor: "#fdfdfd",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Nombre de la Bodega"
                        variant="outlined"
                        value={nombreBodega}
                        onChange={(e) => setNombreBodega(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<PlaylistAddCheckIcon />}
                        onClick={() => setMostrarSecciones(!mostrarSecciones)}
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            textTransform: "none",
                        }}
                    >
                        {mostrarSecciones ? "Ocultar Secciones" : "Agregar Secciones"}
                    </Button>

                    {mostrarSecciones && (
                        <>
                            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre de la Sección"
                                    value={nombreNuevaSeccion}
                                    onChange={(e) => setNombreNuevaSeccion(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={agregarSeccion}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Agregar
                                </Button>
                            </Box>

                            <List dense>
                                {seccionesSeleccionadas.map((seccion) => (
                                    <ListItem
                                        key={seccion}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor: "#f1f1f1",
                                            px: 2,
                                        }}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => eliminarSeccion(seccion)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={seccion} />
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 2 }} />
                        </>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!nombreBodega}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            fontWeight: "bold",
                            borderRadius: 3,
                            textTransform: "none",
                        }}
                    >
                        Crear Bodega
                    </Button>
                </Paper>
            </Container>
        </Fade>
    );
};

export default Bodegas;