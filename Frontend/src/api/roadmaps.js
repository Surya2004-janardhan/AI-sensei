import axiosInstance from "./axiosInstance";

const getRoadmaps = () => axiosInstance.get("/roadmaps");
const enrollRoadmap = (id) => axiosInstance.post(`/roadmaps/enroll/${id}`);

export default {
  getRoadmaps,
  enrollRoadmap,
};
