import axios from "axios";

// URL base de la API
const API_URL ="http://localhost:8080" //"http://149.50.142.146:8080";

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
