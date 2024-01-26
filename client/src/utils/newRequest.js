import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:3000/api/",
  // baseURL: "https://api-h2x3.onrender.com/api/",
  withCredentials: true,
});

export default newRequest;