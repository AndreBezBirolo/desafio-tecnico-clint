import axios from 'axios';
import UserService from "../services/UserService";

export function setupJWT() {
    axios.interceptors.request.use(
        (config) => {
            const token = UserService.getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}
