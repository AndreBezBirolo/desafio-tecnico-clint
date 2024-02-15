import axios from "axios";

const UserService = {
    login: async (username: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);
            return token;
        } catch (error: any) {
            throw error.response.data.error;
        }
    },

    register: async (username: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/register`, {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);
            return token;
        } catch (error: any) {
            throw error.response.data.error;
        }
    },
    logout: () => {
        localStorage.removeItem('jwtToken');
    },
    getToken: () => {
        return localStorage.getItem('jwtToken');
    },
    setToken: (token: string) => {
        return localStorage.setItem('jwtToken', token);
    },
};

export default UserService;