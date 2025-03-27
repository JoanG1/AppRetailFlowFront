import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/Inventario";
import Local from "./components/Local"; // Importamos el nuevo componente Local
import Surtido from "./components/Surtido";

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
    </Routes>
  );
}

export default App;

