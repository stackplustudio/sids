"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MasterDataSiswaPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data siswa.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fitur pencarian sederhana
  const filteredStudents = students.filter(
    (student) =>
      student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nis.includes(searchQuery)
  );

  if (isLoading) return <div className="p-8">Memuat Master Data Siswa…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-ink-dark">Master Data Siswa</h1>
            <p className="text-brand-ink-dark/60 text-sm mt-1">Daftar seluruh siswa aktif yang terdaftar di sistem.</p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-ink-muted" />
          <Input 
            placeholder="Cari nama atau NIS…"
            className="pl-10 bg-brand-surface-alt border-brand-line"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                <th className="p-4 font-semibold">NIS</th>
                <th className="p-4 font-semibold">Nama Lengkap</th>
                <th className="p-4 font-semibold">NISN</th>
                <th className="p-4 font-semibold">Email Login</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-brand-ink-dark/80 divide-y divide-brand-ink-dark/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-ink-dark/60">Data siswa tidak ditemukan.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-brand-surface-alt transition-colors">
                    <td className="p-4 font-bold text-brand-primary">{student.nis}</td>
                    <td className="p-4 font-semibold text-brand-ink-dark">{student.nama}</td>
                    <td className="p-4">{student.nisn || "-"}</td>
                    <td className="p-4 text-brand-ink-muted">{student.user?.email}</td>
                    <td className="p-4">
                      <span className="bg-success-soft text-success px-2 py-1 rounded-md text-xs font-bold">AKTIF</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}