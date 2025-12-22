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
    const teacherData = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      course_id: payload.course_id,
      role: payload.role || "teacher",
      field: payload.field,
      active: payload.active !== undefined ? payload.active : true,
    };

    const { data } = await api.post("/api/teacher/create-teacher", teacherData);
    return data;
  },

  async deleteTeacher(id) {
    const { data } = await api.delete("/api/teacher/deleted-teacher", {
      data: { 
        teacher_id: id,
      },
    });
    return data;
  },

  async editTeacher(id, payload) {
    const teacherData = {
      teacher_id: id, 
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      course_id: payload.course_id,
      role: payload.role,
      field: payload.field,
      active: payload.active,
    };
    const { data } = await api.put("/api/teacher/edited-teacher", teacherData);
    return data;
  },
};

export default Teachers;