# Coding Standards — StackPlus Studio

**Versi:** 1.0 · **Berlaku untuk:** `apps/api`, `apps/web`, `packages/*`
**Terkait:** `AGENTS.md`, `docs/architecture.md`, `docs/security-rules.md`, `docs/database-standards.md`, `docs/ui.md`

Kekuatan aturan: **WAJIB** (tidak boleh dilanggar tanpa alasan tertulis), **DILARANG**, **DISARANKAN** (default; boleh menyimpang dengan alasan).

Jika kode existing sudah memakai konvensi berbeda, ikuti konvensi existing di file tersebut dan laporkan, jangan campur dua gaya dalam satu modul.

---

## 1. Prinsip

1. Solusi paling sederhana yang memenuhi kebutuhan PRD.
2. Kode dibaca lebih sering daripada ditulis: nama jelas lebih baik daripada komentar.
3. Satu tanggung jawab per file, fungsi, dan komponen.
4. Reuse before create: cari yang sudah ada sebelum menulis yang baru.
5. Jangan mengubah kontrak publik (endpoint, bentuk respons, skema) tanpa versioning dan persetujuan.

---

## 2. Penamaan

| Objek | Konvensi | Contoh |
|---|---|---|
| File dan folder | `kebab-case` | `create-user.dto.ts`, `user-table.tsx` |
| File NestJS | `nama.jenis.ts` | `users.service.ts`, `jwt-auth.guard.ts` |
| Class, komponen React, tipe | `PascalCase` | `UsersService`, `UserTable`, `CreateUserDto` |
| Variabel, fungsi, properti | `camelCase` | `currentUser`, `findAll` |
| Konstanta dan env var | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE`, `DATABASE_URL` |
| Endpoint REST | `kebab-case`, jamak | `GET /users`, `POST /course-modules` |
| Model Prisma | `PascalCase`, tunggal | `User`, `CourseModule` |
| Boolean | awalan `is`, `has`, `can` | `isActive`, `hasAccess` |

DILARANG: singkatan yang tidak umum (`usrSvc`), nama generik (`data2`, `temp`, `handleClick2`).

---

## 3. TypeScript

- **WAJIB** `strict` mode aktif; `pnpm typecheck` harus 0 error.
- **DILARANG** `any`. Pakai `unknown` lalu persempit tipe. Jika benar-benar terpaksa, beri komentar `// any: <alasan>`.
- **DILARANG** `@ts-ignore`. Gunakan `@ts-expect-error` dengan alasan, hanya jika tidak ada alternatif.
- **DILARANG** non-null assertion (`!`) pada data dari luar (request, database, env).
- **DISARANKAN** tipe eksplisit untuk fungsi yang diekspor dan untuk props komponen.
- **DISARANKAN** `import type` untuk impor yang hanya berupa tipe.
- Tipe yang dipakai di `web` dan `api` sekaligus ditempatkan di package bersama (`packages/*`), tidak disalin.

---

## 4. Backend (`apps/api`)

### 4.1 Struktur modul

Setiap fitur adalah satu modul: `module`, `controller`, `service`, `dto/`, dan test. Modul `users` adalah blueprint; modul baru dibuat dengan `npx @nestjs/cli g resource <nama>` lalu **dilengkapi** sesuai checklist 4.6.

| Lapisan | Tanggung jawab | Larangan |
|---|---|---|
| Controller | Routing, guard, validasi lewat DTO, memanggil service | Logika bisnis, akses Prisma langsung |
| Service | Logika bisnis, transaksi, akses database | Mengetahui objek HTTP (`req`, `res`) |
| DTO | Bentuk dan validasi input/output | Logika |
| Guard | Autentikasi dan otorisasi | Logika bisnis |

### 4.2 Validasi dan konfigurasi

- **WAJIB** semua body, query, dan param melalui DTO `class-validator`. Pipeline `whitelist` dan `forbidNonWhitelisted` tetap aktif.
- **WAJIB** konfigurasi dibaca lewat `ConfigService` (`getOrThrow` untuk nilai wajib). **DILARANG** `process.env` di kode bisnis.
- **WAJIB** DTO respons yang tidak memuat field sensitif (hash password, token).

