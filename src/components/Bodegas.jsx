// (...) imports iguales que antes

const Bodegas = () => {
  const [nombreBodega, setNombreBodega] = useState("");
  const [mostrarSecciones, setMostrarSecciones] = useState(false);
  const [seccionesSeleccionadas, setSeccionesSeleccionadas] = useState([]);
  const [nombreNuevaSeccion, setNombreNuevaSeccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // (...) lógica idéntica a antes

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            id="boton-volver"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{ borderRadius: 3 }}
          >
            Volver
          </Button>
          <Button
            id="boton-ir-editar-bodegas"
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
          <Alert
            id="alerta-mensaje-bodega"
            severity="info"
            sx={{ mb: 3, borderRadius: 2 }}
          >
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
            id="input-nombre-bodega"
            fullWidth
            label="Nombre de la Bodega"
            variant="outlined"
            value={nombreBodega}
            onChange={(e) => setNombreBodega(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            id="boton-toggle-secciones"
            variant="contained"
            startIcon={<PlaylistAddCheckIcon />}
            onClick={() => setMostrarSecciones(!mostrarSecciones)}
            sx={{ mb: 3, borderRadius: 3, textTransform: "none" }}
          >
            {mostrarSecciones ? "Ocultar Secciones" : "Agregar Secciones"}
          </Button>

          {mostrarSecciones && (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  id="input-nombre-seccion"
                  fullWidth
                  label="Nombre de la Sección"
                  value={nombreNuevaSeccion}
                  onChange={(e) => setNombreNuevaSeccion(e.target.value)}
                />
                <Button
                  id="boton-agregar-seccion"
                  variant="contained"
                  onClick={agregarSeccion}
                  sx={{ borderRadius: 2 }}
                >
                  Agregar
                </Button>
              </Box>

              <List dense id="lista-secciones">
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
            id="boton-crear-bodega"
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
