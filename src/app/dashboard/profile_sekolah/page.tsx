"use client";

import { useState } from "react";

export default function SchoolProfile() {
  // Dummy school data
  const [school, setSchool] = useState({
    id: "SCH-001",
    name: "SMK Madinatul Qur'an",
    Nip: "1987654321",
    email: "admin@smkmq.sch.id",
    foundation: "Yayasan Madinatul Qur'an",
    address: "Jl. Pendidikan No. 45, Bogor",
    phone: "0812-3456-7890",
    headmaster: "Ust. Ahmad Fauzan",
    academicYear: "2024/2025",
  });

  // Handler untuk input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSchool((prev) => ({ ...prev, [name]: value }));
  };

  // Use full external URLs as safe defaults so Next/Image / runtime won't break in sandbox
  const DEFAULT_BANNER = "https://via.placeholder.com/1200x300.png?text=School+Banner";
  const DEFAULT_AVATAR = "https://via.placeholder.com/150.png?text=Avatar";

  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]; 

  // Helper to safely get file from input event
  const getFileFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e || !e.target || !e.target.files) return null;
    return e.target.files[0] || null;
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFileFromEvent(e);
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Format tidak didukung! Gunakan JPG atau PNG.");
      return;
    }

    setLoadingBanner(true);

    // createObjectURL is fine in client components
    const imgURL = URL.createObjectURL(file);

    // small delay to mimic upload, then set preview
    setTimeout(() => {
      setBanner(imgURL);
      setLoadingBanner(false);
    }, 600);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFileFromEvent(e);
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Format tidak didukung! Gunakan JPG atau PNG.");
      return;
    }

    setLoadingAvatar(true);
    const imgURL = URL.createObjectURL(file);

    setTimeout(() => {
      setAvatar(imgURL);
      setLoadingAvatar(false);
    }, 600);
  };

  const deleteAvatar = () => setAvatar(DEFAULT_AVATAR);
  const resetBanner = () => setBanner(DEFAULT_BANNER);

  return (
    <div className="w-full min-h-screen flex-col bg-gradient-to-br justify-center">
        <p className="text-3xl font-semibold mb-4 mt-2">Profile Sekolah</p>
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200 relative">

        {/* Banner */}
        <div className="relative w-full h-56 bg-gradient-to-r from-indigo-200/60 to-indigo-100/60 flex items-center justify-center">
          <img
            src={banner}
            alt="banner"
            className="w-full h-full object-cover border-b border-indigo-100 shadow"
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onError={(e) => { e.currentTarget.src = DEFAULT_BANNER; }}
          />
          <div className="absolute top-4 right-6 flex gap-2 z-10">
            <label className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 text-sm shadow-md transition-all duration-200 active:scale-95">
              {loadingBanner ? "Mengunggah..." : "Ganti Banner"}
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
            </label>
            <button
              className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm shadow hover:bg-gray-200 transition-all duration-200 active:scale-95 border border-gray-200"
              onClick={resetBanner}
            >
              <span className="material-icons text-base">refresh</span>
              Reset
            </button>
          </div>
        </div>
        {/* Avatar dan Nama Sekolah Overlap dengan Banner */}
        <div className="flex flex-col items-center w-full" style={{ marginTop: '-4.5rem' }}>
          <div className="relative w-32 h-32 z-20 flex flex-col items-center">
            <img
              src={avatar}
              alt="avatar"
              width={128}
              height={128}
              className="rounded-full border-4 mb-2 border-white shadow-lg object-cover w-32 h-32 mx-auto"
              onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
            />
            <div className="flex flex-row gap-3 justify-center w-max mt-1">
              <label className="flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg cursor-pointer hover:bg-indigo-700 shadow-md transition-all duration-200 active:scale-95">
                {loadingAvatar ? "Mengunggah..." : "Unggah Foto"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <button
                onClick={deleteAvatar}
                className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-700 shadow-md transition-all duration-200 active:scale-95"
              >
                <span className="material-icons text-sm">Hapus</span>
              </button>
            </div>
          </div>
          <div className="mt-14 text-center">
            <h1 className="text-3xl font-bold">
              {school.name}
            </h1>
            <p className="text-gray-500 font-medium">ID: {school.id}</p>
          </div>
        </div>

        {/* Profile content */}
        <div className="px-8 pb-8 mt-8">

          {/* Info Section */}
          <form className="mt-10 bg-indigo-50/40 rounded-xl shadow-inner px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="Nip" className="text-gray-500 text-sm font-medium">NIP Kepala Sekolah</label>
              <input
                type="text"
                id="Nip"
                name="Nip"
                value={school.Nip}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="headmaster" className="text-gray-500 text-sm font-medium">Nama Kepala Sekolah</label>
              <input
                type="text"
                id="headmaster"
                name="headmaster"
                value={school.headmaster}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-500 text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={school.email}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="foundation" className="text-gray-500 text-sm font-medium">Yayasan</label>
              <input
                type="text"
                id="foundation"
                name="foundation"
                value={school.foundation}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="address" className="text-gray-500 text-sm font-medium">Alamat</label>
              <textarea
                id="address"
                name="address"
                value={school.address}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow min-h-[48px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-gray-500 text-sm font-medium">Telepon</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={school.phone}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="academicYear" className="text-gray-500 text-sm font-medium">Tahun Ajaran</label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={school.academicYear}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold bg-white focus:ring-2 focus:ring-indigo-300 outline-none shadow"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
