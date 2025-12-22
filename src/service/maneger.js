import api from "./api";

const Manager = {
  async getmaneger({
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

    const { data } = await api.get("/api/staff/all-managers", { params });
    return data;
  },

  async getManagerById(id) {
    const { data } = await api.get(`/api/staff/manager/${id}`);
    return data;
  },

  async createManager(payload) {
    const { data } = await api.post("/api/staff/create-manager", payload);
    return data;
  },

  async deleteManager(id) {
    const { data } = await api.delete("/api/staff/deleted-staff", {
      data: { id },
    });
    return data;
  },

  async editManager(id, payload) {
    const { data } = await api.post("/api/staff/edited-manager", {
      id,
      ...payload,
    });
    return data;
  },

  async leaveStaff(id) {
    const { data } = await api.post("/api/staff/leave-staff", { id });
    return data;
  },

  async leaveExitStaff(id) {
    const { data } = await api.post("/api/staff/leave-exit-staff", { id });
    return data;
  },
};

export default Manager;
