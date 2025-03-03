import axios from 'axios';
import Cookies from 'js-cookie';
const apiKey = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: apiKey || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    console.log('err', err)
    const originalRequest = err.config;

    if (err.response.status === 400) {
      return Promise.reject(err);
    }
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');
      const userId = Cookies.get('userId');
      
      if (!refreshToken) {
        return Promise.reject(err);
      }

      try {
        const res = await axiosClient.post('/auth/refresh-token', {
          userId: userId,
          token: refreshToken
        });

        const newAccessToken = res.data.accessToken || '';

        Cookies.set('token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (error) {
        Cookies.remove('token');
        //Cookies.remove('refreshToken');

        return Promise.reject(error);
      }
    }
  }
);

export default axiosClient;
