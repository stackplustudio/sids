"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { CalendarCheck, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PresensiPage() {
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [selectedClassMapel, setSelectedClassMapel] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split("T")[0]);
  
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil kelas jadwal guru
  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const res = await api.get("/lms/classes");
        setMyClasses(res.data);
        if (res.data.length > 0) {
          setSelectedClassMapel(res.data[0].id);
        }
      } catch (error) {
        toast.error("Gagal memuat jadwal kelas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyClasses();
  }, []);

  // Ambil daftar siswa dan status presensinya saat opsi berubah
  useEffect(() => {
    if (!selectedClassMapel || !tanggal) return;

    const fetchStudents = async () => {
      const [classId, subjectId] = selectedClassMapel.split("-");
      try {
        const res = await api.get(`/attendances/list?classId=${classId}&subjectId=${subjectId}&tanggal=${tanggal}`);
        setStudents(res.data);
        
        // Bentuk state awal dari response backend
        const initialState: Record<string, string> = {};
        res.data.forEach((s: any) => {
          initialState[s.studentId] = s.status;
        });
        setAttendanceState(initialState);
      } catch (error) {
        toast.error("Gagal memuat data siswa.");
      }
    };

    fetchStudents();
  }, [selectedClassMapel, tanggal]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassMapel) return;
    setIsSubmitting(true);
    
    const [classId, subjectId] = selectedClassMapel.split("-");
    const records = Object.keys(attendanceState).map(studentId => ({
      studentId,
      status: attendanceState[studentId]
    }));

    try {
      await api.post("/attendances/save", {
        classId,
        subjectId,
        tanggal,
        records
      });
      toast.success("Presensi berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan presensi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HADIR': return 'bg-success-soft text-success border-success/30';
      case 'SAKIT': return 'bg-warning-soft text-warning border-warning/30';
      case 'IZIN': return 'bg-brand-primary-soft text-brand-primary-dark border-brand-primary-soft';
      case 'ALPA': return 'bg-danger-soft text-danger-dark border-danger/30';
      default: return 'bg-brand-surface-alt text-brand-ink border-brand-line';
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data…</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
          <CalendarCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-ink-dark">Presensi Kelas</h1>
          <p className="text-brand-ink-dark/60 text-sm mt-1">Catat kehadiran siswa berdasarkan jadwal mengajar Anda.</p>
        </div>
      </div>

      {/* Filter Area */}
      <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="text-xs font-semibold text-brand-ink-dark/60 mb-2 block">Pilih Kelas & Mapel</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedClassMapel}
            onChange={(e) => setSelectedClassMapel(e.target.value)}
          >
            {myClasses.map(mc => (
              <option key={mc.id} value={mc.id}>{mc.className} - {mc.subjectName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-ink-dark/60 mb-2 block">Tanggal Pertemuan</label>
          <Input 
            type="date" 
            value={tanggal} 
            onChange={(e) => setTanggal(e.target.value)} 
            className="w-full md:w-48"
          />
        </div>
      </div>

      {/* Tabel Presensi */}
      <div className="bg-brand-surface  border border-brand-line rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-brand-ink-dark flex items-center gap-2"><Users className="h-4 w-4" /> Daftar Siswa ({students.length})</h3>
          <Button 
            onClick={handleSaveAttendance} 
            disabled={isSubmitting || students.length === 0} 
            className="bg-brand-primary hover:bg-brand-primary-dark text-brand-on-primary flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {isSubmitting ? "Menyimpan…" : "Simpan Presensi"}
          </Button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12 text-brand-ink-muted">Tidak ada data siswa untuk kelas ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-ink-dark/10 bg-brand-surface-alt text-brand-ink-dark text-sm ">
                  <th className="p-4 font-semibold w-16 text-center">No</th>
                  <th className="p-4 font-semibold">Nama Siswa</th>
                  <th className="p-4 font-semibold text-center">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink-dark/5 text-sm">
                {students.map((student, index) => (
                  <tr key={student.studentId} className="hover:bg-brand-surface-alt transition-colors">
                    <td className="p-4 text-center font-semibold text-brand-ink-dark/50">{index + 1}</td>
                    <td className="p-4">
                      <p className="font-bold text-brand-ink-dark">{student.nama}</p>
                      <p className="text-xs text-brand-ink-muted">NIS: {student.nis}</p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex rounded-lg border border-brand-line p-1 bg-brand-surface">
                        {['HADIR', 'SAKIT', 'IZIN', 'ALPA'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(student.studentId, status)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                              attendanceState[student.studentId] === status 
                                ? getStatusColor(status) 
                                : 'text-brand-ink-muted hover:bg-brand-line'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}