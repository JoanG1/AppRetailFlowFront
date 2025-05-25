import axios from "axios";

// URL base de la API
const API_URL = "http://149.50.150.130:8080" //"http://localhost:8080" // // //;

// Obtener el token almacenado
const getAuthToken = () => localStorage.getItem("token");

// Instancia de Axios con configuración básica
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token SOLO en las peticiones que lo necesitan
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    // Verificar que no sea una solicitud de login o register
    if (token && !config.url.includes("/auth/login") && !config.url.includes("/auth/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 🔹 Servicio para realizar un surtido (POST /surtidos)
export const surtirProductos = async (productos) => {
    try {

        console.log(productos)
      // Generar la fecha actual en formato ISO 8601
      const fechaSurtido = new Date().toISOString();
  
      const response = await api.post("/surtidos", { fechaSurtido, productos });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Error al surtir productos";
    }
  };

// Función para iniciar sesión
export const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error en la autenticación";
  }
};

// Función para registrar usuario
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error en el registro";
  }
};

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await api.get("/productos");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener productos";
  }
};

// Obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener producto";
  }
};

// Agregar un nuevo producto
export const addProducto = async (producto) => {
  try {
    const response = await api.post("/productos", producto);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al agregar producto";
  }
};

// Editar un producto
export const updateProducto = async (id, producto) => {
  try {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al actualizar producto";
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al eliminar producto";
  }
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
};

// Crear una bodega
export const crearBodega = async (bodega) => {
  try {
    const response = await api.post("/api/bodegas/vacia", bodega);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al crear bodega ";
  }
};

// Crear bodega con secciones
export const crearBodegaConSecciones = async (bodega) => {
  try {
    const response = await api.post("/api/bodegas", bodega);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al crear bodega con secciones";
  }
};

// Obtener bodegas
export const getBodegas = async () => {
  try {
    const response = await api.get("/api/bodegas");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al traer las bodegas";
  }
};

