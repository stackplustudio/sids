"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { CalendarDays, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JadwalPelajaranPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    hari: "Senin",
    jam_mulai: "07:00",
    jam_selesai: "08:30"
  });

  const hariOptions = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const fetchAllData = async () => {
    try {
      const [schedRes, classRes, subjRes, teachRes] = await Promise.all([
        api.get("/schedules"),
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/teachers")
      ]);
      setSchedules(schedRes.data);
      setClasses(classRes.data);
      setSubjects(subjRes.data);
      setTeachers(teachRes.data);
    } catch (error) {
      toast.error("Gagal memuat data master.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.subjectId || !formData.teacherId) {
      toast.error("Kelas, Mapel, dan Guru harus diisi!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post("/schedules", formData);
      toast.success("Jadwal pelajaran berhasil ditambahkan!");
      fetchAllData(); // Refresh tabel
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data Jadwal…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Jadwal Pelajaran</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Susun roster pelajaran yang menghubungkan Kelas, Mapel, dan Guru.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Jadwal */}
        <div className="lg:col-span-1 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-brand-ink-dark mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Buat Jadwal
          </h3>
          <form onSubmit={handleAddSchedule} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Hari</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.hari} onChange={(e) => setFormData({ ...formData, hari: e.target.value })}>
                  {hariOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Kelas</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })}>
                  <option value="" disabled>-- Pilih --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.nama_kelas}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Mata Pelajaran</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}>
                <option value="" disabled>-- Pilih Mapel --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.nama_mapel}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Guru Pengajar</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}>
                <option value="" disabled>-- Pilih Guru --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Jam Mulai</label>
                <Input type="time" required value={formData.jam_mulai} onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-brand-ink-dark/60 mb-1 block">Jam Selesai</label>
                <Input type="time" required value={formData.jam_selesai} onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })} />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary mt-2">
              {isSubmitting ? "Menyimpan…" : "Simpan Jadwal"}
            </Button>
          </form>
        </div>

        {/* Tabel Data Jadwal */}
        <div className="lg:col-span-2 bg-brand-surface  border border-brand-line rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                  <th className="p-4 font-semibold">Kelas</th>
                  <th className="p-4 font-semibold">Mata Pelajaran</th>
                  <th className="p-4 font-semibold">Guru</th>
                  <th className="p-4 font-semibold text-center">Waktu</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-ink-dark/80 divide-y divide-brand-ink-dark/5">
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-brand-ink-dark/60">Belum ada jadwal yang dibuat.</td>
                  </tr>
                ) : (
                  schedules.map((sched) => (
                    <tr key={sched.id} className="hover:bg-brand-surface-alt transition-colors">
                      <td className="p-4 font-bold text-brand-primary">{sched.class?.nama_kelas}</td>
                      <td className="p-4 font-semibold text-brand-ink-dark">{sched.subject?.nama_mapel}</td>
                      <td className="p-4">{sched.teacher?.name}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center">
                          <span className="font-bold text-brand-ink-dark bg-brand-surface-alt px-2 py-0.5 rounded text-xs mb-1">{sched.hari}</span>
                          <span className="text-xs text-brand-ink-muted flex items-center gap-1"><Clock className="w-3 h-3"/> {sched.jam_mulai} - {sched.jam_selesai}</span>
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