### 4.3 Kontrak API

Jika kontrak existing berbeda, ikuti yang existing dan catat di PR; aturan di bawah berlaku untuk endpoint baru.

**Respons sukses**

```json
{ "data": { }, "meta": { "total": 134, "page": 1, "limit": 20, "totalPages": 7 } }
```

`meta` hanya ada pada daftar berpaginasi. Nama field paginasi: `total`, `page`, `limit`, `totalPages`.

**Respons error**

```json
{
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "Masukkan alamat email yang valid.",
  "details": [{ "field": "email", "message": "Masukkan alamat email yang valid." }],
  "requestId": "b1c2..."
}
```

- `code` adalah kode stabil berbentuk `UPPER_SNAKE_CASE` yang dipakai frontend; `message` boleh berubah.
- **DILARANG** mengirim stack trace atau pesan internal (SQL, path) ke klien.
- Kode HTTP: `400` validasi, `401` belum login, `403` tidak berhak, `404` tidak ditemukan, `409` konflik (misal duplikat), `422` aturan bisnis ditolak, `429` rate limit, `5xx` kesalahan server.
- **WAJIB** paginasi pada semua query multi-baris: default 20, maksimum 100.
- Perubahan yang merusak kompatibilitas memakai versi (`/v2/...`) atau ditambah secara kompatibel (field baru opsional).

### 4.4 Database dan transaksi

- Operasi yang menulis lebih dari satu tabel **WAJIB** memakai `prisma.$transaction`.
- **WAJIB** `select` atau `include` yang eksplisit; hindari mengambil seluruh kolom bila tidak perlu dan hindari query dalam loop (N+1).
- Aturan skema dan migrasi ada di `docs/database-standards.md`.

### 4.5 Logging dan error

- Gunakan `Logger` NestJS, bukan `console.log`. Aturan isi log ada di `docs/observability.md`.
- Lempar exception NestJS yang sesuai (`NotFoundException`, `ConflictException`, dst.), bukan `throw new Error()` mentah ke lapisan controller.
- **DILARANG** menelan error (`catch {}` kosong).

### 4.6 Checklist modul baru

- [ ] Skema Prisma + migrasi sudah dibuat dan di-review.
- [ ] `@UseGuards(JwtAuthGuard, RolesGuard)` dan `@Roles(...)` sesuai matriks role di PRD.
- [ ] Pemeriksaan kepemilikan data (IDOR) pada setiap endpoint ber-`:id`.
- [ ] DTO create, update, dan respons; tidak ada field sensitif di respons.
- [ ] Paginasi pada daftar (default 20, maks 100).
- [ ] Unit test service dan guard; e2e untuk 401, 403, 400, dan kasus IDOR.
- [ ] Rate limit tambahan bila endpoint sensitif (login, reset password, OTP).

---

## 5. Frontend (`apps/web`)

- **WAJIB** panggilan API lewat `@/lib/axios`. **DILARANG** `fetch()` langsung dan **DILARANG** `alert()`; pakai `react-hot-toast`.
- **WAJIB** UI mengikuti `docs/ui.md`: token, ukuran komponen, state loading/empty/error, microcopy Bahasa Indonesia.
- **DISARANKAN** Server Component sebagai default; `"use client"` hanya untuk komponen yang membutuhkan interaksi atau hook browser.
- Halaman yang membutuhkan login berada di bawah `/dashboard/...` agar tercakup oleh `proxy.ts`. Jika memakai route group lain, perluas matcher proxy dan tambahkan test. Proxy bukan pengganti otorisasi di backend.
- **WAJIB** setiap halaman data memiliki state loading (skeleton), kosong, dan error.
- **WAJIB** validasi form di klien untuk pengalaman pengguna; validasi di server tetap sumber kebenaran.
- **Pemetaan error API ke teks UI:** frontend memetakan `code` dari respons error ke pesan di satu berkas (misal `lib/error-messages.ts`). Jika `code` tidak dikenal, tampilkan `Terjadi kesalahan. Silakan coba lagi.` Jangan menampilkan `message` server mentah untuk error 5xx.
- **DILARANG** menyimpan token atau data sensitif di `localStorage`/`sessionStorage` (lihat `docs/security-rules.md`).
- **DILARANG** menaruh secret di variabel `NEXT_PUBLIC_*`.
- Komponen: satu file satu komponen utama; pecah jika melebihi ±200 baris atau menangani lebih dari satu tanggung jawab.
- Format angka, mata uang, dan tanggal memakai `Intl` sesuai `docs/ui.md` bagian 13.6, bukan string manual.

