import api from "./api";

const Students = {
  async getStudents({
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

    const { data } = await api.get("/api/student/get-all-students", { params });
    return data;
  },

  async createStudent(studentData) {
    const { data } = await api.post("/api/student/create-student", studentData);
    return data;
  },


 
  async deleteStudent(studentId) {
    const { data } = await api.delete(
      `/api/student/delete-student/${studentId}`
    );
    return data;
  },

  async editStudent(id, payload) {
    const { data } = await api.put("/api/student/edited-student", {
      id,
      ...payload,
    });
    return data;
  },

  async searchGroup(groupName) {
    const { data } = await api.get("/api/student/search-group", {
      params: { name: groupName },
    });
    return data;
  },

  async getStudentById(studentId) {
    const { data } = await api.get(`/api/student/student/${studentId}`);
    return data;
  },
};

export default Students;
