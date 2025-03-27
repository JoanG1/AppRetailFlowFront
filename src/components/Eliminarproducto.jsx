import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const EliminarProducto = ({ open, handleClose, handleEliminar, producto }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Eliminar Producto</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar <b>{producto?.nombre}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => handleEliminar(producto.id)} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarProducto;
