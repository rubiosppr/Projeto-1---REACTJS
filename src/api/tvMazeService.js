import apiClient from './apiClient';

export const tvMazeService = {
  getShows: (page = 0) => apiClient.get(`/shows?page=${page}`),
  
  searchShows: (query) => apiClient.get(`/search/shows?q=${encodeURIComponent(query)}`),
  
  getShowDetails: (id, embed = []) => {
    const embedParams = embed.length > 0 ? `?embed[]=${embed.join('&embed[]=')}` : '';
    return apiClient.get(`/shows/${id}${embedParams}`);
  },
  
  getShowEpisodes: (id) => apiClient.get(`/shows/${id}/episodes`),
  
  getShowCast: (id) => apiClient.get(`/shows/${id}/cast`),
};
