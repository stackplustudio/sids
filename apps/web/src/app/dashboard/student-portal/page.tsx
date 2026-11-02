"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { GraduationCap, Calendar, BookOpen, FileText, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PortalSiswaPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk form pengumpulan tugas
  const [submissionForms, setSubmissionForms] = useState<Record<string, { jawaban: string; file_url: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/student-portal/dashboard");
      setData(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memuat portal siswa.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFormChange = (assignmentId: string, field: string, value: string) => {
    setSubmissionForms(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value
      }
    }));
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    const form = submissionForms[assignmentId];
    if (!form?.jawaban && !form?.file_url) {
      toast.error("Isi jawaban atau berikan link file tugas!");
      return;
    }

    setIsSubmitting(assignmentId);
    try {
      await api.post("/student-portal/submissions", {
        assignmentId,
        jawaban: form.jawaban || "",
        file_url: form.file_url || ""
      });
      toast.success("Tugas berhasil dikumpulkan!");
      fetchDashboardData(); // Refresh data untuk update status menjadi 'Sudah Kumpul'
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengumpulkan tugas.");
    } finally {
      setIsSubmitting(null);
    }
  };

  if (isLoading) return <div className="p-8">Memuat Portal Siswa…</div>;

  if (data?.hasClass === false) {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-brand-surface  rounded-xl border border-brand-line shadow-sm">
        <GraduationCap className="h-16 w-16 text-brand-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-ink-dark mb-2">Belum Terdaftar di Kelas</h2>
        <p className="text-brand-ink-muted">{data.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      
      {/* Header Profile Siswa */}
      <div className="bg-brand-primary rounded-xl p-8 text-brand-on-primary flex flex-col md:flex-row items-center justify-between shadow-lg ">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-brand-surface/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <GraduationCap className="h-10 w-10 text-brand-on-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{data.studentInfo.nama}</h1>
            <p className="text-primary-foreground/85 mt-1">NIS: {data.studentInfo.nis} | Kelas: <span className="font-bold">{data.classInfo.nama_kelas}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Jadwal Pelajaran */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-primary"/> Jadwal Pelajaran</h3>
            {data.schedules.length === 0 ? <p className="text-sm text-brand-ink-muted">Belum ada jadwal untuk kelas ini.</p> : (
              <div className="space-y-3">
                {data.schedules.map((sched: any) => (
                  <div key={sched.id} className="p-3 bg-brand-surface rounded-xl border border-brand-line flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-brand-ink-dark">{sched.subject.nama_mapel}</p>
                      <p className="text-xs text-brand-ink-muted">{sched.teacher.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-brand-primary bg-brand-primary-soft px-2 py-0.5 rounded">{sched.hari}</p>
                      <p className="text-xs text-brand-ink-muted mt-1">{sched.jam_mulai} - {sched.jam_selesai}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: Materi & Tugas (LMS) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section Materi */}
          <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4 text-info"/> Materi Belajar Terbaru</h3>
            {data.materials.length === 0 ? <p className="text-sm text-brand-ink-muted">Belum ada materi dibagikan.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.materials.map((m: any) => (
                  <div key={m.id} className="p-4 bg-info-soft rounded-xl border border-info/20">
                    <span className="text-xs font-bold text-info bg-info-soft px-2 py-0.5 rounded mb-2 inline-block">{m.subject.nama_mapel}</span>
                    <p className="font-semibold text-sm text-brand-ink-dark mb-2">{m.judul}</p>
                    {m.file_url && <a href={m.file_url} target="_blank" className="text-xs text-brand-primary hover:underline font-medium">Buka Lampiran ↗</a>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Tugas */}
          <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-warning"/> Daftar Tugas</h3>
            {data.assignments.length === 0 ? <p className="text-sm text-brand-ink-muted">Tidak ada tugas saat ini.</p> : (
              <div className="space-y-4">
                {data.assignments.map((a: any) => {
                  const isSubmitted = a.submissions && a.submissions.length > 0;
                  return (
                    <div key={a.id} className={`p-4 rounded-xl border ${isSubmitted ? 'bg-success-soft border-success/30' : 'bg-brand-surface border-brand-line shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-warning bg-warning-soft px-2 py-0.5 rounded inline-block mb-1">{a.subject.nama_mapel}</span>
                          <h4 className="font-bold text-brand-ink-dark">{a.judul}</h4>
                        </div>
                        {isSubmitted ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-success bg-success-soft px-2 py-1 rounded"><CheckCircle2 className="h-3 w-3"/> Sudah Kumpul</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-danger bg-danger-soft px-2 py-1 rounded"><Clock className="h-3 w-3"/> DL: {new Date(a.tenggat_waktu).toLocaleDateString()}</span>
                        )}
                      </div>
                      <p className="text-xs text-brand-ink mb-4 whitespace-pre-wrap">{a.deskripsi}</p>
                      
                      {/* Form Pengumpulan Jika Belum Mengumpulkan */}
                      {!isSubmitted && (
                        <div className="mt-4 pt-4 border-t border-brand-line">
                          <p className="text-xs font-bold text-brand-ink-dark mb-2">Kumpulkan Tugas:</p>
                          <div className="space-y-2 mb-3">
                            <textarea 
                              placeholder="Tuliskan jawaban di sini…"
                              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1"
                              value={submissionForms[a.id]?.jawaban || ""}
                              onChange={(e) => handleFormChange(a.id, "jawaban", e.target.value)}
                            />
                            <Input 
                              placeholder="Atau lampirkan link Google Drive / Dokumen" 
                              className="text-xs h-8"
                              value={submissionForms[a.id]?.file_url || ""}
                              onChange={(e) => handleFormChange(a.id, "file_url", e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={() => handleSubmitAssignment(a.id)}
                            disabled={isSubmitting === a.id}
                            className="bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary h-8 text-xs px-4"
                          >
                            {isSubmitting === a.id ? "Mengirim…" : "Kirim Jawaban"}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}