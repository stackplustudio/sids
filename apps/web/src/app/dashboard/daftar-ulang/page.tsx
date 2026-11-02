"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { UserPlus, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DaftarUlangPage() {
  const [acceptedApplicants, setAcceptedApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAccountInfo, setNewAccountInfo] = useState<any | null>(null);

  const fetchAccepted = async () => {
    try {
      const res = await api.get("/ppdb");
      // Hanya tampilkan pendaftar yang statusnya DITERIMA
      const filtered = res.data.filter((app: any) => app.status_kelulusan === "DITERIMA");
      setAcceptedApplicants(filtered);
    } catch (error) {
      toast.error("Gagal mengambil data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccepted();
  }, []);

  const handleGenerateAccount = async (id: string) => {
    try {
      const res = await api.post(`/ppdb/${id}/generate-account`);
      toast.success("Akun berhasil dibuat!");
      setNewAccountInfo(res.data); // Simpan kredensial untuk ditampilkan di modal/layar
      fetchAccepted(); // Refresh tabel agar tombol berubah menjadi 'Sudah Dibuat'
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat akun");
    }
  };

  // Fungsi copy ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

  if (isLoading) return <div className="p-8">Memuat data daftar ulang…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-success-soft rounded-xl text-success">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Daftar Ulang & Generate Akun</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Konversi pendaftar yang DITERIMA menjadi akun Siswa aktif.</p>
        </div>
      </div>

      {/* Jika ada akun baru di-generate, tampilkan notifikasi kredensialnya agar Admin bisa copy */}
      {newAccountInfo && (
        <div className="mb-8 p-6 bg-success-soft border border-success/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
            <div>
              <h3 className="font-bold text-success">Akun Siswa Berhasil Dibuat!</h3>
              <p className="text-sm text-success">NIS: <span className="font-bold">{newAccountInfo.nis}</span></p>
            </div>
          </div>
          <div className="bg-brand-surface p-4 rounded-xl shadow-sm border border-success/20 flex-1 w-full md:w-auto">
            <div className="flex justify-between items-center border-b border-brand-line pb-2 mb-2">
              <span className="text-xs text-brand-ink-muted">Email Login</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{newAccountInfo.email}</span>
                <button onClick={() => copyToClipboard(newAccountInfo.email)} className="text-brand-primary hover:bg-brand-primary-soft p-1 rounded"><Copy className="h-4 w-4"/></button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-ink-muted">Password Default</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{newAccountInfo.password}</span>
                <button onClick={() => copyToClipboard(newAccountInfo.password)} className="text-brand-primary hover:bg-brand-primary-soft p-1 rounded"><Copy className="h-4 w-4"/></button>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setNewAccountInfo(null)} className="h-10">Tutup</Button>
        </div>
      )}

      <div className="bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                <th className="p-4 font-semibold">No. Pendaftaran</th>
                <th className="p-4 font-semibold">Nama Siswa</th>
                <th className="p-4 font-semibold">NISN</th>
                <th className="p-4 font-semibold text-center">Status Akun</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-brand-ink-dark/80 divide-y divide-brand-ink-dark/5">
              {acceptedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-ink-dark/60">Belum ada siswa yang dinyatakan DITERIMA.</td>
                </tr>
              ) : (
                acceptedApplicants.map((app) => {
                  const isAccountGenerated = !!app.student; // Mengecek apakah relasi student sudah ada (tidak null)
                  return (
                    <tr key={app.id} className="hover:bg-brand-surface-alt transition-colors">
                      <td className="p-4 font-bold text-brand-primary">{app.nomor_pendaftaran}</td>
                      <td className="p-4 font-semibold text-brand-ink-dark">{app.data_diri?.nama || "-"}</td>
                      <td className="p-4">{app.data_diri?.nisn || "-"}</td>
                      <td className="p-4 text-center">
                        {isAccountGenerated 
                          ? <span className="text-success font-semibold bg-success-soft px-2 py-1 rounded-md text-xs">SUDAH AKTIF</span>
                          : <span className="text-warning font-semibold bg-warning-soft px-2 py-1 rounded-md text-xs">MENUNGGU KONVERSI</span>
                        }
                      </td>
                      <td className="p-4 flex justify-center">
                        <Button 
                          onClick={() => handleGenerateAccount(app.id)}
                          disabled={isAccountGenerated}
                          className={`h-9 px-4 text-xs text-brand-on-primary rounded-lg transition-colors ${
                            isAccountGenerated ? "bg-brand-line-strong cursor-not-allowed" : "bg-brand-primary hover:bg-brand-primary-dark"
                          }`}
                        >
                          {isAccountGenerated ? "Akun Selesai" : "Generate Akun Siswa"}
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}