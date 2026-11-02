# SOP Serah Terima ke Klien — StackPlus Studio

**Versi:** 1.0
**Terkait:** `docs/uat-and-acceptance.md`, `docs/release-process.md`, `docs/env-and-secrets.md`, `docs/maintenance-and-support.md`, `docs/security-rules.md`

Kepemilikan, hak akses, dan syarat komersial akhir mengikuti kontrak dengan klien. Dokumen ini mengatur sisi teknis dan prosedural.

---

## 1. Prinsip

1. **Klien memiliki asetnya:** akun, domain, data, dan kode (sesuai kontrak) tercatat atas nama klien.
2. **Tidak ada kejutan:** semua yang diserahkan tercantum di daftar serah terima dan diverifikasi bersama.
3. **Tidak ada jejak internal:** identitas dan kredensial studio dibersihkan dari repo klien.
4. **Akses minimum setelah serah terima:** akses StackPlus hanya yang dibutuhkan untuk dukungan yang disepakati.

---

## 2. Kepemilikan akun

Sebaiknya akun dibuat atas nama atau di organisasi klien **sejak awal proyek**, dengan StackPlus sebagai kolaborator. Jika dibuat di akun StackPlus lebih dulu, lakukan transfer sebelum serah terima.

| Aset | Pemilik akhir | Aksi saat serah terima |
|---|---|---|
| Repository GitHub | Organisasi klien | Transfer repository atau tambahkan klien sebagai owner |
| Frontend hosting (Vercel/lainnya) | Klien | Transfer project atau buat ulang di akun klien |
| Backend hosting (Railway/lainnya) | Klien | Transfer project |
| Database (Neon/lainnya) | Klien | Transfer project; verifikasi backup |
| Domain dan DNS | Klien (atas nama klien, bukan studio) | Pastikan kontak registrant dan akses DNS milik klien |
| Layanan email, storage, pembayaran, analytics | Klien | Pindahkan kepemilikan atau buat kunci baru di akun klien |
| Monitoring / error tracking | Klien | Transfer project atau undang klien sebagai admin |

---

## 3. Pembersihan jejak internal

- [ ] Scope package `@cahyodev/*` dan nama lain bernuansa pribadi/internal diganti dengan scope proyek (misal `@namaklien/database`); semua impor, `package.json`, perintah di dokumen, dan CI diperbarui.
- [ ] Remote Git milik StackPlus dihapus; repository berada di organisasi klien.
- [ ] Identitas commit sesuai kesepakatan; tidak ada email pribadi developer di metadata yang tidak seharusnya.
- [ ] Nama internal "Maincore"/"Core Engine" pada dokumen dan UI yang tampil ke pengguna final diganti sesuai merek klien (kecuali disepakati).
- [ ] Tidak ada kredensial, token, atau data klien lain dalam riwayat Git (jalankan Gitleaks dengan `--full-history`).
- [ ] Dokumen internal studio yang tidak relevan (catatan harga, diskusi internal) dihapus dari repo.

---

## 4. Rotasi kredensial

Semua secret yang pernah diketahui tim StackPlus **dirotasi saat serah terima** (`docs/env-and-secrets.md` bagian 6):

- [ ] `JWT_SECRET`, `JWT_REFRESH_SECRET` baru.
- [ ] Password database baru.
- [ ] Token layanan pihak ketiga dibuat ulang di akun klien.
- [ ] Secret CI diganti di GitHub klien.
- [ ] Akun admin awal diganti dengan akun milik klien; akun bootstrap dinonaktifkan.

Kredensial baru diserahkan lewat password manager bersama atau kanal terenkripsi. **DILARANG** lewat chat atau email polos.

---

## 5. Daftar penyerahan

| Item | Isi | Format |
|---|---|---|
| Kode sumber | Repository dengan riwayat bersih, branch `main` stabil, tag rilis | Repository klien |
| Dokumentasi | `PRD.md` final, `docs/` (arsitektur, env, runbook, rilis, insiden), README | Repository |
| Referensi environment | `docs/env-and-secrets.md` + `.env.example` terbarui | Repository |
| Kredensial dan akses | Daftar akun, pemilik, peran, lokasi secret | Dokumen terenkripsi / password manager |
| Hasil pengujian | Laporan quality gate, UAT sign-off, hasil perf test (jika ada) | PDF/Markdown |
| Data | Data awal/migrasi dan ekspor database | Sesuai kesepakatan, terenkripsi |
| Panduan pengguna | Panduan admin dan pengguna akhir (jika dalam scope) | PDF/video |
| Rencana dukungan | Cakupan, SLA, kontak (`docs/maintenance-and-support.md`) | Dokumen |

---

## 6. Alih pengetahuan

- Sesi serah terima dengan pihak teknis klien (60–90 menit): arsitektur, alur rilis, cara membaca log dan monitoring, backup dan restore, rotasi secret, prosedur insiden.
- Demonstrasi cara men-deploy dan rollback.
- Rekam sesi atau catat poin utama dan lampirkan ke dokumen serah terima.

---

## 7. Verifikasi akhir

Dilakukan bersama klien di environment production:

- [ ] Quality gate hijau pada commit rilis; `security.yml` tanpa temuan High/Critical yang belum ditangani.
- [ ] Alur utama berfungsi (login, fitur inti, logout) di domain produksi.
- [ ] Backup aktif dan **uji restore berhasil**.
- [ ] Monitoring dan alert aktif; penerima alert adalah pihak yang ditunjuk (`docs/observability.md`).
- [ ] Domain, SSL, dan perpanjangan otomatis berjalan; tanggal kedaluwarsa domain tercatat.
- [ ] Klien dapat login ke semua akun yang diserahkan.
- [ ] Akses anggota StackPlus yang tidak diperlukan sudah dicabut.

---

## 8. Berita acara serah terima

Dokumen singkat yang ditandatangani kedua pihak.

```markdown
# Berita Acara Serah Terima — [Nama Proyek]
Tanggal      : [dd MMM yyyy]
Versi rilis  : [vX.Y.Z]  ·  Commit: [hash]
Daftar yang diserahkan : [rujuk bagian 5, centang]
Akun yang ditransfer   : [daftar + pemilik baru]
Kredensial dirotasi    : Ya / Tidak (alasan)
Masa dukungan          : [mulai – selesai] (lihat rencana dukungan)
Catatan/pengecualian   : [...]

Klien: [nama, tanda tangan]      StackPlus: [nama, tanda tangan]
```

---

## 9. Setelah serah terima

- Masa garansi dan dukungan dimulai dari tanggal berita acara (`docs/maintenance-and-support.md`).
- Akses StackPlus ke production hanya melalui akun bernama dan dicatat; tanpa akun bersama.
- Jika tidak ada kontrak dukungan, cabut seluruh akses StackPlus setelah masa garansi.
