import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL || window.location.origin,
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
  return apiRequest('post', "/api/users/login", userCredentials, { withCredentials: true });
};


export const registerAPI = async (userCredentials) => {
  return apiRequest('post', "/api/users/register", userCredentials, { withCredentials: true });
};

export const getUserAPI = async () => {
  return apiRequest('get', "/api/users");
};

export const logoutAPI = async () => {
  return apiRequest('post', "/api/users/logout");
};


// Handle Design

export const createEmptyDesignAPI = async (formData) => {
  return apiRequest('post', "/api/designs/", formData);
};

export const addNewAttributeAPI = async (id, formData) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/option`, formData);
};

export const updateBaseDrawingAPI = async (id, formData) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/base`, formData);
};

export const shiftToSelectedCategoryAPI = async (id, formData) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/shift`, formData);
};

export const addNewParentAttributeAPI = async (id, updatedAttributes) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/parent`, updatedAttributes);
};


export const getDesignByIdAPI = async (designId) => {
  return apiRequest('get', `/api/designs/${designId}`);
};


export const getRecentDesignsAPI = async () => {
  return apiRequest('get', `/api/designs/recent`);
};

export const renameAttributeAPI = async (id, body) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/rename`, body);
};

export const updateDesignAttributesAPI = async (id, body) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/update`, body);
};


export const deleteDesignAttributesAPI = async (id, body) => {
  return apiRequest('patch', `/api/designs/${id}/attributes/delete`, body);
};







//pages
export const addNewPageAPI = async (id, body) => {
  return apiRequest('patch', `/api/designs/${id}/pages/add`, body);
};










export default api;

// { headers: { Authorization: `Bearer ${token}}}