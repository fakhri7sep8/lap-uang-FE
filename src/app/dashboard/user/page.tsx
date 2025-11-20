"use client";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Check, UploadCloud, Eye, EyeOff } from "lucide-react";

export default function UserProfile() {
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [editingPassword, setEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async () => {
    // contoh simulasi penyimpanan
    setSaved(true);
    // lakukan panggilan API di sini jika perlu
    setTimeout(() => setSaved(false), 1600);
  };

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPhoto(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-h-screen flex justify-center py-22">
      <Card className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Edit Profile</h1>

            <motion.button
              onClick={handleSave}
              className="relative bg-emerald-500 text-white rounded-3xl shadow shadow-emerald-600 px-5 py-2 font-medium flex items-center gap-3 overflow-hidden"
              whileTap={{ scale: 0.96 }}
              aria-label="Simpan perubahan"
            >
              <AnimatePresence initial={false} mode="wait">
                {saved ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, y: -6, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" size={28} strokeWidth={3} />
                    <span>Tersimpan</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="label"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-2"
                  >
                    <span>Simpan</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo column */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-36 h-36 rounded-full overflow-hidden shadow-md bg-white flex items-center justify-center">
                {photo ? (
                  // image preview
                  <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-sm text-gray-400">No Photo</div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <Button
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span className="text-sm">Ubah Foto</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPhoto(null)}
                  className="rounded-full"
                >
                  Hapus
                </Button>
              </div>
            </div>

            {/* Form column */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-medium text-sm">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium text-sm">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@contoh.com"
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="font-medium text-sm">Password</label>
                  <div className="flex gap-3 items-center">
                    <div className="relative w-full">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!editingPassword}
                        placeholder={editingPassword ? "Masukkan password baru" : "********"}
                        className="rounded-lg pr-10"
                      />
                          
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                            <motion.span
                            key={showPassword ? "eye-off" : "eye"}
                            initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                            animate={{ rotate: 360, scale: 1, opacity: 1 }}
                            exit={{ rotate: 0, scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.span>
                      
                        </button>
                          
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        Swal.fire({
                          title: "Ganti Password",
                          text: "Check Gmail untuk ganti password.",
                          imageUrl: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
                          imageAlt: "Gmail Icon",
                          imageWidth: 48,
                          imageHeight: 48,
                          confirmButtonText: "OK",
                        });
                      }}
                      
                    >
                      Change
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Klik &quot;Change&quot; untuk mengubah password.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
