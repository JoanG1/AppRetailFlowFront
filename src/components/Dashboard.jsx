import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Slide, Fade } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar con animación de entrada */}
      <Slide in={true} direction="down" timeout={500}>
        <AppBar position="static">
          <Toolbar>
            {/* Icono de Usuario a la Izquierda */}
            <IconButton edge="start" color="inherit" aria-label="user" sx={{ mr: 2 }}>
              <AccountCircleIcon />
            </IconButton>

            {/* Título */}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Panel de Control
            </Typography>

            {/* Opciones del menú alineadas a la derecha */}
            <Button color="inherit" onClick={() => navigate("/inventario")}>
              Inventario
            </Button>
            <Button color="inherit">Facturación</Button>
            <Button color="inherit">Clientes</Button>
            <Button color="inherit" onClick={() => navigate("/local")}>
              Local
            </Button>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* Contenido de la Página con efecto Fade */}
      <Fade in={true} timeout={800}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Bienvenido al Dashboard</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Aquí puedes gestionar tu inventario, facturación, clientes y opciones del local.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard;