---

## 6. Testing

| Perubahan | Test minimal |
|---|---|
| Logika service/util baru | Unit test (kasus normal, batas, error) |
| Endpoint baru | E2E: sukses, 400, 401, 403, dan IDOR bila ada `:id` |
| Bug diperbaiki | Regression test yang gagal sebelum perbaikan |
| Alur UI utama | Playwright smoke |

- **DILARANG** menurunkan threshold coverage (70%), melewati test (`.skip`, `.only` yang tertinggal), atau mem-bypass guard keselamatan test.
- Test tidak boleh bergantung pada urutan eksekusi atau data produksi.
- Nama test menjelaskan perilaku: `menolak update profil milik user lain`.

---

## 7. Git

**Branch:** `feat/<ringkas>`, `fix/<ringkas>`, `chore/<ringkas>`, `docs/<ringkas>`, `refactor/<ringkas>`, `hotfix/<ringkas>`.

**Commit:** Conventional Commits.

```text
feat(users): tambah filter role pada daftar pengguna
fix(auth): tolak refresh token yang sudah kedaluwarsa
chore(deps): perbarui prisma ke 5.22.x
```

**Pull request**
- **WAJIB** lewat PR; **DILARANG** commit langsung ke `main`. Branch `main` wajib memerlukan check CI hijau dan minimal satu review (aktifkan di pengaturan GitHub).
- PR kecil dan fokus pada satu tujuan; sertakan ringkasan, cara menguji, dan screenshot untuk perubahan UI.
- Merge dengan squash agar riwayat `main` bersih.

**Template PR (ringkas)**

```markdown
## Ringkasan
## Cara menguji
## Dampak (skema DB / env baru / breaking change)
- [ ] Quality gate hijau
- [ ] Migrasi di-review (jika ada)
- [ ] `.env.example` diperbarui (jika ada)
- [ ] Dokumentasi diperbarui (jika standar berubah)
```

---

## 8. Komentar dan dokumentasi

- Komentar menjelaskan **mengapa**, bukan **apa**.
- **DILARANG** kode yang dikomentari dibiarkan di repository.
- `TODO` harus berbentuk `// TODO(#123): ...` dengan referensi isu.
- Perubahan perilaku publik (endpoint, env var, skema) memperbarui dokumentasi terkait di PR yang sama.

---

## 9. Dependency

- Tambahkan dependency hanya jika: ada kebutuhan di PRD, tidak bisa diselesaikan stack yang ada dengan wajar, library terawat (rilis dalam 12 bulan terakhir), dan lisensi kompatibel dengan penggunaan komersial.
- **WAJIB** `pnpm install --frozen-lockfile` di CI; lockfile selalu di-commit.
- Cantumkan alasan di PR untuk setiap dependency baru.
- Pembaruan dependensi dan penanganan CVE mengikuti `docs/security-rules.md` bagian 9.

---

## 10. Checklist code review

- [ ] Sesuai PRD dan tidak menambah fitur di luar scope.
- [ ] Mengikuti arsitektur dan konvensi (bagian 2–5).
- [ ] Otorisasi dan IDOR diperiksa; tidak ada secret atau PII di kode atau log.
- [ ] Error ditangani; state loading/kosong/error tersedia di UI.
- [ ] Test memadai dan gate hijau.
- [ ] Tidak ada duplikasi yang seharusnya reuse; tidak ada dependency baru tanpa alasan.
- [ ] UI mengikuti `docs/ui.md` (token, ukuran, a11y dasar, responsive).
