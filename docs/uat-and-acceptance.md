# UAT dan Penerimaan Hasil — StackPlus Studio

**Versi:** 1.0
**Terkait:** `PRD.md` (acceptance criteria), `docs/change-request.md`, `docs/release-process.md`, `docs/delivery-sop.md`

Angka durasi dan jumlah putaran revisi di dokumen ini adalah default; sesuaikan dengan kontrak proyek.

---

## 1. Tujuan

User Acceptance Testing (UAT) memastikan hasil kerja memenuhi PRD dari sudut pandang pengguna nyata, sebelum rilis production. UAT bukan tempat menambah fitur baru; permintaan baru melalui `docs/change-request.md`.

---

## 2. Syarat mulai UAT (entry criteria)

UAT hanya dimulai jika semua terpenuhi:

- [ ] Semua fitur prioritas Must di PRD selesai dikerjakan.
- [ ] Quality gate hijau (`typecheck`, `lint`, `test:cov`, `test:e2e`, `build`) dan `security.yml` bersih.
- [ ] QA internal selesai: QA UI (`docs/ui.md` bagian 19), responsive 375–1536px, keyboard dan fokus, state loading/empty/error.
- [ ] Environment **staging** aktif, setara production, memakai **data sintetis** (bukan data pribadi nyata).
- [ ] Akun uji untuk setiap peran tersedia.
- [ ] Daftar kasus uji (bagian 4) berdasarkan acceptance criteria PRD sudah dibagikan.
- [ ] Penguji dari pihak klien ditunjuk dan tersedia selama periode UAT.

---

## 3. Peran

| Peran | Tanggung jawab |
|---|---|
| Penguji klien | Menjalankan kasus uji, mencatat temuan dengan jelas |
| Penanggung jawab klien (PIC) | Mengonsolidasi temuan, memutuskan prioritas dari sisi bisnis, menandatangani penerimaan |
| Project lead StackPlus | Mengatur jadwal, mengklasifikasi temuan, melapor status |
| Developer StackPlus | Memperbaiki temuan dan menyiapkan build ulang di staging |

---

## 4. Kasus uji

Setiap acceptance criteria PRD menjadi satu atau lebih kasus uji.

| ID | Fitur (FR) | Peran | Langkah | Hasil yang diharapkan | Hasil (Lulus/Gagal) | Catatan |
|---|---|---|---|---|---|---|
| UAT-001 | FR-001 | | 1... 2... | | | |

Selain fitur, uji juga: login/logout, pembatasan akses per peran (coba akses yang tidak seharusnya), validasi form, kondisi data kosong, dan tampilan di perangkat nyata yang dipakai klien.

---

## 5. Klasifikasi temuan

| Severity | Definisi | Contoh | Syarat penerimaan |
|---|---|---|---|
| **Blocker** | Alur utama tidak dapat dipakai atau data salah/hilang atau celah keamanan | Tidak bisa login, total transaksi salah | Harus 0 |
| **Major** | Fitur Must tidak sesuai PRD, ada workaround sulit | Filter tidak bekerja | Harus 0, atau disepakati tertulis untuk ditunda |
| **Minor** | Fitur berfungsi tetapi kurang sesuai, ada workaround mudah | Pesan error kurang jelas | Boleh tersisa sesuai kesepakatan (jadwal perbaikan) |
| **Kosmetik** | Visual kecil tanpa dampak fungsi | Jarak kurang rapi | Boleh tersisa; dikumpulkan |
| **Permintaan baru** | Tidak ada di PRD | Tambah laporan baru | Bukan temuan UAT → change request |

Temuan yang ternyata sudah sesuai PRD adalah **klarifikasi**, bukan bug.

---

## 6. Alur

1. **Kickoff UAT** — jelaskan cakupan, jadwal, cara melapor, akun uji.
2. **Pengujian** — durasi default **5–10 hari kerja**.
3. **Pelaporan** — penguji mencatat temuan dengan format bagian 7; PIC mengonsolidasi.
4. **Triase** — StackPlus mengklasifikasi (bagian 5), menjawab klarifikasi, menjadwalkan perbaikan; temuan baru ditandai sebagai CR.
5. **Perbaikan dan build ulang** — rilis ke staging; developer menambahkan regression test untuk bug yang diperbaiki.
6. **Uji ulang** — penguji memverifikasi hanya temuan yang diperbaiki ditambah uji regresi alur utama.
7. **Putaran revisi** — default **maksimal 2 putaran** perbaikan termasuk dalam harga; putaran tambahan diperlakukan sebagai pekerjaan terpisah (disesuaikan kontrak).
8. **Penerimaan** — PIC menandatangani berita acara (bagian 8).

---

## 7. Format laporan temuan

```markdown
**ID:** BUG-xxx
**Fitur / halaman:** 
**Peran / akun:** 
**Langkah mereproduksi:** 1) ... 2) ...
**Hasil yang diharapkan:** 
**Hasil yang terjadi:** 
**Bukti:** screenshot / rekaman layar
**Perangkat dan browser:** 
**Usulan severity:** 
```

Semua temuan dicatat di satu tempat (spreadsheet, issue tracker, atau GitHub Issues), bukan tersebar di chat.

---

## 8. Kriteria penerimaan dan berita acara

Hasil dinyatakan **diterima** bila:

- [ ] Tidak ada Blocker dan Major yang terbuka (atau penundaannya disepakati tertulis).
- [ ] Semua kasus uji fitur Must lulus.
- [ ] Temuan Minor/Kosmetik yang tersisa tercatat dengan jadwal perbaikan.
- [ ] Tidak ada permintaan baru yang belum diputuskan.

```markdown
# Berita Acara UAT — [Nama Proyek]
Versi diuji : [vX.Y.Z-rc]    Periode: [tanggal – tanggal]
Ringkasan   : kasus uji [n], lulus [n], gagal [n]
Temuan terbuka : Blocker 0 · Major 0 · Minor [n] · Kosmetik [n] (daftar terlampir)
Keputusan   : Diterima / Diterima bersyarat / Ditolak
Syarat (jika ada) : [...]
Klien (PIC): [nama, tanggal, tanda tangan]   StackPlus: [nama, tanggal, tanda tangan]
```

**Tidak ada respons klien:** jika klien tidak memberi umpan balik atau keputusan dalam batas waktu yang tertulis di kontrak (misal 5 hari kerja setelah pengingat tertulis), penerimaan dianggap diberikan. Pastikan klausul ini ada di kontrak sebelum diterapkan.

---

## 9. Setelah UAT

- Rilis ke production mengikuti `docs/release-process.md`.
- Hasil UAT dan berita acara dilampirkan pada serah terima (`docs/delivery-sop.md`).
- Temuan Minor/Kosmetik yang tersisa dijadwalkan pada masa garansi (`docs/maintenance-and-support.md`).
