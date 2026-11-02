"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MasterDataMapelPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ nama_mapel: "" });

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data mata pelajaran.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_mapel.trim()) {
      toast.error("Nama mata pelajaran tidak boleh kosong!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post("/subjects", formData);
      toast.success("Mata pelajaran berhasil ditambahkan!");
      setFormData({ nama_mapel: "" }); // Reset form
      fetchSubjects(); // Refresh tabel
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menambahkan mata pelajaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data Mata Pelajaran…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-info-soft rounded-xl text-info">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Master Data Mata Pelajaran</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Kelola daftar kurikulum dan mata pelajaran sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Mapel */}
        <div className="lg:col-span-1 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Tambah Mata Pelajaran
          </h3>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Nama Mata Pelajaran</label>
              <Input 
                required 
                placeholder="Misal: Matematika Wajib" 
                value={formData.nama_mapel} 
                onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })} 
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-info hover:bg-info text-brand-on-primary border-0">
              {isSubmitting ? "Menyimpan…" : "Simpan Mata Pelajaran"}
            </Button>
          </form>
        </div>

        {/* Tabel Data Mapel */}
        <div className="lg:col-span-2 bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                  <th className="p-4 font-semibold w-16 text-center">No</th>
                  <th className="p-4 font-semibold">Mata Pelajaran</th>
                  <th className="p-4 font-semibold">ID Sistem</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-ink-dark/80 divide-y divide-brand-ink-dark/5">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-brand-ink-dark/60">Belum ada data mata pelajaran.</td>
                  </tr>
                ) : (
                  subjects.map((subject, index) => (
                    <tr key={subject.id} className="hover:bg-brand-surface-alt transition-colors">
                      <td className="p-4 text-center font-semibold text-brand-ink-dark/50">{index + 1}</td>
                      <td className="p-4 font-bold text-brand-ink-dark">{subject.nama_mapel}</td>
                      <td className="p-4 text-xs font-mono text-brand-ink-muted">{subject.id}</td>
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