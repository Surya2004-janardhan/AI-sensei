import axiosInstance from "./axiosInstance";

const searchWord = (query) =>
  axiosInstance.get("/dictionary/search", { params: { q: query } });
const wordOfDay = () => axiosInstance.get("/dictionary/word-of-day");

export default {
  searchWord,
  wordOfDay,
};
