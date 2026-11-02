# Template PRD — StackPlus Studio

**Cara pakai:** salin file ini ke root proyek sebagai `PRD.md`, isi semua bagian, hapus petunjuk dalam tanda `<...>`. PRD adalah dasar mutlak scope: tidak ada fitur yang dibangun jika tidak tercantum di sini. Perubahan setelah persetujuan mengikuti `docs/change-request.md`.

Bagian bertanda **(wajib)** harus terisi sebelum coding dimulai (lihat Definition of Ready di bagian 15).

---

# PRD — [Nama Proyek]

| Item | Isi |
|---|---|
| Klien | [Nama klien / perusahaan] |
| Versi PRD | 1.0 |
| Status | Draft / Menunggu persetujuan / Disetujui |
| Penulis | [Nama] |
| Tanggal | [dd MMM yyyy] |
| Penyetuju klien | [Nama, jabatan] |
| Penyetuju StackPlus : Budi | [Budi Cahyono, Full Stack Developer / Software Architect] |

**Riwayat versi**

| Versi | Tanggal | Perubahan | CR terkait |
|---|---|---|---|
| 1.0 | | Versi awal | – |

---

## 1. Ringkasan dan tujuan (wajib)

- **Masalah yang diselesaikan:** <1–3 kalimat>
- **Tujuan bisnis:** <hasil yang diharapkan klien>
- **Ukuran keberhasilan:** <metrik terukur, misal "kasir menyelesaikan transaksi < 30 detik">
- **Jenis produk:** <marketing website / dashboard / POS / HRIS / ERP / LMS / lainnya> (menentukan pola UI di `docs/ui.md`)

## 2. Pengguna dan peran (wajib)

| Peran | Deskripsi | Perangkat utama | Frekuensi pakai |
|---|---|---|---|
| | | | |

## 3. Ruang lingkup (wajib)

**Termasuk (in scope):**
- 

**Tidak termasuk (out of scope):**
- 

**Asumsi:**
- 

**Batasan (waktu, anggaran, teknologi, regulasi):**
- 

## 4. Peran dan hak akses (wajib)

Matriks ini menjadi dasar `@Roles(...)` dan pemeriksaan kepemilikan data di backend (`docs/security-rules.md`). Tulis juga aturan kepemilikan: siapa boleh melihat/mengubah data milik siapa.

| Fitur / aksi | ADMIN | [Peran 2] | [Peran 3] | USER | Catatan kepemilikan |
|---|:--:|:--:|:--:|:--:|---|
| Lihat daftar [objek] | ✔ | | | | |
| Buat [objek] | ✔ | | | | |
| Ubah [objek] | ✔ | | | milik sendiri | |
| Hapus [objek] | ✔ | | | ✘ | |

## 5. Fitur dan requirement (wajib)

Prioritas memakai MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (kali ini).

| ID | Fitur | Prioritas | Deskripsi | Acceptance criteria (terukur dan dapat diuji) |
|---|---|:--:|---|---|
| FR-001 | | M | | Diberikan..., ketika..., maka... |
| FR-002 | | | | |

Setiap fitur wajib memiliki minimal satu acceptance criteria; kriteria ini menjadi dasar UAT (`docs/uat-and-acceptance.md`).

## 6. Alur pengguna utama

Untuk setiap alur penting: langkah, kondisi gagal, dan hasil akhir.

1. **[Nama alur]** — [peran] → langkah 1 → langkah 2 → hasil. Kondisi gagal: [...]

## 7. Data dan entitas (wajib)

| Entitas | Atribut utama | Relasi | Kebijakan hapus (hard/soft) | Retensi |
|---|---|---|---|---|
| | | | | |

Tambahkan diagram ERD sederhana bila perlu. Jenis data pribadi yang disimpan: <daftar>.

## 8. Requirement non-fungsional (wajib)

