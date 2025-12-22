import api from "./api";

const GroupService = {
  async searchCourse(search = "") {
    const { data } = await api.get("/api/group/search-course", {
      params: { search },
    });
    return data;
  },

  async searchTeacher(name = "") {
    const { data } = await api.get("/api/group/search-teacher", {
      params: { name },
    });
    return data;
  },

  async getOneGroup(id) {
    const { data } = await api.get(`/api/group/one-group/${id}`);
    return data;
  },
};

export default GroupService;
