import axios from "./api";

const Manager = {
    
  async getmaneger() {
    const { data } = await axios.get("/api/staff/all-managers");
    console.log(data);
    
    return data;
  },
};

export default Manager;
