"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Library, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManajemenKelasPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ nama_kelas: "", waliKelasId: "" });

  const fetchData = async () => {
    try {
      // Mengambil data Kelas dan Guru secara bersamaan (Parallel)
      const [classRes, teacherRes] = await Promise.all([
        api.get("/classes"),
        api.get("/teachers")
      ]);
      setClasses(classRes.data);
      setTeachers(teacherRes.data);
    } catch (error) {
      toast.error("Gagal mengambil data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.waliKelasId) {
      toast.error("Silakan pilih Wali Kelas terlebih dahulu!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post("/classes", formData);
      toast.success("Kelas berhasil dibuat!");
      setFormData({ nama_kelas: "", waliKelasId: "" }); // Reset form
      fetchData(); // Refresh tabel kelas
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat kelas");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data Kelas…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-warning-soft rounded-xl text-warning">
          <Library className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Manajemen Kelas</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Kelola rombongan belajar dan tetapkan Wali Kelas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Kelas */}
        <div className="lg:col-span-1 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Buat Kelas Baru
          </h3>
          <form onSubmit={handleAddClass} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Nama Kelas</label>
              <Input 
                required 
                placeholder="Misal: 10 IPA 1" 
                value={formData.nama_kelas} 
                onChange={(e) => setFormData({ ...formData, nama_kelas: e.target.value })} 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Pilih Wali Kelas</label>
              <select 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.waliKelasId}
                onChange={(e) => setFormData({ ...formData, waliKelasId: e.target.value })}
              >
                <option value="" disabled>-- Pilih Guru --</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary">
              {isSubmitting ? "Menyimpan…" : "Simpan Kelas"}
            </Button>
          </form>
        </div>

        {/* Tabel Data Kelas */}
        <div className="lg:col-span-2 bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                  <th className="p-4 font-semibold">Nama Kelas</th>
                  <th className="p-4 font-semibold">Wali Kelas</th>
                  <th className="p-4 font-semibold text-center">Tahun Ajaran</th>
                  <th className="p-4 font-semibold text-center">Jml Siswa</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-ink-dark/80 divide-y divide-brand-ink-dark/5">
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-brand-ink-dark/60">Belum ada data kelas yang dibuat.</td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-brand-surface-alt transition-colors">
                      <td className="p-4 font-bold text-brand-primary">{cls.nama_kelas}</td>
                      <td className="p-4 font-semibold text-brand-ink-dark">{cls.waliKelas?.name}</td>
                      <td className="p-4 text-center">
                        <span className="bg-brand-surface-alt text-brand-ink px-2 py-1 rounded-md text-xs">
                          {cls.academicYear?.tahun_ajaran} ({cls.academicYear?.semester})
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-brand-ink font-semibold">
                          <Users className="h-4 w-4" /> {cls._count.enrollments}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}