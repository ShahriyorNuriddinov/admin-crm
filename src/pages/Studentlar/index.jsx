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
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Filters
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
    const load = async () => {
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
    load();
  }, [debouncedSearch, status, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (student) => {
    setSelected(student);
    setForm({ ...student });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selected) {
        const id = selected._id || selected.id;
        console.log("EDIT Student -> PUT /api/student/edited-student", {
          id,
          ...form,
        });
        await Students.editStudent(id, form);
        toast.success("Muvaffaqiyatli o‘zgartirildi");
      } else {
        console.log("CREATE Student -> POST /api/student/create-student", form);
        await Students.createStudent(form);
        toast.success("Student muvaffaqiyatli qo‘shildi");
      }
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "Saqlashda xatolik");
    }
  };

  const handleDelete = async () => {
    try {
      const id = selected._id || selected.id;
      console.log(
        "DELETE Student -> DELETE /api/student/delete-student/:id",
        id
      );
      await Students.deleteStudent(id);
      await fetchData();
      setModalOpen(false);
      toast.success("O‘chirildi");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(msg || "O‘chirishda xatolik");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Ism", dataIndex: "first_name" },
    { title: "Familiya", dataIndex: "last_name" },
    { title: "Email", dataIndex: "email" },
    { title: "Telefon", dataIndex: "phone" },
    { title: "Holati", dataIndex: "status" },
    {
      title: "Amallar",
      render: (row) => (
        <div className="flex gap-2">
          <Button onClick={() => openModal(row)}>✏️ Tahrirlash</Button>
          <Button
            onClick={() => {
              setSelected(row);
              setModalOpen(true);
            }}
            className="bg-red-500 text-white"
          >
            🗑️ O‘chirish
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
          <div className="relative">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Qidirish..."
              className="px-3 py-2 border rounded w-64"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white rounded px-2 py-1">
              🔍
            </button>
          </div>

          <button
            onClick={() => {
              setSelected(null);
              setForm({ first_name: "", last_name: "", email: "", phone: "" });
              setModalOpen(true);
            }}
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
            <option value="nofaol">Nofaol</option>
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
        title={selected ? "Tahrirlash/O‘chirish" : "Yangi student qo'shish"}
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
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSave} className="bg-blue-500 text-white">
              Saqlash
            </Button>
            {selected && (
              <Button onClick={handleDelete} className="bg-red-500 text-white">
                O‘chirish
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Studentlar;
