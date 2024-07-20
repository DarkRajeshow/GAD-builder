import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL,
  withCredentials: true,
});

const apiRequest = async (method, url, data, options) => {
  try {
    const response = await api({
      method,
      url,
      data,
      options
    });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
};


// auth routes

export const loginAPI = async (userCredentials) => {
  return apiRequest('post', "/api/user/login", userCredentials, { withCredentials: true });
};


export const registerAPI = async (userCredentials) => {
  return apiRequest('post', "/api/user/register", userCredentials, { withCredentials: true });
};

export const getUserAPI = async () => {
  return apiRequest('get', "/api/user");
};

export const logoutAPI = async () => {
  return apiRequest('post', "/api/user/logout");
};


// Handle Design

export const createEmptyDesignAPI = async (formData) => {
  return apiRequest('post', "/api/designs/", formData);
};

export const addNewAttributeAPI = async (id, formData) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/option`, formData);
};

export const addNewParentAttributeAPI = async (id, updatedAttributes) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/parent`, updatedAttributes);
};


export const getDesignByIdAPI = async (designId) => {
  return apiRequest('get', `/api/designs/${designId}`);
};


export const getRecentDesigns = async () => {
  return apiRequest('get', `/api/designs/recent`);
};


export default api;

// { headers: { Authorization: `Bearer ${token}}}