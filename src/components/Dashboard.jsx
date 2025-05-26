import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Slide,
  Fade,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  obtenerTotalBodegas,
  obtenerTotalLocales,
  obtenerTotalProductos,
  obtenerTotalSurtidos,
  obtenerTopProductos,
  obtenerSurtidosConProductos,
} from "../services/ApiServices";

// (...) imports igual que antes

const Dashboard = () => {
  const navigate = useNavigate();
  const [vista, setVista] = useState("dashboard");

  const [resumen, setResumen] = useState({
    bodegas: 0,
    locales: 0,
    productos: 0,
    surtidos: 0,
  });

  const [topProductos, setTopProductos] = useState([]);
  const [surtidosRecientes, setSurtidosRecientes] = useState([]);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  useEffect(() => {
    if (vista !== "dashboard") return;

    const fetchResumen = async () => {
      try {
        const [prod, bod, loc, sur] = await Promise.all([
          obtenerTotalProductos(),
          obtenerTotalBodegas(),
          obtenerTotalLocales(),
          obtenerTotalSurtidos(),
        ]);
        setResumen({
          productos: prod,
          bodegas: bod,
          locales: loc,
          surtidos: sur,
        });
      } catch (error) {
        console.error("Error en resumen:", error);
      }
    };

    const fetchTopProductos = async () => {
      try {
        const data = await obtenerTopProductos();
        setTopProductos(data);
      } catch (error) {
        console.error("Error al obtener productos top:", error);
      }
    };

    const fetchSurtidos = async () => {
      try {
        const surtidos = await obtenerSurtidosConProductos();
        setSurtidosRecientes(surtidos);
      } catch (error) {
        console.error("Error al obtener surtidos recientes:", error);
      }
    };

    fetchResumen();
    fetchTopProductos();
    fetchSurtidos();
  }, [vista]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const precioPromedio =
    topProductos.length > 0
      ? topProductos.reduce((sum, p) => sum + p.precio, 0) / topProductos.length
      : 0;

  const productoMasCaro = topProductos.reduce(
    (max, prod) => (prod.precio > (max?.precio || 0) ? prod : max),
    null
  );

  const productoMasBarato = topProductos.reduce(
    (min, prod) => (prod.precio < (min?.precio ?? Infinity) ? prod : min),
    null
  );

  return (
    <Box sx={{ flexGrow: 1 }} id="dashboard-container">
      <Slide in={true} direction="down" timeout={500}>
        <AppBar position="static">
          <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 1, sm: 0 } }}>
              <IconButton edge="start" color="inherit" aria-label="user" sx={{ mr: 1 }}>
                <AccountCircleIcon />
              </IconButton>
              <Typography variant="h6" id="titulo-panel-control">
                Panel de Control
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
              <Button
                id="nav-inicio"
                color="inherit"
                onClick={() => setVista("dashboard")}
              >
                Inicio
              </Button>
              <Button
                id="nav-bodegas"
                color="inherit"
                onClick={() => navigate("/bodegas")}
              >
                Bodegas
              </Button>
              <Button
                id="nav-locales"
                color="inherit"
                onClick={() => navigate("/locales")}
              >
                Locales
              </Button>
              <Button
                id="nav-productos"
                color="inherit"
                onClick={() => navigate("/productos")}
              >
                Productos
              </Button>
              <Button
                id="nav-surtidos"
                color="inherit"
                onClick={() => navigate("/surtidos")}
              >
                Surtidos
              </Button>
              <Button
                id="nav-venta"
                color="inherit"
                onClick={() => navigate("/venta")}
              >
                Registrar Venta
              </Button>
              <Button
                id="boton-cerrar-sesion"
                color="inherit"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>

      <Fade in={true} timeout={800}>
        <Box sx={{ p: 3 }}>
          {vista === "venta" ? (
            <Venta />
          ) : (
            <>
              <Typography variant="h4" id="bienvenida-dashboard" gutterBottom>
                Bienvenido al Dashboard
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }} id="grid-resumen">
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }} id="card-productos">
                    <Typography variant="h6">Productos</Typography>
                    <Typography variant="h4" color="primary">{resumen.productos}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }} id="card-bodegas">
                    <Typography variant="h6">Bodegas</Typography>
                    <Typography variant="h4" color="primary">{resumen.bodegas}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }} id="card-locales">
                    <Typography variant="h6">Locales</Typography>
                    <Typography variant="h4" color="primary">{resumen.locales}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }} id="card-surtidos">
                    <Typography variant="h6">Surtidos</Typography>
                    <Typography variant="h4" color="primary">{resumen.surtidos}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mt: 1, mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }} id="grafico-barras">
                    <Typography variant="h6" gutterBottom>Precios por Producto (Barras)</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProductos}>
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="precio" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }} id="grafico-pie">
                    <Typography variant="h6" gutterBottom>Proporción de Precios (Pastel)</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={topProductos} dataKey="precio" nameKey="nombre" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                          {topProductos.map((_, index) => (
                            <Cell key={index} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }} id="info-precios">
                <Typography variant="subtitle1">
                  💸 <strong>Precio promedio:</strong> ${precioPromedio.toFixed(2)}
                </Typography>
                {productoMasCaro && (
                  <Typography variant="subtitle1" id="producto-mas-caro">
                    🔺 <strong>Producto más caro:</strong> {productoMasCaro.nombre} (${productoMasCaro.precio.toLocaleString()})
                  </Typography>
                )}
                {productoMasBarato && (
                  <Typography variant="subtitle1" id="producto-mas-barato">
                    🔻 <strong>Producto más barato:</strong> {productoMasBarato.nombre} (${productoMasBarato.precio.toLocaleString()})
                  </Typography>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, overflowX: 'auto' }} id="tabla-productos">
                    <Typography variant="h6" gutterBottom>Últimos Productos Añadidos</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Precio</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topProductos.map((prod) => (
                          <TableRow key={prod.id}>
                            <TableCell>{prod.id}</TableCell>
                            <TableCell>{prod.nombre}</TableCell>
                            <TableCell>${prod.precio.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, overflowX: 'auto' }} id="tabla-surtidos">
                    <Typography variant="h6" gutterBottom>Últimos Surtidos</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID Surtido</TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell>Cantidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {surtidosRecientes.map((s, index) => (
                          <TableRow key={index}>
                            <TableCell>{s.id}</TableCell>
                            <TableCell>{s.producto}</TableCell>
                            <TableCell>{s.cantidad}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard;
