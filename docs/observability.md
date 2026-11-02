# Observability — StackPlus Studio

**Versi:** 1.0
**Terkait:** `docs/security-rules.md`, `docs/incident-response.md`, `docs/release-process.md`, `docs/perf-testing.md`, `docs/maintenance-and-support.md`

Observability memastikan masalah terdeteksi dan dapat didiagnosis sebelum pengguna melapor. Dokumen ini menetapkan **apa** yang wajib ada; pilihan alat (error tracking, uptime, log) ditentukan per proyek dan dicatat di README.

Ambang di dokumen ini adalah titik awal. Sesuaikan setelah ada baseline dari lingkungan nyata dan `docs/perf-testing.md`.

---

## 1. Kebutuhan minimum setiap proyek

| Kemampuan | Wajib sebelum go-live |
|---|---|
| Log aplikasi terstruktur dengan request ID | Ya |
| Error tracking (backend dan frontend) | Ya |
| Uptime monitoring dari luar (cek `/health`) | Ya |
| Alert ke orang yang bertanggung jawab | Ya |
| Metrik dasar: error rate, latensi, resource, koneksi database | Ya |
| Audit log untuk peristiwa keamanan | Ya bila ada login |
| Dashboard ringkas | Disarankan |
| Tracing terdistribusi | Opsional |

Contoh alat (pilih satu per kemampuan): Sentry (error tracking), UptimeRobot/Better Stack (uptime), log bawaan Railway/Vercel atau layanan log terpusat. Pertimbangkan lokasi data, biaya, dan apakah layanan memproses data pribadi (`docs/security-rules.md` bagian 9).

---

## 2. Logging

### 2.1 Aturan

- **WAJIB** log terstruktur (JSON) di production, dengan field minimal: `timestamp` (UTC), `level`, `message`, `context` (modul), `requestId`, dan jika ada `userId` (ID, bukan data pribadi).
- **WAJIB** setiap permintaan memiliki `requestId`. Terima `x-request-id` dari proxy bila ada, atau buat baru; sertakan di log dan di field `requestId` respons error (`docs/coding-standards.md` bagian 4.3).
- Gunakan `Logger` NestJS, bukan `console.log`.
- **DILARANG** mencatat: password, token, secret, header `Authorization`/cookie, nomor identitas, data kartu, isi body permintaan yang memuat PII, atau stack trace yang dikirim ke klien. Terapkan redaksi pada field sensitif.
- Pesan log menjelaskan kejadian dan konteksnya, bukan hanya "error".

### 2.2 Level

| Level | Dipakai untuk | Aktif di production |
|---|---|---|
| `error` | Operasi gagal yang perlu perhatian | Ya |
| `warn` | Situasi tidak normal tetapi tertangani (retry, rate limit tercapai) | Ya |
| `log`/`info` | Peristiwa bisnis penting (startup, rilis, job selesai) | Ya |
| `debug` | Diagnosa rinci | Tidak (aktifkan sementara dan terbatas) |

### 2.3 Retensi

- Log aplikasi: minimal **30 hari**, atau sesuai kebutuhan klien dan regulasi.
- Audit log: sesuai PRD (umumnya lebih panjang, misal 1 tahun); append-only dan terpisah dari log aplikasi.
- Log yang berisi data terkait pengguna mengikuti kebijakan retensi dan hak penghapusan di PRD.

---

## 3. Error tracking

- Backend: tangkap exception yang tidak tertangani dan error 5xx; sertakan `requestId`, rute, dan versi rilis. Jangan kirim body permintaan atau PII ke layanan pihak ketiga.
- Frontend: tangkap error render dan promise rejection; sertakan versi rilis dan rute. Sembunyikan data pribadi (scrubbing).
- **WAJIB** pelacakan versi rilis (`release`) agar error dapat dikaitkan ke deploy tertentu (`docs/release-process.md`).
- Kelompokkan error berulang; tinjau daftar error baru minimal mingguan.
- Error yang diharapkan (validasi 400, tidak login 401) tidak dikirim sebagai error tracking.

---

## 4. Health check dan uptime

| Endpoint | Fungsi | Memeriksa database? |
|---|---|---|
| `GET /health/live` (liveness) | Proses aplikasi hidup | Tidak |
| `GET /health/ready` (readiness) | Siap melayani permintaan | Ya (query ringan) |

- Verifikasi bentuk endpoint di `HealthModule`; dokumentasi existing hanya menyebut `/health`. Jika masih satu endpoint, pisahkan agar gangguan database sesaat tidak membuat platform me-restart container berulang.
- Liveness dipakai oleh orchestrator/PaaS untuk restart; readiness dipakai load balancer dan uptime monitor.
- Respons tidak memuat versi paket, string koneksi, atau detail internal.
- Uptime monitor eksternal memeriksa readiness setiap **1–5 menit** dari luar jaringan platform, plus satu halaman publik frontend.
- Monitor **sertifikat SSL** dan **masa berlaku domain** (peringatan 30 dan 14 hari).

