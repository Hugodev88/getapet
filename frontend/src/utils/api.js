import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

// Interceptor de resposta para capturar erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Resposta de erro da API
            console.error('Erro na resposta da API:', error.response.data);
        } else if (error.request) {
            // A requisição foi feita, mas sem resposta
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            // Erro na configuração da requisição
            console.error('Erro ao configurar a requisição:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
