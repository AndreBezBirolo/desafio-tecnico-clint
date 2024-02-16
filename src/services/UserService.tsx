import axios from "axios";

let tokenExpirationTimer: NodeJS.Timeout | null = null;

const UserService = {
    login: async (username: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);
            startTokenExpirationTimer();
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
        stopTokenExpirationTimer();
    },
    getToken: () => {
        return localStorage.getItem('jwtToken');
    },
    setToken: (token: string) => {
        return localStorage.setItem('jwtToken', token);
    },
    renewToken: async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/renew-token`);
            const newToken = response.data.token;
            UserService.setToken(newToken);
        } catch (error: any) {
            throw error.response.data.error;
        }
    },
};

function startTokenExpirationTimer() {
    if (tokenExpirationTimer !== null) {
        return;
    }
    tokenExpirationTimer = setTimeout(async () => {
        await UserService.renewToken();
        startTokenExpirationTimer();
    }, 55 * 60 * 1000);
}

function stopTokenExpirationTimer() {
    if (tokenExpirationTimer !== null) {
        clearTimeout(tokenExpirationTimer);
        tokenExpirationTimer = null;
    }
}

export default UserService;