import axios from 'axios';

const clienteService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // toma tu .env
});

export default clienteService;
