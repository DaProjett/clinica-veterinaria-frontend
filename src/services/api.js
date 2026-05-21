import axios from 'axios';
import { mockMascotas, mockDuenos } from '../utils/mockData';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Configurado para integración real con backend MySQL
const USE_MOCK_DATA = false; // Integración con backend real activada

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mascotaService = {
  // Obtener todas las mascotas
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return mockMascotas;
    }

    try {
      const response = await api.get('/mascotas');
      // Si es un array, devolverlo directamente
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // Si es un objeto, extraer las mascotas
      if (response.data && response.data.content) {
        return response.data.content;
      }
      if (response.data && response.data.mascotas) {
        return response.data.mascotas;
      }
      // Si es una única mascota, devolverla en un array
      if (response.data && response.data.id) {
        return [response.data];
      }
      // Devolver array vacío si no hay datos
      return [];
    } catch (error) {
      console.error('Error fetching mascotas:', error);
      throw error;
    }
  },

  // Obtener mascota por ID
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      return mockMascotas.find(m => m.id === parseInt(id));
    }
    
    try {
      const response = await api.get(`/mascotas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching mascota ${id}:`, error);
      throw error;
    }
  },

  // Crear nueva mascota
  create: async (mascota) => {
    if (USE_MOCK_DATA) {
      const newMascota = {
        ...mascota,
        id: Math.max(...mockMascotas.map(m => m.id)) + 1,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      mockMascotas.push(newMascota);
      return newMascota;
    }

    try {
      const response = await api.post('/mascotas/simple', mascota);
      return response.data;
    } catch (error) {
      // Extraer mensaje de error del backend
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          'Error al crear la mascota';
      console.error('Error creating mascota:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Actualizar mascota
  update: async (id, mascota) => {
    if (USE_MOCK_DATA) {
      const index = mockMascotas.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        mockMascotas[index] = { ...mockMascotas[index], ...mascota };
        return mockMascotas[index];
      }
      return null;
    }

    try {
      const response = await api.put(`/mascotas/simple/${id}`, mascota);
      return response.data;
    } catch (error) {
      // Extraer mensaje de error del backend
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          `Error al actualizar la mascota ${id}`;
      console.error(`Error updating mascota ${id}:`, errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Eliminar mascota
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      const index = mockMascotas.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        mockMascotas.splice(index, 1);
        return true;
      }
      return false;
    }
    
    try {
      await api.delete(`/mascotas/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting mascota ${id}:`, error);
      throw error;
    }
  },

  // Buscar mascotas por nombre
  searchByName: async (nombre) => {
    if (USE_MOCK_DATA) {
      return mockMascotas.filter(m => 
        m.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }
    
    try {
      const response = await api.get(`/mascotas/buscar/nombre/${nombre}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching mascotas by name ${nombre}:`, error);
      throw error;
    }
  },

  // Buscar mascotas por especie
  searchByEspecie: async (especie) => {
    if (USE_MOCK_DATA) {
      return mockMascotas.filter(m => 
        m.especie.toLowerCase().includes(especie.toLowerCase())
      );
    }
    
    try {
      const response = await api.get(`/mascotas/buscar/especie/${especie}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching mascotas by especie ${especie}:`, error);
      throw error;
    }
  }
};

export const duenoService = {
  // Obtener todos los dueños
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return mockDuenos;
    }

    try {
      const response = await api.get('/duenos');
      let data = response.data;
      // Si es string, parsear manualmente
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Error al parsear JSON:', e);
          return [];
        }
      }
      // Asegurar que siempre devuelve un array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching duenos:', error);
      return [];
    }
  },

  // Obtener dueño por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/duenos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dueno ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo dueño
  create: async (dueno) => {
    try {
      const response = await api.post('/duenos', dueno);
      return response.data;
    } catch (error) {
      console.error('Error creating dueno:', error);
      throw error;
    }
  },

  // Actualizar dueño
  update: async (id, dueno) => {
    try {
      const response = await api.put(`/duenos/${id}`, dueno);
      return response.data;
    } catch (error) {
      console.error(`Error updating dueno ${id}:`, error);
      throw error;
    }
  },

  // Eliminar dueño
  delete: async (id) => {
    try {
      await api.delete(`/duenos/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting dueno ${id}:`, error);
      throw error;
    }
  }
};

export default api;