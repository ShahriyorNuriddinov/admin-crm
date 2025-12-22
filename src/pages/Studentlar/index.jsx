import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Students from "../../service/students";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../slice/loading";
import { toast } from "react-toastify";

const Studentlar = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    groups: [],
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const res = await Students.getStudents({
        search: debouncedSearch,
        status,
      });
      setStudents(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Talabalarni yuklashda xatolik");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  const handleSave = async () => {
    try {
      if (!form.first_name || !form.last_name || !form.phone) {
        toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
        return;
      }

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        groups: form.groups,
      };

      await Students.createStudent(payload);
      toast.success("Student muvaffaqiyatli qo‘shildi");
      await fetchData();
      setModalOpen(false);
      setForm({ first_name: "", last_name: "", phone: "", groups: [] });
    } catch (err) {
      console.error(err);
      let msg = "Student qo‘shishda xatolik";

      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") msg = data;
        else if (data.message) msg = data.message;
        else msg = JSON.stringify(data);
      } else if (err?.message) msg = err.message;

      toast.error(msg);
    }
  };

  const handleDelete = async (student) => {
    try {
      const id = student._id; 
      if (!id) {
        toast.error("Student ID topilmadi!");
        return;
      }

      await Students.deleteStudent(id);
      toast.success("Student o‘chirildi");
      await fetchData();
    } catch (err) {
      console.error(err);
      let msg = "Studentni o‘chirishda xatolik";
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") msg = data;
        else if (data.message) msg = data.message;
        else msg = JSON.stringify(data);
      } else if (err?.message) msg = err.message;
      toast.error(msg);
    }
  };

  const openModal = () => {
    setForm({ first_name: "", last_name: "", phone: "", groups: [] });
    setModalOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Telefon", dataIndex: "phone" },
    { title: "Holati", dataIndex: "status" },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setForm({ ...row });
              setModalOpen(true);
            }}
            className="bg-blue-500 text-white"
          >
             Ko‘rish
          </Button>
          <Button
            onClick={() => handleDelete(row)}
            className="bg-red-500 text-white"
          >
             O‘chirish
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Studentlar ro'yxati</h1>

      <div className="mb-4 flex items-center gap-3">
        <div className="ml-auto flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qidirish..."
            className="px-3 py-2 border rounded w-64"
          />
          <button
            onClick={openModal}
            className="bg-black text-white px-3 py-2 rounded"
          >
            + Student Qo'shish
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="">All</option>
            <option value="faol">Faol</option>
            <option value="yakunladi">Yakunladi</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center w-full">
          <p>Yuklanmoqda...</p>
        </div>
      ) : (
        <Table columns={columns} data={students} />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Yangi student qo'shish"
      >
        <div className="space-y-3">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Ism"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Familiya"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon (min 12 raqam)"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="group"
            value={form.groups[0]?.group || ""}
            onChange={(e) =>
              setForm({
                ...form,
                groups: e.target.value ? [{ group: e.target.value }] : [],
              })
            }
            placeholder="Guruh ID "
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSave} className="bg-blue-500 text-white">
              Saqlash
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Studentlar;
