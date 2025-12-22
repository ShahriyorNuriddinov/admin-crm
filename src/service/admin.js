import api from "./api";

const AdminService = {
  getAllAdmins: async ({
    search = "",
    status = "",
    page = null,
    limit = null,
  } = {}) => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (page != null) params.page = page;
    if (limit != null) params.limit = limit;

    const res = await api.get("/api/staff/all-admins", { params });
    return res.data.data;
  },

  editAdmin: async (id, data) => {
    try {
      const res = await api.put("/api/staff/edited-admin", { id, ...data });
      return res.data;
    } catch (err) {
      if (err?.response?.status === 404) {
        try {
          const res2 = await api.post("/api/staff/edited-admin", {
            id,
            ...data,
          });
          return res2.data;
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },

  createAdmin: async (payload) => {
    const res = await api.post("/api/staff/create-admin", payload);
    return res.data;
  },

  deleteAdmin: async (id) => {
    const res = await api.delete("/api/staff/deleted-admin", { data: { id } });
    return res.data;
  },
};

export default AdminService;
