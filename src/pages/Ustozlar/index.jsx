import { useEffect, useState } from "react";
import Teachers from "../../service/teachers";
import Table from "../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
const Manegerlar = () => {
  const [teachers, setTeachers] = useState([]);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  console.log(setLoading);

  useEffect(() => {
    dispatch(setLoading(true));
    Teachers.getTeachers()
      .then((res) => {
        setTeachers(res.data);
      })
      .catch((err) => {
        console.error("ERR:", err.response?.status);
      })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);


  const columns = [
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Holati",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      title: "Role",
      render: (row) => (
        <span className="uppercase text-xs font-semibold">{row.role}</span>
      ),
    },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline">Ko‘rish</button>
          <button className="text-red-600 hover:underline">O‘chirish</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">O‘qituvchilar ro‘yxati</h1>

      {loading ? <div className="flex items-center w-100%"><p>Yuklanmoqda...</p></div> : <Table columns={columns} data={teachers} />}
    </div>
  );
};

export default Manegerlar;
