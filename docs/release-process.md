# Proses Rilis — StackPlus Studio

**Versi:** 1.0
**Terkait:** `docs/ci-cd.md`, `docs/deployment.md`, `docs/database-standards.md`, `docs/security-rules.md`, `docs/observability.md`, `docs/incident-response.md`

Proses ini adalah standar default untuk proyek kecil–menengah. Sesuaikan nama environment atau pemicu deploy dengan konfigurasi platform yang dipakai, dan catat penyimpangannya di README proyek.

---

## 1. Environment dan alur branch

| Environment | Tujuan | Sumber deploy | Data |
|---|---|---|---|
| Lokal | Pengembangan | – | Sintetis |
| Preview (per PR) | Review perubahan UI | PR (misal Vercel preview) | Sintetis; API staging |
| **Staging** | UAT dan verifikasi rilis | Otomatis dari `main` | Sintetis atau anonim |
| **Production** | Pengguna nyata | **Tag rilis** `vX.Y.Z` (promosi manual) | Nyata |

```text
feat/* ──PR──▶ main ──auto──▶ staging ──(verifikasi + persetujuan)──▶ tag vX.Y.Z ──▶ production
fix/*  ──PR──▶ main
hotfix/* ──PR──▶ main ──▶ tag patch ──▶ production (jalur cepat, bagian 6)
```

- `main` dilindungi: wajib PR, check CI hijau, dan minimal satu review (`docs/coding-standards.md` bagian 7).
- Production **DILARANG** menerima deploy dari branch selain `main`.
- Untuk proyek yang sangat kecil, `main` boleh auto-deploy ke production, tetapi gate dan checklist bagian 3 tetap berlaku.

---

## 2. Versioning dan changelog

- **SemVer:** `MAJOR.MINOR.PATCH`
  - `PATCH`: perbaikan bug tanpa perubahan kontrak.
  - `MINOR`: fitur baru yang kompatibel.
  - `MAJOR`: perubahan yang merusak kompatibilitas (kontrak API, skema yang tidak kompatibel mundur).
- Tag annotated di commit `main`: `git tag -a v1.4.0 -m "Rilis 1.4.0"`.
- `CHANGELOG.md` diperbarui setiap rilis, dikelompokkan: Ditambah, Diubah, Diperbaiki, Keamanan, Dihapus, dengan nomor PR/CR.

---

## 3. Checklist pra-rilis

- [ ] Semua PR yang masuk sudah ditinjau; `main` hijau (`typecheck`, `lint`, `test:cov`, `test:e2e`, `build`, docker validate).
- [ ] `security.yml` bersih dari temuan High/Critical yang belum ditangani.
- [ ] Rilis sudah berjalan di **staging** dan diverifikasi (alur utama + fitur baru).
- [ ] UAT diterima untuk fitur yang baru (`docs/uat-and-acceptance.md`) bila rilis besar.
- [ ] **Migrasi database** direview, diuji di staging, dan kompatibel mundur (expand → migrate → contract; `docs/database-standards.md` 3.2).
- [ ] Variabel environment baru sudah diset di production dan tercatat di `docs/env-and-secrets.md`.
- [ ] Backup database terbaru berhasil (dan uji restore terbaru masih dalam jadwal).
- [ ] Rencana rollback tertulis untuk rilis ini (bagian 5).
- [ ] `CHANGELOG.md` dan versi sudah diperbarui; tag disiapkan.
- [ ] Waktu rilis dipilih di luar jam sibuk pengguna; pihak terkait diberi tahu.
- [ ] Orang yang melakukan rilis dan orang yang dapat di-hubungi saat masalah sudah ditentukan.

---

## 4. Langkah rilis production

Urutan dirancang agar versi lama dan baru dapat hidup berdampingan selama transisi.