| Aspek | Target |
|---|---|
| Performa | <misal p95 < 500 ms pada 50 pengguna bersamaan> |
| Jumlah pengguna / data | <perkiraan> |
| Ketersediaan | <misal 99,5% / jam kerja> |
| Keamanan | Mengikuti `docs/security-rules.md`; tambahan: <...> |
| Privasi / kepatuhan | <apakah memproses data pribadi? UU PDP, aturan sektor> |
| Retensi dan backup | RPO: <> · RTO: <> |
| Browser / perangkat | <daftar> |
| Aksesibilitas | WCAG 2.2 AA |
| Bahasa | <Indonesia / Inggris / keduanya> |

## 9. Keputusan fondasi Core (wajib)

Core Engine menyediakan login, RBAC, dan CRUD pengguna. Putuskan fitur berikut: masuk scope atau tidak.

| Fitur | Masuk scope? | Catatan |
|---|:--:|---|
| Registrasi mandiri | | |
| Reset password | | Butuh layanan email |
| Verifikasi email | | Butuh layanan email |
| Logout dan pencabutan sesi | Ya | Wajib untuk proyek berlogin |
| Upload file | | Tipe, ukuran, penyimpanan |
| Audit log | | Peristiwa yang dicatat |
| Notifikasi (email/WhatsApp/push) | | |
| Multi-tenant | | Lihat `docs/database-standards.md` 2.3 |
| Ekspor laporan (PDF/Excel) | | Butuh stylesheet cetak/template |

## 10. Integrasi pihak ketiga

| Layanan | Tujuan | Data yang dipertukarkan | Akun/biaya ditanggung | Risiko |
|---|---|---|---|---|
| | | | | |

## 11. UI dan konten

- **Pola UI:** <sesuai jenis produk; rujuk `docs/ui.md`>
- **Density:** Compact / Comfortable / Spacious
- **Identitas klien:** <logo, warna, font; apakah mengganti brand token? Jika ya, jelaskan pemetaannya>
- **Halaman dan layar utama:** <daftar>
- **Konten:** <siapa menyediakan teks, gambar, data; tenggat>
- **Format lokal:** Rupiah, `dd MMM yyyy`, zona waktu <WIB/WITA/WIT>
- **SEO dan analytics (jika marketing):** <metadata, OG image, tools, consent>

## 12. Fase dan milestone (wajib)

| Fase | Isi | Fitur (ID) | Estimasi | Kriteria selesai |
|---|---|---|---|---|
| 1. Fondasi | Setup, auth, role | | | |
| 2. Fitur inti | | | | |
| 3. Integrasi | | | | |
| 4. Finishing | UAT, perbaikan, rilis | | | |

Tiap tahap memiliki validasi yang jelas dan dependensi antar-modul yang tercatat.

## 13. Risiko

| Risiko | Dampak | Kemungkinan | Mitigasi | Pemilik |
|---|---|---|---|---|
| | | | | |

## 14. Pertanyaan terbuka

| # | Pertanyaan | Ditujukan ke | Batas waktu | Jawaban |
|---|---|---|---|---|
| 1 | | | | |

Semua pertanyaan yang memengaruhi scope atau keamanan harus terjawab sebelum fitur terkait dikerjakan.

## 15. Definition of Ready (centang sebelum coding)

- [ ] Bagian bertanda (wajib) terisi dan bebas ambiguitas.
- [ ] Setiap fitur Must punya acceptance criteria yang dapat diuji.
- [ ] Matriks role dan aturan kepemilikan data disepakati.
- [ ] Keputusan fondasi Core (bagian 9) sudah diambil.
- [ ] Pertanyaan terbuka yang memengaruhi scope sudah terjawab.
- [ ] Kebijakan data pribadi dan retensi ditentukan (jika relevan).
- [ ] Persetujuan tertulis dari klien dan StackPlus.

## 16. Persetujuan

| Pihak | Nama | Tanggal | Tanda tangan / bukti persetujuan |
|---|---|---|---|
| Klien | | | |
| StackPlus Studio | | | |
