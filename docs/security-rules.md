# Security Rules — StackPlus Studio

**Versi:** 1.0 · **Berlaku untuk:** semua proyek dari Core Engine
**Terkait:** `docs/security-scanning.md` (alat scan), `docs/env-and-secrets.md`, `docs/incident-response.md`, `docs/coding-standards.md`

Dokumen ini mengatur apa yang **boleh dan tidak boleh dilakukan aplikasi**. Cara menjalankan alat scan ada di `docs/security-scanning.md`.

Poin bertanda **Verifikasi** adalah hal yang belum terdokumentasi di dokumen existing dan harus dicek di kode sebelum dianggap terpenuhi.

---

## 1. Prinsip

1. **Deny by default:** akses ditolak kecuali diizinkan secara eksplisit.
2. **Defense in depth:** jangan mengandalkan satu lapisan (proxy frontend bukan otorisasi).
3. **Least privilege:** pengguna, service, dan token hanya mendapat hak minimum.
4. **Data minimization:** jangan kumpulkan, simpan, atau tampilkan data yang tidak dibutuhkan.
5. **Secure by default:** konfigurasi awal harus aman; kelonggaran harus disengaja dan dicatat.

---

## 2. Autentikasi dan sesi

| Aturan | Level |
|---|---|
| Password di-hash dengan bcrypt (cost ≥ 10; **Verifikasi** nilai aktual, disarankan 12) | WAJIB |
| Panjang password minimum 8 karakter; disarankan 12 | WAJIB |
| Pesan login gagal generik (`Email atau password salah.`), tidak membocorkan apakah email terdaftar | WAJIB |
| Access token berumur pendek (disarankan ≤ 15 menit) | WAJIB |
| Refresh token di cookie `HttpOnly`, `Secure`, dengan `SameSite` yang sesuai topologi domain (lihat 2.1) | WAJIB |
| Token atau data sensitif tidak disimpan di `localStorage`/`sessionStorage` | DILARANG |
| Rate limit login 5 per menit per IP; rate limit tambahan pada reset password dan OTP | WAJIB |
| Endpoint **logout** yang menghapus cookie dan mencabut refresh token | WAJIB (proyek berlogin) |
| **Rotasi refresh token** dan kemampuan revokasi (daftar token tersimpan atau versi token per user) | DISARANKAN; wajib jika data sensitif atau multi-role |
| Reset password lewat token sekali pakai berumur pendek (≤ 30 menit), disimpan dalam bentuk hash | WAJIB jika fitur ada |
| Konfirmasi ulang password sebelum mengubah email, password, atau role | DISARANKAN |

**Verifikasi (belum jelas di dokumen):** endpoint refresh, logout, dan revokasi; asal cookie `token` yang dibaca `proxy.ts` (alur login hanya menyebut `refresh_token` dan `access_token` di body); tempat penyimpanan access token di klien.

### 2.1 Cookie dan domain

- Jika frontend dan API berada di **situs yang sama** (misal `app.klien.com` dan `api.klien.com`), gunakan `SameSite=Lax` atau `Strict` dengan `Domain=.klien.com`.
- Jika berbeda situs (misal `*.vercel.app` dan `*.railway.app`), cookie `Lax` tidak terkirim pada request lintas-situs dan alur refresh dapat gagal. Solusi yang diutamakan: **custom domain satu induk**. Alternatif: proxy API lewat Next.js (BFF) agar request tampak same-origin.
- Jika terpaksa `SameSite=None; Secure`, **WAJIB** ada perlindungan CSRF (token CSRF atau pemeriksaan `Origin`/`Referer` pada request yang mengubah data).
- Cookie `HttpOnly` untuk token sesi; **DILARANG** menyetel cookie token tanpa `Secure` di production.

---

## 3. Otorisasi

