"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Briefcase, Plus, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MasterDataGuruPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAccount, setNewAccount] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" });

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data guru.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewAccount(null);

    try {
      const res = await api.post("/teachers", formData);
      toast.success("Akun Guru berhasil dibuat!");
      setNewAccount(res.data);
      setFormData({ name: "", email: "" }); // Reset form
      fetchTeachers(); // Refresh tabel
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menambahkan guru");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin!");
  };

  if (isLoading) return <div className="p-8">Memuat Master Data Guru…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary-soft rounded-xl text-brand-primary">
          <Briefcase className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Master Data Guru</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Kelola data tenaga pendidik dan akun login mereka.</p>
        </div>
      </div>

      {/* Area Notifikasi Akun Baru */}
      {newAccount && (
        <div className="p-6 bg-success-soft border border-success/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <h3 className="font-bold text-success">Akun Berhasil Dibuat</h3>
              <p className="text-sm text-success">Berikan kredensial ini kepada guru yang bersangkutan.</p>
            </div>
          </div>
          <div className="bg-brand-surface p-3 rounded-xl shadow-sm border border-success/20 flex gap-4 text-sm">
            <div><span className="text-brand-ink-muted text-xs block">Email</span><span className="font-semibold">{newAccount.user.email}</span></div>
            <div><span className="text-brand-ink-muted text-xs block">Password</span><span className="font-semibold">{newAccount.defaultPassword}</span></div>
            <button onClick={() => copyToClipboard(`Email: ${newAccount.user.email} | Password: ${newAccount.defaultPassword}`)} className="text-brand-primary hover:bg-brand-primary-soft p-2 rounded"><Copy className="h-4 w-4"/></button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Guru */}
        <div className="lg:col-span-1 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Tambah Guru Baru
          </h3>
          <form onSubmit={handleAddTeacher} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Nama Lengkap & Gelar</label>
              <Input required placeholder="Misal: Budi Cahyono, S.Kom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Email Akun</label>
              <Input required type="email" placeholder="budi@guru.stackplustudio.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary">
              {isSubmitting ? "Memproses…" : "Buat Akun Guru"}
            </Button>
          </form>
        </div>

        {/* Tabel Data Guru */}
        <div className="lg:col-span-2 bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                  <th className="p-4 font-semibold">Nama Guru</th>
                  <th className="p-4 font-semibold">Email Login</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-ink-dark/80 divide-y divide-brand-ink-dark/5">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-brand-ink-dark/60">Belum ada data guru.</td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-brand-surface-alt transition-colors">
                      <td className="p-4 font-semibold text-brand-ink-dark">{teacher.name}</td>
                      <td className="p-4 text-brand-ink-muted">{teacher.email}</td>
                      <td className="p-4 text-center">
                        <span className="bg-brand-primary-soft text-brand-primary-dark px-2 py-1 rounded-md text-xs font-bold">AKTIF</span>
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