# Incident Response — StackPlus Studio

**Versi:** 1.0
**Terkait:** `docs/security-rules.md`, `docs/env-and-secrets.md`, `docs/release-process.md`, `docs/observability.md`, `docs/maintenance-and-support.md`

Insiden adalah kejadian yang mengganggu layanan atau mengancam kerahasiaan, integritas, atau ketersediaan data. Tujuannya berurutan: **hentikan kerusakan → pulihkan layanan → temukan penyebab → cegah berulang.**

---

## 1. Tingkat keparahan

| Level | Definisi | Contoh | Target respons |
|---|---|---|---|
| **SEV1** | Layanan down total atau data pribadi bocor/hilang/rusak atau kredensial produksi bocor | API tidak bisa diakses, dump database tersebar, token bocor di repo publik | ≤ 15 menit setelah terdeteksi (ikuti SLA S1 di `docs/maintenance-and-support.md`) |
| **SEV2** | Fitur utama rusak atau performa sangat buruk bagi banyak pengguna | Login gagal untuk sebagian pengguna, error 5xx tinggi | ≤ 1 jam kerja |
| **SEV3** | Fitur sekunder rusak, ada workaround | Ekspor gagal | ≤ 1 hari kerja |
| **SEV4** | Gangguan kecil | Kosmetik, bug jarang | Dijadwalkan |

Jika ragu antara dua level, pilih yang lebih tinggi lalu turunkan setelah dipahami.

---

## 2. Peran

| Peran | Tugas |
|---|---|
| **Incident Commander (IC)** | Memimpin, mengambil keputusan, mengatur pembagian tugas; satu orang saja |
| **Teknis** | Diagnosa, mitigasi, perbaikan |
| **Komunikator** | Menyampaikan status ke klien dan pihak terkait; menjaga catatan waktu |

Pada tim kecil satu orang dapat merangkap peran, tetapi IC tidak sekaligus menjadi satu-satunya yang melakukan perbaikan pada SEV1 bila ada orang lain.

**Daftar kontak (isi per proyek, simpan di tempat yang bisa diakses saat sistem down):**

| Peran | Nama | Kontak | Cadangan |
|---|---|---|---|
| IC StackPlus | | | |
| Teknis utama | | | |
| PIC klien | | | |
| Penyedia hosting/DB (dukungan) | | | |

---

## 3. Alur

```text
Deteksi → Triase → Tahan (contain) → Pulihkan → Verifikasi → Tinjau (post-mortem)
```

### 3.1 15 menit pertama (SEV1/SEV2)

1. **Konfirmasi** insiden nyata (bukan alarm palsu); catat waktu mulai (WIB dan UTC).
2. **Tetapkan level** dan **tunjuk IC**.
3. **Buka catatan insiden** (dokumen bersama) dan catat setiap tindakan beserta waktunya.
4. **Beri tahu klien** (SEV1 segera; SEV2 dalam 1 jam): apa yang terjadi, dampaknya, dan kapan kabar berikutnya.
5. **Tahan kerusakan** sebelum mencari penyebab akhir: rollback rilis terakhir, matikan fitur (feature flag), blokir sumber serangan, atau nonaktifkan akun/token terkait.
6. **Kumpulkan bukti** (log, waktu, ID permintaan, screenshot) sebelum dihapus atau tertimpa.

### 3.2 Komunikasi

| Level | Frekuensi pembaruan ke klien |
|---|---|
| SEV1 | Setiap 30–60 menit sampai pulih |
| SEV2 | Setiap 2–4 jam |
| SEV3–4 | Saat ada perkembangan |

Pesan pembaruan: **status** (diselidiki / dimitigasi / pulih), **dampak**, **tindakan**, **perkiraan waktu berikutnya**. Jangan berspekulasi tentang penyebab atau menyalahkan pihak tertentu sebelum terbukti.

---

## 4. Playbook

### 4.1 Layanan down atau error tinggi

1. Cek status penyedia (hosting, database) dan dashboard monitoring.
2. Periksa rilis terbaru; jika berkorelasi, **rollback** (`docs/release-process.md` bagian 5).
3. Cek kesehatan database: koneksi habis (pool exhaustion), disk, kuota.
4. Cek `/health` readiness dan log error terbaru.
5. Jika karena lonjakan beban: naikkan kapasitas atau terapkan pembatasan; lihat baseline `docs/perf-testing.md`.
6. Setelah pulih, pantau 60 menit.

### 4.2 Kredensial atau secret bocor

(Gitleaks menemukan secret, secret terlihat di log/chat/repo publik, laptop hilang.)

1. **Rotasi segera** secret yang bocor (`docs/env-and-secrets.md` bagian 6). Menghapus dari repository tidak cukup.
2. Untuk `JWT_*`: setelah rotasi semua sesi berakhir; umumkan bila perlu.
3. Cabut token/kunci pihak ketiga yang terdampak dan buat yang baru.
4. Telusuri penyalahgunaan: periksa log akses database, log API, dan audit log pada periode sejak kebocoran.
5. Bersihkan jejak: hapus dari riwayat Git bila perlu (setelah rotasi), dan beri tahu semua yang memiliki salinan.
6. Jika ada indikasi akses tidak sah ke data pribadi, perlakukan sebagai insiden data (4.3).
7. Tambahkan pencegahan (aturan Gitleaks, hook pre-commit, edukasi).

