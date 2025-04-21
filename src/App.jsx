import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/Inventario";
import Local from "./components/Local"; // Importamos el nuevo componente Local
import Surtido from "./components/Surtido";
import Bodegas from "./components/Bodegas";
import EditarBodegas from "./components/EditarBodega";
import Locales from "./components/Locales";
import EditarLocales from "./components/EditarLocales";
import Productos from "./components/Productos";
import Surtidos from "./components/Surtidos";
import Secciones from "./components/Secciones";






function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/surtido" element={<Surtido/>} />
      <Route path="/local" element={<Local />} /> {/* Nueva ruta para Local */}
      <Route path="/" element={<Register />} />
      <Route path="/bodegas" element={<Bodegas />} />
      <Route path="/editarBodegas" element={<EditarBodegas />} />
      <Route path="/locales" element={<Locales />} />
      <Route path="/editarLocales" element={<EditarLocales />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/surtidos" element={<Surtidos />} />
      <Route path="/Secciones/:id" element={<Secciones />} />

    </Routes>
  );
}

export default App;

