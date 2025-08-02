import axiosInstance from "./axiosInstance";

const getWordOfTheDay = () => axiosInstance.get("/wordoftheday/daily");

export default {
  getWordOfTheDay,
};