// Eliminar bodegas
export const eliminarBodega  = async (id) => {
  try {
    const response = await api.delete(`/api/bodegas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al eliminar la bodega";
  }
};

// Obtener secciones por bodega
export const getSeccionesPorBodega  = async (idBodega) => {
  try {
    const response = await api.get(`/api/secciones/bodega/${idBodega}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al traer secciones de bodega";
  }
};

//Crear Local
export const crearLocal = async (local) => {
  try {
    const response = await api.post("/api/Locales", local);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al crear bodega con secciones";
  }
};

//traer todos los locales
export const getLocales  = async () => {
  try {
    const response = await api.get("/api/Locales");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al traer locales";
  }
};

// Editar un nombre local
export const editarLocal = async (id, data) => {
  try {
    const response = await api.put(`/api/Locales/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al actualizar local";
  }
};

//Traer referencias de productos-local
export const getProductosLocalPorLocal  = async (localId) => {
  try {
    const response = await api.get(`/api/productos-local/local/${localId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al traer referencias de productos";
  }
};

//traer informacion de productos

export const getProductoPorId  = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al traer informacion de productos";
  }
};

//Combinacion de peticiones en una sola para productos

export const getProductosConNombrePorLocal = async (localId) => {
  const productosLocales = await getProductosLocalPorLocal(localId);

  const productosCompletos = await Promise.all(
    productosLocales.map(async (prodLocal) => {
      if (!prodLocal?.productoId) {
        console.warn("Producto local sin producto_id:", prodLocal);
        return null;
      }

      try {
        const producto = await getProductoPorId(prodLocal.productoId);
        return {
          id: prodLocal.id,
          stock: prodLocal.stock,
          nombre: producto.nombre
        };
      } catch (error) {
        console.error(`Error al traer producto con ID ${prodLocal.producto_id}:`, error);
        return null;
      }
    })
  );

  return productosCompletos.filter(Boolean); // Filtra los nulls
};

export const getProductosConNombrePorLocalConProductoId = async (localId) => {
  const productosLocales = await getProductosLocalPorLocal(localId);

  const productosCompletos = await Promise.all(
    productosLocales.map(async (prodLocal) => {
      if (!prodLocal?.productoId) {
        console.warn("Producto local sin producto_id:", prodLocal);
        return null;
      }

      try {
        const producto = await getProductoPorId(prodLocal.productoId);
        return {
          id: prodLocal.productoId,
          stock: prodLocal.stock,
          nombre: producto.nombre
        };
      } catch (error) {
        console.error(`Error al traer producto con ID ${prodLocal.producto_id}:`, error);
        return null;
      }
    })
  );

  return productosCompletos.filter(Boolean); // Filtra los nulls
};


// Eliminar un producto local
export const eliminarProductoLocal = async (productoLocalId) => {
  try {
    const response = await api.delete(`/api/productos-local/${productoLocalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al eliminar el producto del local";
  }
};

//Editar stock de productos local
export const editarStockProductoLocal = async (id, nuevoStock) => {
  try {
    const response = await api.put(`/api/productos-local/${id}`, {
      stock: nuevoStock,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al actualizar el stock del producto";
  }
};

//Crear producto principal
export const crearProducto = async (productoData) => {
  try {
    const response = await api.post("/productos", productoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al crear producto";
  }
};


// Crear nuevo surtido con localId en la URL
export const crearSurtido = async (surtidoData, localId) => {
  try {
    const response = await api.post(`/surtidos/${localId}`, surtidoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al crear surtido";
  }
};

//Traer referencias de productos-bodega
export const getProductosBodegaPorSeccion  = async (seccionId) => {
  try {
    const response = await api.get(`/api/productos-bodega/seccion/${seccionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al traer referencias de productos";
  }
};

//Combinacion de peticiones en una sola para productos bodega

export const getProductosConNombrePorSeccion = async (seccionId) => {
  const productosSecciones = await getProductosBodegaPorSeccion(seccionId);

  const productosCompletos = await Promise.all(
    productosSecciones.map(async (prodLocal) => {
      if (!prodLocal?.productoId) {
        console.warn("Producto local sin producto_id:", prodLocal);
        return null;
      }

      try {
        const producto = await getProductoPorId(prodLocal.productoId);
        return {
          id: prodLocal.id,
          stock: prodLocal.stock,
          nombre: producto.nombre
        };
      } catch (error) {
        console.error(`Error al traer producto con ID ${prodLocal.producto_id}:`, error);
        return null;
      }
    })
  );
  return productosCompletos.filter(Boolean); // Filtra los nulls
};

//Elimina producto bodega

export const eliminarProductoBodega = async (productoBodegaId) => {
  try {
    await api.delete(`/api/productos-bodega/${productoBodegaId}`);
  } catch (error) {
    throw error.response?.data || "Error al eliminar producto de la bodega";
  }
};

//ContarProductos
export const obtenerTotalProductos = async () => {
  try {
    const response = await api.get("/productos/total");
    return parseInt(response.data, 10); // asumiendo que `response.data` es un número tipo long simple
  } catch (error) {
    throw error.response?.data || "Error al obtener el total de productos";
  }
};

//Contar Bodegas
export const obtenerTotalBodegas = async () => {
  try {
    const response = await api.get("/api/bodegas/total");
    return parseInt(response.data, 10); // asumiendo que `response.data` es un número tipo long simple
  } catch (error) {
    throw error.response?.data || "Error al obtener el total de Bodegas";
  }
};

//Contar Locales
export const obtenerTotalLocales = async () => {
  try {
    const response = await api.get("/api/Locales/total");
    return parseInt(response.data, 10); // asumiendo que `response.data` es un número tipo long simple
  } catch (error) {
    throw error.response?.data || "Error al obtener el total de locales";
  }
};

//Contar Surtidos
export const obtenerTotalSurtidos = async () => {
  try {
    const response = await api.get("/surtidos/total");
    return parseInt(response.data, 10); // asumiendo que `response.data` es un número tipo long simple
  } catch (error) {
    throw error.response?.data || "Error al obtener el total de surtidos";
  }
};

// Top 10 productos

export const obtenerTopProductos = async () => {
  try {
    const response = await api.get("/productos/top");
    return response.data; 
  } catch (error) {
    throw error.response?.data || "Error al obtener el total de surtidos";
  }
};

// obtener informacion de los surtidos

export const obtenerSurtidosConProductos = async () => {
  try {
    // 1. Obtener todos los surtidos
    const surtidosResp = await api.get("/surtidos/top");
    const surtidos = surtidosResp.data;

    // 2. Filtrar surtidos con productos
    const surtidosFiltrados = surtidos.filter(s => s.productosSurtidos.length > 0);

    // 3. Obtener todos los IDs de productos únicos
    const productoIds = [
      ...new Set(
        surtidosFiltrados.flatMap(s => s.productosSurtidos.map(ps => ps.id))
      )
    ];

    // 4. Obtener todos los productos
    const productosResp = await api.get("/productos");
    const productos = productosResp.data;

    // 5. Crear el resultado combinado
    const resultados = surtidosFiltrados.flatMap(surtido =>
      surtido.productosSurtidos.map(ps => {
        const producto = productos.find(p => p.id === ps.id);
        return {
          id: surtido.id,
          producto: producto?.nombre || `Producto ${ps.id}`,
          cantidad: ps.cantidad
        };
      })
    );

    return resultados;
  } catch (error) {
    console.error("Error combinando productos con surtidos:", error);
    throw error.response?.data || "Error al obtener surtidos con productos";
  }
};

// Crear Secciones
export const crearSeccion = async ({ nombre, bodegaId }) => {
  try {
    const response = await api.post("/api/secciones", { nombre, bodegaId });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al crear la sección";
  }
};

// Productos disponibles

export const getProductosDisponibles = async () => {
  try {
    const response = await api.get("/productos/no-asignados");
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos disponibles:', error);
    throw error;
  }
};


// Agregar producto a una sección de bodega
export const agregarProductoABodega = async ({ productoId, seccionId, stock }) => {
  try {
    const response = await api.post("/api/productos-bodega", {
      id: 0,
      productoId,
      seccionId,
      stock,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al agregar el producto a la bodega";
  }
};

export const crearVenta = async(body) => {
  try{

    const response = await api.post("/ventas", body)
    return response.data
    
  }catch(error){
    throw error.response?.data || "Error al crear la venta"
  }
}

// Obtener historial de ventas
export const getHistorialVentas = async () => {
  try {
    const response = await api.get("/ventas/historial");
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial de ventas:", error);
    throw error;
  }
};

// eliminacion de seccion
export const deleteSeccion = async (id) => {
  try {
    const response = await api.delete(`/api/secciones/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar seccion de ventas:", error);
    throw error;
  }
};

// eliminacion de seccion
export const deleteLocal = async (id) => {
  try {
    const response = await api.delete(`/api/Locales/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar seccion de ventas:", error);
    throw error;
  }
};