- **WAJIB** setiap endpoint memakai `JwtAuthGuard`, kecuali endpoint yang ditandai publik secara eksplisit (dengan decorator khusus dan alasan di komentar).
- **WAJIB** `RolesGuard` + `@Roles(...)` pada endpoint yang dibatasi peran.
- **WAJIB** setiap endpoint yang menerima `:id` atau referensi objek memeriksa kepemilikan atau hak (`assertSelfOrAdmin` atau setara). Tidak cukup mengandalkan "id sulit ditebak".
- Matriks role dan hak akses didefinisikan di PRD (bagian Role & Hak Akses) sebelum coding.
- Role default pengguna baru adalah `USER`. **DILARANG** menerima `role` dari body registrasi atau update profil biasa.
- Perubahan role hanya oleh `ADMIN`, dicatat di audit log (bagian 8).
- Admin pertama dibuat lewat prosedur bootstrap terkontrol (`docs/database-standards.md` bagian 6), bukan akun default.
- Pemeriksaan di `proxy.ts` hanya UX; otorisasi sebenarnya selalu di backend.

---

## 4. Input, query, dan upload

- **WAJIB** `ValidationPipe` dengan `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- **WAJIB** query lewat Prisma. **DILARANG** menyusun SQL dengan string concatenation. `$queryRaw` hanya dengan tagged template berparameter dan melalui review.
- **DILARANG** `dangerouslySetInnerHTML` dengan konten pengguna. Jika rich text dibutuhkan, sanitasi di server dan klien dengan library teruji.
- **URL dari pengguna** yang di-fetch server (webhook, gambar) wajib dibatasi allowlist domain untuk mencegah SSRF.

**Upload file** (jika ada di PRD):

| Aturan | Level |
|---|---|
| Allowlist tipe (cek ekstensi **dan** isi/MIME), batas ukuran, batas jumlah | WAJIB |
| Nama file diganti dengan ID acak; nama asli hanya sebagai metadata | WAJIB |
| Simpan di object storage atau di luar direktori yang dilayani web; tidak pernah dieksekusi | WAJIB |
| Akses file lewat URL bertanda tangan atau pemeriksaan otorisasi, bukan URL publik permanen untuk data pribadi | WAJIB |
| Pemindaian malware untuk file dari pengguna publik | DISARANKAN |

---

## 5. Data dan privasi

### 5.1 Klasifikasi data

| Kelas | Contoh | Aturan |
|---|---|---|
| Publik | Konten marketing | Bebas |
| Internal | Data operasional non-pribadi | Hanya pengguna terautentikasi |
| **Pribadi (PII)** | Nama, email, telepon, alamat, NIK, data gaji, data karyawan | Akses sesuai role; tidak masuk log; dienkripsi in transit; retensi terdefinisi |
| **Rahasia** | Password hash, token, secret, kunci API | Tidak pernah dikirim ke klien, log, atau repository |

### 5.2 Aturan

- **WAJIB** TLS (HTTPS) di semua environment non-lokal; database dengan SSL aktif.
- **DILARANG** mencatat password, token, secret, nomor identitas, atau PII lengkap di log, pesan error, atau analytics.
- **DILARANG** mengembalikan hash password atau token di respons API manapun.
- Data uji, staging, dan screenshot **tidak boleh** memuat data pribadi nyata klien. Gunakan data sintetis atau anonim.
- Tentukan retensi data di PRD (berapa lama disimpan dan cara penghapusan). Hapus data yang melewati retensi.
- Backup memuat PII: simpan terenkripsi dengan akses terbatas.

### 5.3 Kepatuhan UU PDP (UU No. 27 Tahun 2022)

Untuk aplikasi yang memproses data pribadi pengguna di Indonesia, minimal siapkan:

- Kebijakan privasi yang menjelaskan data yang dikumpulkan, tujuan, dasar pemrosesan, dan retensi.
- Persetujuan (consent) yang eksplisit dan dapat dibuktikan bila dasar pemrosesannya persetujuan.
- Mekanisme hak subjek data: akses, koreksi, dan penghapusan data.
- Prosedur pemberitahuan kegagalan pelindungan data kepada subjek data dan lembaga yang berwenang dalam batas waktu yang ditentukan undang-undang (lihat `docs/incident-response.md`).

Ini bukan nasihat hukum. Klien atau konsultan hukum klien bertanggung jawab menilai kewajiban spesifik; StackPlus menyediakan kemampuan teknisnya.

---

## 6. HTTP, CORS, dan infrastruktur

- **WAJIB** Helmet aktif; tambahkan header HSTS di production.
- **WAJIB** CORS memakai whitelist origin dari `FRONTEND_URL`. **DILARANG** `*` bersama `credentials: true`; **DILARANG** menerima origin dinamis tanpa validasi.
- **WAJIB** `trust proxy` dikonfigurasi benar saat API berada di belakang reverse proxy atau PaaS, agar rate limit membaca IP klien asli dan bukan IP proxy. **Verifikasi**.
- Rate limit global 100 permintaan per menit per IP; sesuaikan untuk endpoint mahal.
- Aplikasi web menerapkan Content-Security-Policy yang sesuai kebutuhan; kecualikan hanya sumber yang benar-benar dipakai.
- Container API berjalan sebagai non-root (`node`) dan memiliki `HEALTHCHECK`.
- Endpoint health tidak membuka detail internal (versi, string koneksi, stack). Pisahkan **liveness** (tanpa database) dan **readiness** (dengan database) agar gangguan database sesaat tidak memicu restart berulang. **Verifikasi**.
- Port database tidak dibuka ke publik; gunakan allowlist IP atau jaringan privat bila provider mendukung.

---

## 7. Supply chain dan dependensi

- Lockfile di-commit; CI memakai `--frozen-lockfile`.
- `pnpm audit` level `high` ke atas gagal membuat gate keamanan menjadi merah dan ditangani sesuai tabel SLA.
- Aktifkan pembaruan otomatis (Dependabot atau Renovate) untuk keamanan dan minor/patch.
- Periksa paket baru sebelum ditambahkan: reputasi, jumlah maintainer, skrip `postinstall`, dan riwayat kerentanan.
- Gunakan runtime Node dengan status LTS yang masih didukung. Periksa jadwal rilis Node.js dan perbarui versi di CI, Dockerfile, dan dokumen jika sudah mendekati akhir dukungan.
- Pembaruan image dasar Docker berkala; Trivy image scan harus lolos.

**SLA perbaikan kerentanan** (sejak diketahui; sesuaikan dengan kontrak):

| Severity | Batas waktu |
|---|---|
| Critical (dan terbukti dapat dieksploitasi) | 24 jam |
| High | 7 hari |
| Medium | 30 hari |
| Low | Dijadwalkan bersama pembaruan rutin |

Pengecualian (`.trivyignore`, allowlist Gitleaks) **WAJIB** disertai alasan, pemilik, dan tanggal tinjau ulang di komentar baris.

---

## 8. Audit log

Catat peristiwa berikut (siapa, apa, kapan, dari mana, hasil; tanpa data sensitif):

- Login berhasil dan gagal, logout, perubahan password.
- Pembuatan, perubahan role, dan penghapusan pengguna.
- Akses atau ekspor data sensitif dalam jumlah besar.
- Perubahan konfigurasi dan izin penting.
- Penolakan otorisasi (`403`) yang berulang.

Audit log bersifat append-only, disimpan terpisah dari log aplikasi, dan retensinya ditentukan di PRD. Detail teknis ada di `docs/observability.md`.

---

## 9. Kredensial pihak ketiga

- Simpan hanya di secret store platform (`docs/env-and-secrets.md`).
- Gunakan akun layanan dengan izin minimum dan kunci terpisah per environment.
- Review izin saat anggota tim berganti atau proyek diserahterimakan (`docs/delivery-sop.md`).
- Untuk layanan yang memproses data pribadi klien, pastikan ada perjanjian pemrosesan data atau ketentuan yang setara dengan penyedia.

---

## 10. Checklist keamanan sebelum rilis

- [ ] Semua endpoint baru: guard, role, pemeriksaan kepemilikan, DTO, dan test 401/403/IDOR.
- [ ] Tidak ada secret atau PII di kode, log, atau repository (Gitleaks bersih).
- [ ] `pnpm audit` dan Trivy tanpa temuan High/Critical yang belum ditangani atau dikecualikan dengan alasan.
- [ ] CORS, cookie, HTTPS, dan `trust proxy` diuji di staging.
- [ ] Alur login, refresh, dan logout diuji end-to-end di domain staging.
- [ ] Health endpoint tidak membocorkan informasi.
- [ ] Backup dan prosedur restore teruji (`docs/deployment.md` bagian 7).
- [ ] Kebijakan privasi, consent, dan retensi sesuai PRD (jika memproses data pribadi).
