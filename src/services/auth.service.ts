import api from "./api.service";

const login = async (credentials: object) => {
    // Axios enverra et stockera le cookie automatiquement grâce à withCredentials
    const response = await api.post('/users/login', credentials);
    return response.data;
};

const register = async (userData: object) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};

const getCurrentUser = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        return null;
    }
}

const logout = async () => {
    const response = await api.post('/users/logout');
    return response.data;
}

const forgotPassword = async (email: string) => {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
}

const resetPassword = async (token: string, newPassword: string) => {
    const response = await api.post('/users/reset-password', { token, newPassword });
    return response.data;
}

export default { login, register, getCurrentUser, logout, forgotPassword, resetPassword };