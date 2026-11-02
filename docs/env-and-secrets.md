# Environment dan Secrets — StackPlus Studio

**Versi:** 1.0
**Terkait:** `docs/security-rules.md`, `docs/deployment.md`, `docs/testing-runbook.md`, `docs/incident-response.md`

Dokumen ini adalah satu-satunya referensi daftar environment variable. Setiap kali menambah, mengubah, atau menghapus variabel, perbarui dokumen ini dan `.env.example` pada PR yang sama.

---

## 1. Referensi variabel

Daftar disusun dari dokumentasi existing. **Verifikasi** terhadap `.env.example` dan kode sebelum dianggap lengkap.

| Variabel | Dipakai oleh | Wajib | Sifat | Catatan |
|---|---|---|---|---|
| `DATABASE_URL` | api, database | Ya | **Secret** | URL runtime. Produksi memakai pooled connection. Tambahkan parameter pooler sesuai provider dan Prisma (misal `pgbouncer=true` untuk PgBouncer); cek dokumentasi provider |
| `DIRECT_URL` | database (migrasi) | Ya | **Secret** | Koneksi langsung (bukan pooler), dipakai Prisma Migrate |
| `JWT_SECRET` | api | Ya | **Secret** | Penandatangan access token. Aplikasi gagal start jika kosong |
| `JWT_REFRESH_SECRET` | api | Ya | **Secret** | Harus **berbeda** dari `JWT_SECRET` |
| `JWT_EXPIRES_IN` | api | Ya | Konfigurasi | Umur access token (disarankan ≤ 15m) |
| `JWT_REFRESH_EXPIRES_IN` | api | Ya | Konfigurasi | Umur refresh token (contoh 7d) |
| `FRONTEND_URL` | api (CORS) | Ya | Konfigurasi | Origin frontend persis, tanpa trailing slash |
| `NODE_ENV` | api, web | Ya | Konfigurasi | `development`, `test`, `production` |
| `PORT` | api | Tidak | Konfigurasi | Dari platform; fallback lokal 3001 |
| `NEXT_PUBLIC_API_URL` | web | Ya | **Publik** | URL dasar API. Masuk ke bundle browser |

Variabel tambahan proyek (email, storage, pembayaran, monitoring, dll.) **WAJIB** ditambahkan ke tabel ini dengan kolom yang sama.

Sifat variabel:
- **Secret:** tidak boleh ada di repository, log, screenshot, atau chat.
- **Konfigurasi:** tidak sensitif, tetapi tetap tidak di-hardcode.
- **Publik:** pasti terlihat oleh pengguna; **DILARANG** menaruh secret di sini.

---

## 2. Nilai per environment

| Environment | Database | Secret | Catatan |
|---|---|---|---|
| Lokal (dev) | Postgres lokal atau project dev terpisah | Nilai dev, tidak dipakai di tempat lain | `.env` tidak di-commit |
| Test | Postgres lokal container port 5433 | Nilai dummy | `test-safety.guard.ts` memblokir URL remote |
| Staging | Database staging terpisah | Secret khusus staging | Data sintetis, bukan data klien |
| Production | Database produksi | Secret khusus produksi | Akses terbatas (bagian 5) |

**WAJIB:** setiap environment memiliki database dan secret sendiri. **DILARANG** berbagi secret atau database antar environment, dan **DILARANG** berbagi secret antar klien.

---

## 3. Aturan

1. `.env`, `.env.local`, file dump database, dan kunci privat **DILARANG** masuk Git. Pastikan `.gitignore` mencakupnya.
2. `.env.example` **WAJIB** ada, selalu terbarui, hanya berisi placeholder (bukan nilai nyata).
3. Aplikasi memvalidasi variabel wajib saat start (`ConfigModule` + `getOrThrow`) dan **gagal start** jika ada yang kurang. **DILARANG** nilai default untuk secret.
4. Variabel `NEXT_PUBLIC_*` hanya untuk nilai yang aman dilihat publik.
5. Kode bisnis membaca konfigurasi lewat `ConfigService`, bukan `process.env` langsung.
6. Jangan menaruh secret di argumen perintah, nama branch, pesan commit, issue, atau komentar PR.

---

## 4. Membuat secret

Minimal 32 byte acak untuk setiap secret JWT. Contoh generator:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- `JWT_SECRET` dan `JWT_REFRESH_SECRET` dibuat terpisah dan berbeda di tiap environment.
- Kata sandi database memakai generator password manager (≥ 24 karakter acak).

### Template `.env.example`

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/DB?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB"

# Auth
JWT_SECRET="<generate: 32+ byte acak>"
JWT_REFRESH_SECRET="<generate: berbeda dari JWT_SECRET>"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# App
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 5. Penyimpanan dan akses

| Tempat | Isi | Catatan |
|---|---|---|
| Password manager tim (sumber utama) | Semua secret produksi dan akun layanan | Vault per klien; akses berbasis peran |
| Railway Variables / Vercel Environment Variables | Secret runtime | Pisahkan Production, Preview, Development |
| GitHub Actions Secrets | Secret CI (token scan, deploy) | Jangan di-echo di log; hindari memberi secret ke workflow dari fork |

- Akses secret produksi hanya untuk orang yang membutuhkannya (least privilege). Catat daftar pemegang akses per proyek.
- Berbagi kredensial hanya lewat password manager atau kanal terenkripsi; **DILARANG** lewat chat atau email polos.
- Saat anggota tim keluar atau proyek diserahterimakan, cabut akses dan rotasi secret yang pernah diketahui (`docs/delivery-sop.md`).

---

## 6. Rotasi

| Secret | Jadwal | Pemicu rotasi segera |
|---|---|---|
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | 6–12 bulan | Dugaan bocor, anggota tim keluar, serah terima |
| Password database | 12 bulan | Dugaan bocor, serah terima |
| Token API pihak ketiga | Sesuai kebijakan penyedia | Dugaan bocor |

- Merotasi secret JWT mengakhiri sesi yang aktif; jadwalkan dan umumkan bila perlu.
- Urutan rotasi aman: buat secret baru → set di platform → redeploy → verifikasi → hapus secret lama dari semua tempat.
- Jika secret **terdeteksi bocor** (Gitleaks, commit tidak sengaja): ikuti `docs/incident-response.md` bagian kredensial bocor. Menghapus dari repository saja tidak cukup; secret harus dirotasi.

---

## 7. Checklist

- [ ] `.env.example` mencakup semua variabel di tabel bagian 1.
- [ ] Tidak ada nilai nyata di `.env.example`, kode, test, atau dokumentasi.
- [ ] Setiap environment punya database dan secret sendiri.
- [ ] Aplikasi gagal start bila variabel wajib hilang.
- [ ] Tidak ada secret pada `NEXT_PUBLIC_*`.
- [ ] Pemegang akses secret produksi tercatat; jadwal rotasi ditetapkan.
