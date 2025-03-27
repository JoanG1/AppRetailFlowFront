import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const EditarProducto = ({ open, handleClose, producto, handleActualizar }) => {
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar datos cuando el modal se abra
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setStock(producto.stock.toString());
      setPrecio(producto.precio.toString());
    }
  }, [producto]);

  const handleSubmit = () => {
    const productoEditado = {
      ...producto,
      nombre,
      stock: parseInt(stock, 10),
      precio: parseFloat(precio),
    };

    // Llamar a la función para actualizar el producto
    handleActualizar(productoEditado);

    // Cerrar el modal
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Producto</DialogTitle>
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
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarProducto;
