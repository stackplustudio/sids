"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { BookMarked, Save, Plus, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PenilaianRaporPage() {
  const [activeTab, setActiveTab] = useState<"INPUT" | "RAPOR">("INPUT");
  
  // Data Master
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [components, setComponents] = useState<any[]>([]);
  
  // State Input Nilai
  const [selectedClassMapel, setSelectedClassMapel] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [gradesState, setGradesState] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Komponen Baru
  const [newComponent, setNewComponent] = useState({ nama: "", bobot_persen: "" });

  // State Rapor
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [classRes, compRes] = await Promise.all([
        api.get("/lms/classes"),
        api.get("/grades/components")
      ]);
      setMyClasses(classRes.data);
      setComponents(compRes.data);
      
      if (classRes.data.length > 0) setSelectedClassMapel(classRes.data[0].id);
      if (compRes.data.length > 0) setSelectedComponent(compRes.data[0].id);
    } catch (error) {
      toast.error("Gagal memuat data master.");
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/grades/components", newComponent);
      toast.success("Komponen nilai berhasil ditambahkan!");
      setNewComponent({ nama: "", bobot_persen: "" });
      fetchMasterData(); // Refresh komponen
    } catch (error) {
      toast.error("Gagal membuat komponen nilai.");
    }
  };

  // Efek untuk memuat daftar siswa dan nilai mereka saat dropdown berubah
  useEffect(() => {
    if (activeTab === "INPUT" && selectedClassMapel && selectedComponent) {
      const fetchStudents = async () => {
        const [classId, subjectId] = selectedClassMapel.split("-");
        try {
          const res = await api.get(`/grades/students?classId=${classId}&subjectId=${subjectId}&componentId=${selectedComponent}`);
          setStudents(res.data);
          
          const initialState: Record<string, number> = {};
          res.data.forEach((s: any) => { initialState[s.studentId] = s.nilai; });
          setGradesState(initialState);
        } catch (error) {
          toast.error("Gagal memuat data nilai siswa.");
        }
      };
      fetchStudents();
    }
  }, [selectedClassMapel, selectedComponent, activeTab]);

  const handleGradeChange = (studentId: string, value: string) => {
    const val = value === "" ? 0 : parseFloat(value);
    setGradesState(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSaveGrades = async () => {
    if (!selectedClassMapel || !selectedComponent) return;
    setIsSubmitting(true);
    
    const [classId, subjectId] = selectedClassMapel.split("-");
    const records = Object.keys(gradesState).map(studentId => ({
      studentId,
      nilai: gradesState[studentId]
    }));

    try {
      await api.post("/grades/save", { classId, subjectId, componentId: selectedComponent, records });
      toast.success("Nilai berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan nilai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk Tab Rapor
  const fetchReportCard = async (studentId: string) => {
    const [classId] = selectedClassMapel.split("-");
    try {
      const res = await api.get(`/grades/report-card?classId=${classId}&studentId=${studentId}`);
      setReportData(res.data);
    } catch (error) {
      toast.error("Gagal memuat rapor.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-ink-dark">Penilaian & Rapor</h1>
            <p className="text-brand-ink-dark/60 text-sm mt-1">Kelola input nilai dan cetak lembar hasil studi siswa.</p>
          </div>
        </div>

        <div className="flex bg-brand-surface-alt p-1 rounded-xl">
          <button 
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "INPUT" ? "bg-brand-surface text-brand-primary shadow-sm" : "text-brand-ink-muted hover:text-brand-ink"}`}
            onClick={() => setActiveTab("INPUT")}
          >
            Input Nilai
          </button>
          <button 
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "RAPOR" ? "bg-brand-surface text-brand-primary shadow-sm" : "text-brand-ink-muted hover:text-brand-ink"}`}
            onClick={() => { setActiveTab("RAPOR"); setReportData(null); }}
          >
            Cetak Rapor
          </button>
        </div>
      </div>

      {activeTab === "INPUT" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Pengaturan Komponen */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-brand-ink-dark mb-4">Pengaturan Kelas</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-brand-ink-muted mb-1 block">Pilih Kelas & Mapel</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedClassMapel} onChange={(e) => setSelectedClassMapel(e.target.value)}>
                    {myClasses.map(mc => <option key={mc.id} value={mc.id}>{mc.className} - {mc.subjectName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-ink-muted mb-1 block">Komponen Nilai</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedComponent} onChange={(e) => setSelectedComponent(e.target.value)}>
                    {components.map(c => <option key={c.id} value={c.id}>{c.nama} (Bobot: {c.bobot_persen}%)</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-brand-primary-soft  border border-brand-primary-soft rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-brand-primary mb-4 flex items-center gap-2"><Plus className="h-4 w-4"/> Buat Komponen Baru</h3>
              <form onSubmit={handleCreateComponent} className="space-y-3">
                <Input required placeholder="Nama (Misal: UTS)" value={newComponent.nama} onChange={e => setNewComponent({...newComponent, nama: e.target.value})} />
                <Input required type="number" placeholder="Bobot Persen (Misal: 30)" value={newComponent.bobot_persen} onChange={e => setNewComponent({...newComponent, bobot_persen: e.target.value})} />
                <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary">Tambah Komponen</Button>
              </form>
            </div>
          </div>

          {/* Kolom Kanan: Tabel Input Nilai */}
          <div className="lg:col-span-2 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-brand-ink-dark">Formulir Input Nilai</h3>
              <Button onClick={handleSaveGrades} disabled={isSubmitting || students.length === 0} className="bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary flex items-center gap-2">
                <Save className="h-4 w-4" /> {isSubmitting ? "Menyimpan…" : "Simpan Nilai"}
              </Button>
            </div>

            {students.length === 0 ? (
              <p className="text-center text-brand-ink-muted py-8">Tidak ada data siswa / Pilih kelas terlebih dahulu.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-line bg-brand-surface text-brand-ink text-xs ">
                      <th className="p-3 font-semibold w-12 text-center">No</th>
                      <th className="p-3 font-semibold">Nama Siswa</th>
                      <th className="p-3 font-semibold text-center w-32">Nilai (0-100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line text-sm">
                    {students.map((student, index) => (
                      <tr key={student.studentId} className="hover:bg-brand-surface-alt/70">
                        <td className="p-3 text-center text-brand-ink-muted font-semibold">{index + 1}</td>
                        <td className="p-3 font-bold text-brand-ink-dark">{student.nama} <br/><span className="text-xs text-brand-ink-muted font-normal">NIS: {student.nis}</span></td>
                        <td className="p-3">
                          <Input 
                            type="number" min="0" max="100" 
                            className="text-center font-bold text-brand-primary"
                            value={gradesState[student.studentId] || ""}
                            onChange={(e) => handleGradeChange(student.studentId, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "RAPOR" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Kolom Kiri: Pemilihan Siswa */}
          <div className="lg:col-span-1 bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm max-h-[600px] flex flex-col">
            <h3 className="font-bold text-brand-ink-dark mb-4">Pilih Siswa</h3>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-4" value={selectedClassMapel} onChange={(e) => { setSelectedClassMapel(e.target.value); setReportData(null); }}>
              {myClasses.map(mc => <option key={mc.id} value={mc.id}>{mc.className}</option>)}
            </select>
            
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {students.map(s => (
                <button 
                  key={s.studentId}
                  onClick={() => fetchReportCard(s.studentId)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors text-sm ${reportData?.student?.id === s.studentId ? 'bg-brand-primary-soft border-brand-primary-soft text-brand-primary font-bold' : 'bg-brand-surface border-brand-line hover:border-brand-primary-soft text-brand-ink'}`}
                >
                  {s.nama}
                </button>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Preview Rapor */}
          <div className="lg:col-span-3 bg-brand-surface border border-brand-line rounded-xl shadow-lg p-8 min-h-[600px]">
            {!reportData ? (
              <div className="h-full flex flex-col items-center justify-center text-brand-ink-muted">
                <FileText className="h-16 w-16 mb-4 text-brand-ink-muted" />
                <p>Pilih siswa dari daftar di samping untuk melihat rapor.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Header Rapor */}
                <div className="text-center border-b-2 border-brand-ink pb-6">
                  <h2 className="text-2xl font-bold  text-black">Laporan Hasil Belajar (Rapor)</h2>
                  <p className="text-brand-ink mt-1">Tahun Ajaran {reportData.academicYear.tahun_ajaran} / Semester {reportData.academicYear.semester}</p>
                </div>

                {/* Info Siswa */}
                <div className="grid grid-cols-2 gap-4 text-sm text-black">
                  <div><span className="font-semibold inline-block w-32">Nama Peserta Didik</span>: {reportData.student.nama}</div>
                  <div><span className="font-semibold inline-block w-24">Kelas</span>: {reportData.classInfo.nama_kelas}</div>
                  <div><span className="font-semibold inline-block w-32">Nomor Induk / NISN</span>: {reportData.student.nis} / {reportData.student.nisn}</div>
                </div>

                {/* Tabel Nilai */}
                <table className="w-full text-left border-collapse border border-brand-line-strong">
                  <thead>
                    <tr className="bg-brand-surface-alt text-black">
                      <th className="border border-brand-line-strong p-3 text-center w-12">No</th>
                      <th className="border border-brand-line-strong p-3">Mata Pelajaran</th>
                      <th className="border border-brand-line-strong p-3 text-center w-32">Nilai Akhir</th>
                      <th className="border border-brand-line-strong p-3 text-center w-32">Predikat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.grades.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-brand-ink-muted">Belum ada nilai yang diinput.</td></tr>
                    ) : (
                      reportData.grades.map((g: any, i: number) => {
                        const finalScore = Math.round(g.total_nilai);
                        let predikat = 'D';
                        if (finalScore >= 90) predikat = 'A';
                        else if (finalScore >= 80) predikat = 'B';
                        else if (finalScore >= 70) predikat = 'C';

                        return (
                          <tr key={i}>
                            <td className="border border-brand-line-strong p-3 text-center">{i + 1}</td>
                            <td className="border border-brand-line-strong p-3 font-semibold">{g.nama_mapel}</td>
                            <td className="border border-brand-line-strong p-3 text-center font-bold">{finalScore}</td>
                            <td className="border border-brand-line-strong p-3 text-center font-bold">{predikat}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Aksi */}
                <div className="flex justify-end pt-8">
                  <Button className="bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary gap-2">
                    <Printer className="w-4 h-4" /> Cetak Rapor PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}