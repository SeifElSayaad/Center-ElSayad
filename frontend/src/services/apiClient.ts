import axios from 'axios';
import { authStorage } from '../auth/storage';

// Physical device (Expo Go) on both Android and iOS must use the host machine's LAN IP.
// 10.0.2.2 only works inside the Android emulator — never on a real phone.
// If you change Wi-Fi networks, update this IP (run `ipconfig` and look for your Wi-Fi IPv4).
const BASE_URL = 'http://192.168.1.104:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to every request if available
apiClient.interceptors.request.use(async (config) => {
  const token = await authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
