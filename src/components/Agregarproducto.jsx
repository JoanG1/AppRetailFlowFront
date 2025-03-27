import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const AgregarProducto = ({ open, handleClose, handleGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = () => {
    // Crear objeto del producto
    const nuevoProducto = {
      id: Math.floor(Math.random() * 1000), // Genera un ID ficticio
      nombre,
      stock: parseInt(stock, 10),
      precio: parseFloat(precio),
    };

    // Llamar a la función para guardar el producto
    handleGuardar(nuevoProducto);

    // Limpiar los campos y cerrar el modal
    setNombre("");
    setStock("");
    setPrecio("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Producto</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del Producto"
          fullWidth
          variant="outlined"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          variant="outlined"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          variant="outlined"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarProducto;
