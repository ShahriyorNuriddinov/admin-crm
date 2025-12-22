import React, { useEffect, useState } from "react";
import AuthService from "../../service/auth";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // Password form
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await AuthService.getProfile();
        // API may return data under different keys; try to use common shapes
        const data =
          res?.data || res?.data?.data || res?.data?.user || res || {};
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await AuthService.editProfile(profile);
      toast.success("Profil yangilandi");
    } catch (err) {
      console.error(err);
      toast.error("Profilni yangilashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0] || null);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return toast.warn("Avval rasim tanlang");
    try {
      const formData = new FormData();
      formData.append("image", avatarFile);
      setLoading(true);
      await AuthService.editProfileImg(formData);
      toast.success("Rasim yuklandi");
    } catch (err) {
      console.error(err);
      toast.error("Rasim yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  const handleSavePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error("Yangi parol va tasdiqlash mos emas");
    }
    try {
      setLoading(true);
      await AuthService.editPassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      toast.success("Parol muvaffaqiyatli o‘zgartirildi");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Parolni o‘zgartirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Asosiy ma'lumot</h2>
          <input
            name="first_name"
            value={profile.first_name || ""}
            onChange={handleProfileChange}
            placeholder="Ism"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            name="last_name"
            value={profile.last_name || ""}
            onChange={handleProfileChange}
            placeholder="Familiya"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            name="email"
            value={profile.email || ""}
            onChange={handleProfileChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Saqlash
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Rasm yuklash</h2>
          <input type="file" onChange={handleAvatarChange} className="mb-2" />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleUploadAvatar}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Yuklash
            </button>
          </div>

          <hr className="my-4" />

          <h2 className="font-semibold mb-2">Parolni o‘zgartirish</h2>
          <input
            name="current_password"
            type="password"
            value={passwords.current_password}
            onChange={handlePasswordChange}
            placeholder="Hozirgi parol"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            name="new_password"
            type="password"
            value={passwords.new_password}
            onChange={handlePasswordChange}
            placeholder="Yangi parol"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            name="confirm_password"
            type="password"
            value={passwords.confirm_password}
            onChange={handlePasswordChange}
            placeholder="Tasdiqlash"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSavePassword}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Parolni yangilash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
