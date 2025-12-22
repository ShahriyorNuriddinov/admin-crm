import axios from "./api";

const AuthService = {
  async userLogin({ email, password }) {
    const response = await axios.post("/api/auth/sign-in", { email, password });
    return response.data.data;
  },

  async getProfile() {
    const { data } = await axios.get("/api/auth/profile");
    return data;
  },

  async editProfile(payload) {
    const { data } = await axios.post("/api/auth/edit-profile", payload);
    return data;
  },

  async editProfileImg(formData) {
    const { data } = await axios.post("/api/auth/edit-profile-img", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async editPassword(payload) {
    const { data } = await axios.put("/api/auth/edit-password", payload);
    return data;
  },
};

export default AuthService;
