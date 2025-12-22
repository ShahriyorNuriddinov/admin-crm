import axios from "./api";

const AuthSrevice = {
  async userloggin({ email, password }) {
    const response = await axios.post("/api/auth/sign-in", {
      email,
      password,
    });
    console.log(response.data.data);
    
    return response.data.data;
  }
};

export default AuthSrevice;
