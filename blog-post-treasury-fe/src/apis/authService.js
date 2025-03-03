import axiosClient from './axiosClient';

const register = async (body) => {
  return await axiosClient.post('/auth/sign-up', body);
};

const signIn = async (body) => {
  return await axiosClient.post('/auth/sign-in', body);
};

const getInfo = async (userId) => {
  return await axiosClient.get(`/user/${userId}`);
};

export { register, signIn, getInfo };
