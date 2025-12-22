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

  async addStudentToGroup(studentId, groupData) {
    const { data } = await api.post(
      `/api/student/added-new-group-student/${studentId}`,
      groupData
    );
    return data;
  },

  async returnStudent(studentId) {
    const { data } = await api.post(`/api/student/return-student/${studentId}`);
    return data;
  },

  async leaveStudent(studentId) {
    const { data } = await api.post(`/api/student/leave-student/${studentId}`);
    return data;
  },

  async returnLeaveStudent(studentId) {
    const { data } = await api.post(
      `/api/student/return-leave-student/${studentId}`
    );
    return data;
  },

  async deleteStudent(studentId) {
    const { data } = await api.delete(
      `/api/student/delete-student/${studentId}`
    );
    return data;
  },

  async editStudent(id, payload) {
    // backend uses edited-student endpoint
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
