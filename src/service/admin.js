import axios from "./api";

const base_url = "https://admin-crm.onrender.com";
const token = localStorage.getItem("token");

const config = {
  headers: { Authorization: `Token ${token}` },
};

const AdminService = {
  getAllAdmins: async () => {
    const res = await axios.get(`${base_url}/api/staff/all-admins`, config);
    return res.data.data;
  },

  editAdmin: async (id, data) => {
    const res = await axios.put(
      `${base_url}/api/staff/edited-admin`,
      { id, ...data },
      config
    );
    return res.data;
  },

  deleteAdmin: async (id) => {
    const res = await axios.delete(`${base_url}/api/staff/deleted-staff`, {
      ...config,
      data: { id },
    });
    return res.data;
  },
};

export default AdminService;
