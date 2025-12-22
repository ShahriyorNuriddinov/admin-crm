import api from "./api";

const CoursesService = {
  async getcourses({
    search = "",
    status = "",
    is_freeze = null,
    page = null,
    limit = null,
  } = {}) {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (is_freeze != null) params.is_freeze = is_freeze;
    if (page != null) params.page = page;
    if (limit != null) params.limit = limit;

    const { data } = await api.get("/api/course/get-courses", { params });
    return data;
  },

  async getCourseById(id) {
    const { data } = await api.get(`/api/course/course/${id}`);
    return data;
  },

  async deleteCourse(id) {
    const { data } = await api.delete("/api/course/delete-course", {
      data: { course_id: id },
    });
    return data;
  },

  async editCourse(id, payload) {
    const courseData = {
      course_id: id, 
      price: payload.price,
      duration: payload.duration,
      name: payload.name,
      description: payload.description,
    };

    const { data } = await api.post("/api/course/edit-course", courseData);
    return data;
  },

  async createCourse(payload) {
    const { data } = await api.post("/api/course/create-course", payload);
    return data;
  },

  async createCategory(payload) {
    const { data } = await api.post("/api/course/create-category", payload);
    return data;
  },

  async freezeCourse(id) {
    const { data } = await api.post("/api/course/freeze-course", { 
      course_id: id 
    });
    return data;
  },

  async unfreezeCourse(id) {
    const { data } = await api.post("/api/course/unfreeze-course", { 
      course_id: id 
    });
    return data;
  },
};

export default CoursesService;