### 4.3 Kebocoran atau kerusakan data pribadi

1. **Tahan:** hentikan jalur kebocoran (cabut akses, nonaktifkan endpoint, rotasi kredensial).
2. **Nilai cakupan:** data apa, milik siapa, berapa banyak, sejak kapan, apakah terenkripsi.
3. **Libatkan klien segera.** Klien sebagai pengendali data menentukan langkah pemberitahuan.
4. **Kewajiban pemberitahuan:** UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022) mewajibkan pemberitahuan tertulis kepada subjek data dan lembaga yang berwenang dalam batas waktu yang ditetapkan (umumnya disebut **3 × 24 jam** sejak kegagalan diketahui). Minta klien memastikan dengan penasihat hukumnya; ini bukan nasihat hukum.
5. **Simpan bukti** dengan integritas terjaga; jangan menimpa log.
6. Dokumentasikan seluruh langkah untuk laporan resmi.

### 4.4 Rilis bermasalah

Rollback sesuai `docs/release-process.md` bagian 5 dalam 15 menit setelah gejala jika perbaikan cepat tidak jelas. Jangan "memperbaiki di produksi" tanpa catatan.

### 4.5 Database bermasalah (korupsi, hilang, migrasi gagal)

1. Hentikan penulisan baru bila perlu (mode maintenance) untuk mencegah kerusakan bertambah.
2. **Jangan** menjalankan `migrate reset` atau `db push` di produksi.
3. Putuskan bersama klien: forward fix atau restore dari backup (ada kehilangan data sejak backup).
4. Lakukan restore ke database baru lebih dulu, verifikasi, baru alihkan; pertahankan database asal untuk analisis.

### 4.6 Serangan atau penyalahgunaan (brute force, scraping, DDoS ringan)

1. Pastikan rate limit bekerja dan membaca IP klien asli (`trust proxy`).
2. Blokir IP/ASN yang menyerang di level penyedia/CDN/firewall.
3. Perketat sementara batas pada endpoint yang diserang; aktifkan CAPTCHA bila ada.
4. Periksa apakah ada akun yang diambil alih; paksa reset sesi atau password bila perlu.

### 4.7 Kerentanan Critical pada dependensi

1. Nilai apakah terpapar (apakah kode rentan benar-benar dipakai).
2. Terapkan perbaikan atau mitigasi dalam 24 jam (`docs/security-rules.md` bagian 7).
3. Rilis lewat jalur hotfix; verifikasi dengan scan ulang.

---

## 5. Pemulihan dan penutupan

- Layanan dinyatakan pulih jika alur utama berfungsi dan metrik kembali normal selama minimal 30 menit.
- Beri tahu klien bahwa layanan pulih dan jelaskan dampak akhir.
- Insiden ditutup setelah tindakan perbaikan sementara diganti perbaikan permanen yang terjadwal.

---

## 6. Hal yang tidak boleh dilakukan

- Menghapus log, data, atau riwayat untuk "membersihkan" sebelum bukti disimpan.
- Menyembunyikan atau menunda pemberitahuan insiden data kepada klien.
- Berbagi detail insiden atau data terdampak di kanal publik.
- Mem-bypass quality gate pada hotfix tanpa catatan dan persetujuan.
- Menyalahkan individu pada catatan insiden.

---

## 7. Catatan insiden

```markdown
# INC-[nnn] — [Judul]
Level        : SEV[n]        IC: [nama]
Mulai (WIB)  : [tanggal jam]  Terdeteksi oleh: [monitoring/pengguna/tim]
Pulih (WIB)  : [tanggal jam]  Durasi dampak: [mm]
Dampak       : [pengguna/fungsi/data terdampak]
Garis waktu  : [jam — kejadian/tindakan]
Mitigasi     : 
```

---

## 8. Post-mortem (SEV1 dan SEV2, maksimal 5 hari kerja setelah pulih)

Tanpa menyalahkan individu; fokus pada sistem dan proses.

```markdown
# Post-mortem INC-[nnn]
## Ringkasan (2–3 kalimat)
## Dampak (siapa, berapa lama, data)
## Garis waktu lengkap
## Akar penyebab (mengapa terjadi, mengapa tidak terdeteksi lebih cepat)
## Yang berjalan baik
## Yang perlu diperbaiki
## Tindakan perbaikan
| # | Tindakan | Pemilik | Tenggat | Status |
```

Tindakan perbaikan yang menyangkut standar diperbarui ke dokumen terkait (`docs/security-rules.md`, `docs/observability.md`, `docs/release-process.md`, dll.). Bagikan ringkasan kepada klien.
