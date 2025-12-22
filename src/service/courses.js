import axios from "./api";

const Courses = {
    
  async getcourses() {
    const { data } = await axios.get("/api/course/get-courses");
    console.log(data);
    
    return data;
  },
};

export default Courses ;
