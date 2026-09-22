import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.tvmaze.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = {
      message: 'Erro desconhecido ao carregar dados.',
      status: error.response?.status,
    };

    if (error.code === 'ECONNABORTED') {
      customError.message = 'Tempo limite de resposta excedido. Verifique sua conexão.';
    } else if (!error.response) {
      customError.message = 'Falha na conexão com o servidor da TVMaze. Verifique sua internet.';
    } else if (error.response.status === 404) {
      customError.message = 'Recurso não encontrado.';
    } else if (error.response.status >= 500) {
      customError.message = 'Erro interno no servidor da TVMaze. Tente mais tarde.';
    }

    return Promise.reject(customError);
  }
);

export default apiClient;
