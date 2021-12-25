import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  // tell server that client wants to be able to see the response
  // also automatically attach cookies to request
  withCredentials: true,
});

export default axiosInstance;
