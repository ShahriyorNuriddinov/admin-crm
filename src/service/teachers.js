import axios from "./api";

const Teachers = {
    
  async getTeachers() {
    const { data } = await axios.get("/api/teacher/get-all-teachers");
    console.log(data);
    
    return data;
  },
};

export default Teachers;
