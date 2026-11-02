"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Users, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PenempatanSiswaPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [classDetails, setClassDetails] = useState<any>(null);
  const [unenrolledStudents, setUnenrolledStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil daftar semua kelas untuk dropdown
  const fetchClassesAndUnenrolled = async () => {
    try {
      const [classRes, unenrolledRes] = await Promise.all([
        api.get("/classes"),
        api.get("/enrollments/unenrolled")
      ]);
      setClasses(classRes.data);
      setUnenrolledStudents(unenrolledRes.data);
      
      // Pilih kelas pertama secara otomatis jika ada
      if (classRes.data.length > 0 && !selectedClassId) {
        setSelectedClassId(classRes.data[0].id);
      }
    } catch (error) {
      toast.error("Gagal mengambil data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndUnenrolled();
  }, []);

  // 2. Ambil detail kelas yang sedang dipilih (termasuk siswanya)
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!selectedClassId) return;
      try {
        const res = await api.get(`/enrollments/class/${selectedClassId}`);
        setClassDetails(res.data);
      } catch (error) {
        toast.error("Gagal mengambil detail kelas.");
      }
    };
    fetchClassDetails();
  }, [selectedClassId]);

  // 3. Fungsi untuk memasukkan siswa ke kelas
  const handleEnroll = async (studentId: string) => {
    if (!selectedClassId) {
      toast.error("Pilih kelas terlebih dahulu!");
      return;
    }
    
    try {
      await api.post("/enrollments", { classId: selectedClassId, studentId });
      toast.success("Siswa berhasil dimasukkan ke kelas!");
      
      // Refresh kedua data (siswa yang belum punya kelas & detail kelas saat ini)
      const [unenrolledRes, classRes] = await Promise.all([
        api.get("/enrollments/unenrolled"),
        api.get(`/enrollments/class/${selectedClassId}`)
      ]);
      setUnenrolledStudents(unenrolledRes.data);
      setClassDetails(classRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memasukkan siswa.");
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data Penempatan…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Penempatan Siswa</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Masukkan siswa yang belum memiliki kelas ke dalam rombongan belajar.</p>
        </div>
      </div>

      {/* Header Pemilihan Kelas */}
      <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-brand-ink-dark/60 mb-2 block">Pilih Kelas Tujuan</label>
          <select 
            className="flex h-10 w-full md:w-96 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.nama_kelas}</option>
            ))}
          </select>
        </div>
        {classDetails && (
          <div className="flex gap-6 bg-brand-primary/5 px-6 py-3 rounded-xl border border-brand-primary/10">
            <div>
              <p className="text-xs text-brand-ink-muted">Wali Kelas</p>
              <p className="font-semibold text-brand-ink-dark">{classDetails.waliKelas?.name}</p>
            </div>
            <div>
              <p className="text-xs text-brand-ink-muted">Jumlah Siswa</p>
              <p className="font-semibold text-brand-ink-dark">{classDetails.enrollments?.length || 0} Anak</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* KOLOM KIRI: Siswa di Kelas Terpilih */}
        <div className="bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-ink-dark/10 bg-brand-surface-alt">
            <h3 className="font-bold text-brand-ink-dark flex items-center gap-2">
              <Users className="h-4 w-4" /> Daftar Siswa di Kelas Ini
            </h3>
          </div>
          <div className="p-4 flex-1 max-h-[500px] overflow-y-auto">
            {classDetails?.enrollments?.length === 0 ? (
              <p className="text-center text-brand-ink-muted text-sm mt-8">Kelas ini masih kosong.</p>
            ) : (
              <ul className="space-y-3">
                {classDetails?.enrollments?.map((enrollment: any, index: number) => (
                  <li key={enrollment.id} className="flex items-center gap-4 p-3 bg-brand-surface rounded-xl border border-brand-line">
                    <span className="text-brand-ink-muted font-semibold w-6 text-center">{index + 1}</span>
                    <div>
                      <p className="font-bold text-brand-ink-dark">{enrollment.student.nama}</p>
                      <p className="text-xs text-brand-ink-muted">NIS: {enrollment.student.nis}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: Siswa Belum Punya Kelas */}
        <div className="bg-brand-primary-soft  border border-brand-primary-soft rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-primary-soft bg-brand-primary-soft">
            <h3 className="font-bold text-brand-primary flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Siswa Belum Mendapat Kelas ({unenrolledStudents.length})
            </h3>
          </div>
          <div className="p-4 flex-1 max-h-[500px] overflow-y-auto">
            {unenrolledStudents.length === 0 ? (
              <p className="text-center text-brand-ink-muted text-sm mt-8">Semua siswa sudah masuk ke kelas.</p>
            ) : (
              <ul className="space-y-3">
                {unenrolledStudents.map((student) => (
                  <li key={student.id} className="flex items-center justify-between p-3 bg-brand-surface rounded-xl border border-brand-primary-soft shadow-sm">
                    <div>
                      <p className="font-bold text-brand-ink-dark">{student.nama}</p>
                      <p className="text-xs text-brand-ink-muted">NIS: {student.nis}</p>
                    </div>
                    {/* 🔥 Menggunakan Button Primary sesuai ui.md */}
                    <Button 
                      onClick={() => handleEnroll(student.id)}
                      className="bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary h-8 px-3 text-xs flex items-center gap-1"
                    >
                      Masukkan <ArrowRight className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}