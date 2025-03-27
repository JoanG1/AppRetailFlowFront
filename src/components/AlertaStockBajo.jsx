import React from "react";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";

const AlertaStockBajo = ({ productos }) => {
  // Filtrar productos con stock bajo (menos de 5 unidades)
  const productosBajoStock = productos.filter((producto) => producto.cantidad < 5);

  // Si no hay productos con stock bajo, no mostramos nada
  if (productosBajoStock.length === 0) return null;

  // Mostrar solo los primeros 3 productos
  const productosMostrar = productosBajoStock.slice(0, 3);
  const productosOcultos = productosBajoStock.length - 3; // Cantidad de productos no mostrados

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="warning">
        <AlertTitle>⚠️ Stock Bajo</AlertTitle>
        {productosMostrar.map((producto) => (
          <Typography key={producto.id}>
            <strong>{producto.nombre}</strong> tiene solo {producto.cantidad} unidades en stock.
          </Typography>
        ))}
        
        {/* Mostrar "+X más" si hay productos ocultos */}
        {productosOcultos > 0 && (
          <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
            +{productosOcultos} más productos con stock bajo.
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

export default AlertaStockBajo;
