# AGENTS.md — Aturan Tetap StackPlus Studio

Dokumen ini dibaca pertama oleh AI Agent dan developer sebelum mengubah apa pun di repository ini. Isinya sengaja pendek; detail ada di dokumen yang ditautkan.

**Prinsip:** One Studio. One Design Language. Different Product Experiences.

---

## 1. Konteks

Repository ini berasal dari StackPlus Studio Core Engine: monorepo `pnpm` + Turborepo.

| Bagian | Teknologi |
|---|---|
| `apps/web` | Next.js 16 (App Router), Tailwind CSS v4 |
| `apps/api` | NestJS 11 |
| `packages/database` | Prisma 5 + PostgreSQL |
| Pengujian | Jest, Supertest, Playwright, k6 |
| CI/CD | GitHub Actions (`ci.yml`, `security.yml`) |

Versi dan struktur di atas tercatat dari dokumentasi. **Periksa repository aktual** sebelum mengasumsikan masih sama.

---

## 2. Dokumen yang wajib dibaca

Baca sesuai jenis pekerjaan. Jika dokumen dan kode berbeda, jangan menebak: laporkan perbedaannya.

| Jenis pekerjaan | Baca |
|---|---|
| **Semua pekerjaan** | `PRD.md` (scope), `docs/architecture.md`, `docs/coding-standards.md`, `docs/security-rules.md` |
| UI / frontend | `docs/ui.md` (UI System V3) |
| Database / model baru | `docs/database-standards.md` |
| Environment / secret | `docs/env-and-secrets.md` |
| Memulai proyek baru | `docs/newproject.md`, `docs/prd-template.md` |
| Melanjutkan pekerjaan orang lain | `docs/handover.md` |
| Testing | `docs/testing-runbook.md`, `docs/perf-testing.md` |
| CI / security scan | `docs/ci-cd.md`, `docs/security-scanning.md` |
| Rilis dan deployment | `docs/release-process.md`, `docs/deployment.md` |
| Monitoring dan logging | `docs/observability.md` |
| Insiden | `docs/incident-response.md` |
| Serah terima, UAT, perubahan scope, dukungan | `docs/delivery-sop.md`, `docs/uat-and-acceptance.md`, `docs/change-request.md`, `docs/maintenance-and-support.md` |

**Urutan sumber kebenaran:** `PRD.md` (apa yang dibangun) → `docs/ui.md` (tampilan) → `docs/architecture.md` + `docs/coding-standards.md` (cara membangun) → kode aktual.

---

## 3. Aturan utama

### WAJIB

1. Baca `PRD.md` sebelum coding. Jangan menambahkan fitur yang tidak ada di PRD.
2. Periksa kode, komponen, dan token yang sudah ada sebelum membuat yang baru (reuse before create).
3. Pakai token dan komponen UI dari `docs/ui.md`.
4. Semua endpoint terlindungi secara default: `JwtAuthGuard`, `RolesGuard`, dan pemeriksaan kepemilikan data (`assertSelfOrAdmin` atau setara).
5. Semua input backend melalui DTO ber-validasi.
6. Semua panggilan HTTP frontend melalui `@/lib/axios`; semua feedback melalui `react-hot-toast`.
7. Perubahan skema database selalu disertai file migrasi (`docs/database-standards.md`).
8. Semua secret lewat environment variable; update `.env.example` jika menambah variabel.
9. Tambahkan test untuk logika baru dan regression test untuk setiap bug yang diperbaiki.
10. Jalankan quality gate (bagian 4) dan pastikan hijau sebelum menyatakan selesai.
11. Tanyakan konfirmasi jika kebutuhan bisnis atau kebijakan akses ambigu.
12. Laporkan hal yang belum bisa diverifikasi (misal tidak ada browser preview, database lokal tidak jalan).

### DILARANG

1. Mengubah arsitektur, tech stack, atau konfigurasi dasar tanpa persetujuan tech lead.
2. Menimpa logika, validasi, atau test yang sudah ada tanpa membaca kode aktualnya.
3. Membuat design system baru, warna hex acak, font baru, atau token yang belum didefinisikan.
4. Memakai `fetch()` langsung di frontend, `alert()`, atau `any` tanpa alasan tertulis.
5. Hardcode secret, URL production, atau data klien di kode, test, atau dokumentasi.
6. Menjalankan test, load test, atau `db push`/`migrate reset` ke database remote atau production.
7. Mem-bypass guard keselamatan (`test-safety.guard.ts`, `perf/k6/lib/safety.js`) atau menurunkan threshold coverage demi lolos gate.
8. Menambah dependency baru hanya untuk detail kecil; setiap dependency baru harus punya alasan.
9. Mengubah business logic untuk memperbaiki tampilan.
10. Menggunakan data dummy yang tampak seperti data nyata pada hasil akhir.
11. Commit langsung ke `main`.

---

## 4. Quality gate

Jalankan dari root repository. Semua harus hijau sebelum pekerjaan dinyatakan selesai.

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm typecheck
pnpm lint
pnpm test:cov
pnpm test:e2e      # butuh Postgres lokal (docs/testing-runbook.md)
pnpm build
```

Jika menyentuh alur UI utama, jalankan juga `pnpm --filter web test:e2e` (Playwright). Gate yang tidak bisa dijalankan harus dilaporkan, bukan dilewati diam-diam.

---

## 5. Cara bekerja

1. **Understand** — tujuan, pengguna, dan scope dari PRD.
2. **Inspect** — dokumen terkait, kode, komponen, token, dan pola yang ada.
3. **Plan** — buat rencana singkat; tentukan perubahan sekecil mungkin.
4. **Implement** — ikuti `docs/coding-standards.md` dan `docs/ui.md`.
5. **Validate** — quality gate, uji interaksi, cek mobile dan desktop.
6. **Report** — ringkas apa yang diubah, apa yang diuji, dan apa yang belum terverifikasi.

Jika standar belum mencakup kebutuhan: cari token/komponen/pola yang ada, gunakan yang terdekat, dan jika tidak cukup usulkan ekstensi kecil beserta alasannya. Jangan memperluas sistem secara diam-diam.

---

## 6. Format laporan akhir

```text
Ringkasan   : apa yang dikerjakan (1–3 kalimat)
File diubah : daftar file penting
Pengujian   : gate yang dijalankan + hasilnya
Belum diverifikasi : hal yang tidak bisa dicek, dan alasannya
Keputusan/asumsi   : hal yang perlu dikonfirmasi
```
