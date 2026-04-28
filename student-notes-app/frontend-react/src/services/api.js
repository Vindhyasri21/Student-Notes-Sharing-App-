import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:3001"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = (data) => API.post("/login", data);
export const signupUser = (data) => API.post("/signup", data);
export const uploadNote = (data) => API.post("/upload", data);
export const getNotes = () => API.get("/notes");
export const getMyUploads = () => API.get("/my-uploads");
export const likeNote = (id) => API.post(`/like/${id}`);
export const dislikeNote = (id) => API.post(`/dislike/${id}`);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
