import api from "./api";

const Teachers = {
  async getTeachers({
    search = "",
    status = "",
    page = null,
    limit = null,
  } = {}) {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (page != null) params.page = page;
    if (limit != null) params.limit = limit;

    const { data } = await api.get("/api/teacher/get-all-teachers", { params });
    return data;
  },

  async getTeacherById(id) {
    const { data } = await api.get(`/api/teacher/get-teacher/${id}`);
    return data;
  },

  async createTeacher(payload) {
    const { data } = await api.post("/api/teacher/create-teacher", payload);
    return data;
  },

  async deleteTeacher(id) {
    const { data } = await api.delete("/api/teacher/deleted-teacher", {
      data: { id },
    });
    return data;
  },

  async editTeacher(id, payload) {
    const { data } = await api.put("/api/teacher/edited-teacher", {
      id,
      ...payload,
    });
    return data;
  },
};

export default Teachers;