---

## 5. Metrik dan ambang alert

| Metrik | Alert (default) | Level |
|---|---|---|
| Uptime / readiness gagal | 2 pengecekan berturut-turut | SEV1–2 |
| Error rate 5xx | > 2% selama 5 menit | SEV2 |
| Latensi p95 API | > 1 detik selama 10 menit (atau > 2× baseline) | SEV3 |
| Koneksi database | > 80% batas | SEV3 |
| Memori / CPU container | > 85% selama 10 menit | SEV3 |
| Disk database | > 80% | SEV3 |
| Lonjakan login gagal | > 5× rata-rata normal selama 10 menit | SEV2 (indikasi serangan) |
| Error tracking: error baru setelah rilis | Muncul dalam 30 menit pasca-rilis | Tinjau, pertimbangkan rollback |
| Kuota atau biaya layanan | > 80% kuota bulanan | SEV4 |
| Sertifikat / domain | < 14 hari | SEV3 |
| Backup gagal | 1 kali gagal | SEV2 |

Metrik aplikasi yang disarankan: jumlah permintaan per status, latensi per rute (p50/p95/p99), durasi query database yang lambat, jumlah login berhasil/gagal, dan metrik bisnis kunci (misal jumlah transaksi) untuk mendeteksi anomali.

---

## 6. Alert

- **WAJIB** setiap alert memiliki penerima yang jelas dan tindakan pertama (runbook singkat atau tautan ke `docs/incident-response.md`).
- Saluran: kanal yang benar-benar dibaca (WhatsApp/Telegram/email/pager) dengan eskalasi bila tidak ada respons dalam target SLA.
- **Hindari alert bising:** alert yang sering diabaikan harus disetel ulang atau dihapus; tinjau bulanan.
- Pemicu alert dan penerima dicatat per proyek dan diserahkan ke klien saat serah terima (`docs/delivery-sop.md`).

---

## 7. Audit log

Peristiwa dan aturan dasarnya ada di `docs/security-rules.md` bagian 8. Bentuk teknis:

| Field | Isi |
|---|---|
| `timestamp` | UTC |
| `actorId` | ID pengguna pelaku (atau `system`) |
| `action` | Kode stabil, misal `USER_ROLE_CHANGED`, `LOGIN_FAILED` |
| `target` | Jenis dan ID objek |
| `ip`, `userAgent` | Sumber permintaan |
| `result` | `success` / `failure` |
| `requestId` | Untuk korelasi dengan log aplikasi |

Jangan menyimpan password atau token dalam audit log. Perubahan data penting dapat memuat nilai sebelum/sesudah **tanpa** field sensitif.

---

## 8. Frontend dan performa web

- Untuk website marketing, pantau Core Web Vitals (LCP, INP, CLS) dengan alat yang dipilih; target awal: LCP ≤ 2,5 detik, INP ≤ 200 ms, CLS ≤ 0,1 pada persentil ke-75.
- Analytics dan perekaman sesi memerlukan persetujuan pengguna jika memproses data pribadi (`docs/security-rules.md` bagian 5.3) dan tidak mengirim PII.
- Catat versi rilis di bundle agar error frontend dapat dikaitkan ke deploy.

---

## 9. Dashboard dan tinjauan

Dashboard ringkas berisi: status uptime, error rate, latensi p95, koneksi database, rilis terakhir, dan error terbanyak. Tinjau:

- **Setiap rilis:** 30–60 menit pasca-rilis (`docs/release-process.md`).
- **Mingguan:** error baru, alert yang berbunyi, tren latensi.
- **Bulanan:** biaya/kuota, retensi log, kelayakan ambang, laporan ke klien (`docs/maintenance-and-support.md`).

---

## 10. Checklist go-live

- [ ] Log terstruktur dengan `requestId`; tidak ada PII/secret di log (uji sampel).
- [ ] Error tracking aktif di backend dan frontend dengan versi rilis.
- [ ] Liveness dan readiness terpisah; uptime monitor eksternal aktif.
- [ ] Monitor SSL dan domain aktif.
- [ ] Alert terpasang dengan penerima, eskalasi, dan tindakan pertama.
- [ ] Audit log mencatat peristiwa keamanan yang ditentukan.
- [ ] Retensi log ditetapkan dan sesuai PRD.
- [ ] Dashboard dan pemilik tinjauan ditentukan.