1. **Backup** database production (konfirmasi berhasil).
2. **Migrasi database:** `prisma migrate deploy` dari lingkungan rilis yang aman. Migrasi harus kompatibel dengan versi aplikasi lama yang masih berjalan.
3. **Deploy API** (Railway atau platform pilihan) dari tag; tunggu readiness/health hijau.
4. **Deploy web** (Vercel atau platform pilihan) dari tag. Jika web bergantung endpoint baru, API harus lebih dulu; jika API menghapus endpoint lama, web harus lebih dulu — urutan ditulis di rencana rilis.
5. **Verifikasi** (bagian 4.1).
6. **Pantau** log, error rate, latensi, dan koneksi database selama **30–60 menit** (`docs/observability.md`).
7. **Umumkan** rilis selesai dan catat di riwayat rilis.

### 4.1 Verifikasi pasca-rilis

Mengikuti `docs/deployment.md` bagian 3.D, ditambah:

- [ ] `/health` (readiness) API sehat; homepage terbuka tanpa login.
- [ ] Login, refresh sesi, dan logout berfungsi di domain produksi (CORS dan cookie).
- [ ] `/dashboard` tanpa sesi dialihkan ke homepage.
- [ ] Fitur utama baru berfungsi dengan data uji non-destruktif.
- [ ] Tidak ada lonjakan error 5xx atau latensi di dashboard monitoring.
- [ ] Alert tetap aktif dan tidak bising.

---

## 5. Rollback

Tentukan sebelum rilis; jangan merancang saat insiden.

| Komponen | Cara rollback | Catatan |
|---|---|---|
| Web | Redeploy tag/deployment sebelumnya (promote deployment lama di platform) | Cepat dan aman |
| API | Redeploy image/tag sebelumnya | Pastikan skema database masih kompatibel dengan versi lama |
| Database | **Forward fix** (migrasi perbaikan) sebagai pilihan utama | Restore dari backup hanya jika data rusak, dan menyebabkan kehilangan data sejak backup; putuskan bersama klien |

- Karena migrasi bersifat expand→contract, aplikasi versi lama tetap bisa berjalan di atas skema baru sehingga rollback aplikasi tidak butuh rollback database.
- Jika rilis memuat langkah tidak dapat dibalik (misal menghapus kolom), langkah itu dipisah ke rilis berikutnya setelah rilis sebelumnya stabil.
- Kriteria memutuskan rollback: alur utama rusak, error rate di atas ambang alert, atau kehilangan/korupsi data. Putuskan dalam **15 menit** setelah gejala jika tidak ada perbaikan cepat yang jelas.

---

## 6. Hotfix

Untuk bug S1/S2 produksi (`docs/maintenance-and-support.md`).

1. Buat `hotfix/<ringkas>` dari tag produksi saat ini atau `main` yang stabil.
2. Perbaikan minimal + regression test. Quality gate tetap berjalan (tidak dilewati).
3. PR dengan review (boleh dipercepat, tetapi tidak ditiadakan).
4. Tag `PATCH` baru, rilis dengan langkah bagian 4 (backup tetap dilakukan jika menyentuh data atau skema).
5. Pastikan perbaikan ada di `main`. Catat insiden dan ringkasan (`docs/incident-response.md`).

---

## 7. Pembekuan rilis (release freeze)

- Hindari rilis menjelang akhir pekan, hari libur, dan periode puncak bisnis klien (misal akhir bulan untuk keuangan, jam operasional untuk POS).
- Selama UAT atau audit, rilis hanya untuk perbaikan yang disetujui.

---

## 8. Catatan rilis dan arsip

Simpan untuk setiap rilis: versi, tanggal, penanggung jawab, daftar perubahan, migrasi yang dijalankan, hasil verifikasi, dan masalah yang ditemui.

```markdown
## vX.Y.Z — [dd MMM yyyy]
Penanggung jawab : [nama]
Perubahan        : [PR/CR terkait]
Migrasi          : [nama migrasi / tidak ada]
Env baru         : [daftar / tidak ada]
Verifikasi       : [lulus / catatan]
Masalah & tindak lanjut : [...]
```

---

## 9. Feature flag (opsional)

Gunakan flag sederhana (variabel konfigurasi atau tabel pengaturan) untuk fitur berisiko tinggi agar bisa dimatikan tanpa rilis ulang. Hapus flag yang sudah stabil dalam rilis berikutnya agar tidak menumpuk.
