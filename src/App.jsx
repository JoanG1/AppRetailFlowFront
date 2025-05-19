import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/Inventario";
import Local from "./components/Local";
import Surtido from "./components/Surtido";
import Bodegas from "./components/Bodegas";
import EditarBodegas from "./components/EditarBodega";
import Locales from "./components/Locales";
import EditarLocales from "./components/EditarLocales";
import Productos from "./components/Productos";
import Surtidos from "./components/Surtidos";
import Secciones from "./components/Secciones";
import ProtectedRoute from "./components/ProtectedRoute";
import Venta from "./components/Venta";
import HistorialVentas from "./components/HistorialVenta";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
      <Route path="/surtido" element={<ProtectedRoute><Surtido /></ProtectedRoute>} />
      <Route path="/local" element={<ProtectedRoute><Local /></ProtectedRoute>} />
      <Route path="/bodegas" element={<ProtectedRoute><Bodegas /></ProtectedRoute>} />
      <Route path="/editarBodegas" element={<ProtectedRoute><EditarBodegas /></ProtectedRoute>} />
      <Route path="/locales" element={<ProtectedRoute><Locales /></ProtectedRoute>} />
      <Route path="/editarLocales" element={<ProtectedRoute><EditarLocales /></ProtectedRoute>} />
      <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
      <Route path="/surtidos" element={<ProtectedRoute><Surtidos /></ProtectedRoute>} />
      <Route path="/Secciones/:id" element={<ProtectedRoute><Secciones /></ProtectedRoute>} />
      <Route path="/venta" element={<ProtectedRoute><Venta /></ProtectedRoute>} />
      <Route path="/historial" element={<ProtectedRoute><HistorialVentas /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
