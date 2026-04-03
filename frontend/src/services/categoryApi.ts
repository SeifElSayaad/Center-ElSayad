import apiClient from './apiClient';

export const categoryApi = {
  getCategories: async (includeInactive: boolean = false) => {
    const response = await apiClient.get('/categories', { params: { includeInactive } });
    return response.data;
  },
};
