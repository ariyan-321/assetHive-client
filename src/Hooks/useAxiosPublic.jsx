import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://assignment-12-server-neon.vercel.app"
});

const useAxiosPublic = () => {
  return axiosInstance;
};

export default useAxiosPublic;
