"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { FileText, CheckCircle, XCircle, Clock, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LeaveRequestsPage() {
  const [role, setRole] = useState<string>("SISWA");
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State (Khusus Siswa)
  const [students, setStudents] = useState<any[]>([]); // Untuk simulasi pilih nama siswa
  const [formData, setFormData] = useState({ studentId: "", tanggal: "", jenis: "SAKIT", lampiran: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setRole(JSON.parse(user).role);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Ambil daftar pengajuan
      const res = await api.get("/leave-requests");
      setRequests(res.data);

      // Jika siswa, ambil daftar siswa untuk dropdown (simulasi karena belum ada auth spesifik siswa di frontend)
      const resStudents = await api.get("/students"); // Pastikan rute ini ada di controller students Anda
      setStudents(resStudents.data);
      if (resStudents.data.length > 0) {
        setFormData(prev => ({ ...prev, studentId: resStudents.data[0].id }));
      }
    } catch (error) {
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/leave-requests", formData);
      toast.success("Pengajuan berhasil dikirim!");
      setFormData({ ...formData, tanggal: "", lampiran: "" });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: string, status: string) => {
    try {
      await api.put(`/leave-requests/${id}/status`, { status });
      toast.success(`Pengajuan ${status.toLowerCase()}!`);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MENUNGGU": return <span className="px-3 py-1 bg-warning-soft text-warning rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Menunggu</span>;
      case "DISETUJUI": return <span className="px-3 py-1 bg-success-soft text-success rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Disetujui</span>;
      case "DITOLAK": return <span className="px-3 py-1 bg-danger-soft text-danger-dark rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Ditolak</span>;
      default: return null;
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      
      <div className="flex items-center gap-3 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Perizinan & Cuti</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">
            {role === "SISWA" ? "Ajukan surat sakit atau izin tidak masuk sekolah di sini." : "Kelola persetujuan pengajuan izin dan sakit siswa."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Pengajuan (Tampil Jika Siswa) */}
        {role === "SISWA" && (
          <div className="lg:col-span-1 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm h-fit">
            <h3 className="font-bold text-brand-ink-dark mb-4">Buat Pengajuan Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-brand-ink-muted mb-1 block">Pilih Nama Anda</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                >
                  {students.map(s => <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-ink-muted mb-1 block">Jenis Pengajuan</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                >
                  <option value="SAKIT">Sakit (Butuh Surat Dokter)</option>
                  <option value="IZIN">Izin (Keperluan Keluarga)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-ink-muted mb-1 block">Tanggal Izin</label>
                <Input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-ink-muted mb-1 block">Tautan Lampiran (Gdrive / Gambar)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-brand-line-strong bg-brand-surface text-brand-ink-muted sm:text-sm"><Upload className="w-4 h-4" /></span>
                  <Input type="url" placeholder="https://..." required className="rounded-l-none" value={formData.lampiran} onChange={(e) => setFormData({...formData, lampiran: e.target.value})} />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary gap-2 mt-4">
                <Send className="w-4 h-4" /> {isSubmitting ? "Mengirim…" : "Kirim Pengajuan"}
              </Button>
            </form>
          </div>
        )}

        {/* Kolom Kanan: Tabel Riwayat / Persetujuan */}
        <div className={`bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm ${role === "SISWA" ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h3 className="font-bold text-brand-ink-dark mb-4">
            {role === "SISWA" ? "Riwayat Pengajuan Anda" : "Daftar Tunggu Persetujuan"}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-line bg-brand-surface text-brand-ink text-xs ">
                  <th className="p-4 font-semibold">Tanggal</th>
                  {role !== "SISWA" && <th className="p-4 font-semibold">Nama Siswa</th>}
                  <th className="p-4 font-semibold">Jenis</th>
                  <th className="p-4 font-semibold">Lampiran</th>
                  <th className="p-4 font-semibold">Status</th>
                  {role !== "SISWA" && <th className="p-4 font-semibold text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line text-sm">
                {requests.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-brand-ink-muted">Belum ada data pengajuan.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-brand-surface-alt/70">
                      <td className="p-4 font-medium text-brand-ink">{new Date(req.tanggal).toLocaleDateString('id-ID')}</td>
                      
                      {role !== "SISWA" && (
                        <td className="p-4">
                          <p className="font-bold text-brand-ink-dark">{req.student?.nama}</p>
                          <p className="text-xs text-brand-ink-muted">NIS: {req.student?.nis}</p>
                        </td>
                      )}
                      
                      <td className="p-4">
                        <span className="font-bold text-brand-ink">{req.jenis}</span>
                      </td>
                      <td className="p-4">
                        <a href={req.lampiran} target="_blank" rel="noreferrer" className="text-brand-primary hover:underline text-xs font-medium">Lihat Dokumen</a>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(req.status_approval)}
                      </td>
                      
                      {role !== "SISWA" && (
                        <td className="p-4 text-right">
                          {req.status_approval === "MENUNGGU" ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAction(req.id, 'DISETUJUI')} className="p-2 bg-success-soft text-success rounded-lg hover:bg-success-soft transition-colors" title="Setujui"><CheckCircle className="w-5 h-5"/></button>
                              <button onClick={() => handleAction(req.id, 'DITOLAK')} className="p-2 bg-danger-soft text-danger-dark rounded-lg hover:bg-danger-soft transition-colors" title="Tolak"><XCircle className="w-5 h-5"/></button>
                            </div>
                          ) : (
                            <span className="text-xs text-brand-ink-muted italic">Selesai</span>
                          )}
                        </td>
                      )}
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