# Database Standards — StackPlus Studio

**Versi:** 1.0 · **Berlaku untuk:** `packages/database` (Prisma 5 + PostgreSQL)
**Terkait:** `docs/architecture.md`, `docs/coding-standards.md`, `docs/deployment.md` (bagian 7), `docs/env-and-secrets.md`

Jika skema existing memakai konvensi berbeda, ikuti yang existing dan catat. Konvensi bagian 2 berlaku untuk model baru dan proyek baru.

---

## 1. Prinsip

1. Skema adalah kontrak: ubah dengan hati-hati, selalu lewat migrasi yang di-review.
2. Data hilang tidak bisa dipulihkan dengan perbaikan kode. Rancang perubahan agar dapat dibalik.
3. Database lokal, test, staging, dan production terpisah (`docs/env-and-secrets.md`).

---

## 2. Penamaan dan tipe

| Hal | Aturan |
|---|---|
| Model | `PascalCase`, tunggal (`User`, `CourseModule`) |
| Field | `camelCase` |
| Tabel dan kolom di database | Pilih satu pendekatan di awal proyek dan catat di PRD: default Prisma, atau `@@map`/`@map` ke `snake_case` jamak. **Jangan campur** |
| Primary key | `String @id @default(uuid())` |
| Timestamp | **WAJIB** `createdAt DateTime @default(now())` dan `updatedAt DateTime @updatedAt` pada setiap model |
| Nilai tetap (role, status) | Gunakan `enum`, bukan string bebas |
| Uang | `Int`/`BigInt` untuk Rupiah bulat; `Decimal` bila butuh pecahan. **DILARANG** `Float` untuk uang |
| Waktu | Disimpan sebagai `DateTime` UTC; konversi zona waktu hanya saat ditampilkan |
| Boolean | `isActive`, `hasX` |
| Relasi | **WAJIB** `onDelete` yang eksplisit dan disengaja (`Cascade`, `Restrict`, atau `SetNull`) |

### 2.1 Index dan constraint

- **WAJIB** index pada foreign key dan pada kolom yang sering dipakai filter atau sort.
- **WAJIB** `@unique` atau `@@unique` untuk aturan keunikan bisnis (misal email), bukan hanya validasi aplikasi.
- Index komposit mengikuti urutan kolom pada query nyata. Hindari index berlebihan; tiap index memperlambat penulisan.
- Kolom wajib diberi `NOT NULL` (tanpa `?`) kecuali memang boleh kosong.

### 2.2 Soft delete

| Jenis data | Penghapusan |
|---|---|
| Transaksi, keuangan, karyawan, data yang butuh riwayat atau audit | Soft delete (`deletedAt DateTime?`) — semua query default memfilter `deletedAt: null` |
| Data sementara atau non-esensial | Hard delete |
| Data pribadi yang diminta dihapus (UU PDP) | Hapus atau anonimkan sesuai retensi di PRD |

Tetapkan kebijakan per entitas di PRD.

### 2.3 Multi-tenant

Jika produk melayani banyak organisasi dalam satu database, putuskan di PRD: setiap tabel tenant memiliki `tenantId`, dan **setiap** query di service difilter dengan `tenantId` pengguna. Tambahkan test isolasi antar-tenant.

---

## 3. Alur migrasi

```text
ubah schema.prisma
   → prisma migrate dev --name <deskripsi-singkat>   (lokal)
   → commit schema + folder migrations
   → PR → CI menjalankan prisma migrate deploy ke DB test
   → staging: prisma migrate deploy
   → production: prisma migrate deploy (setelah backup)
```

| Perintah | Boleh dipakai di | Catatan |
|---|---|---|
| `prisma migrate dev` | Lokal | Membuat file migrasi |
| `prisma migrate deploy` | CI, staging, production | Satu-satunya cara menerapkan skema di luar lokal |
| `prisma db push` | **Hanya** lokal untuk prototipe sementara | Tidak membuat riwayat; **DILARANG** di staging/production. Sebelum PR, ganti dengan migrasi sungguhan |
| `prisma migrate reset` | **Hanya** database lokal/test | Menghapus semua data |

Perintah dijalankan lewat package database, misal `pnpm --filter @cahyodev/database exec prisma migrate deploy` (nama scope akan diganti pada proyek klien; lihat `docs/delivery-sop.md`).

> **Catatan konsistensi:** `docs/newproject.md` saat ini memakai `pnpm db:push` untuk model baru. Karena CI menjalankan `migrate deploy`, model baru tanpa file migrasi tidak akan ada di database CI dan production. Perbarui `newproject.md` agar memakai `migrate dev`.

### 3.1 Aturan migrasi

- **DILARANG** mengedit migrasi yang sudah diterapkan di environment manapun; buat migrasi baru.
- **WAJIB** review isi SQL migrasi di PR (terutama `DROP`, `ALTER TYPE`, `NOT NULL` baru, dan perubahan default).
- **WAJIB** backup sebelum migrasi production (`docs/deployment.md` bagian 7).
- **WAJIB** diuji pada staging dengan data yang menyerupai production sebelum rilis.
- Satu migrasi, satu tujuan; nama deskriptif (`add-course-module`, bukan `update`).

### 3.2 Perubahan destruktif: expand → migrate → contract

Menghapus kolom/tabel, mengganti nama, atau mengubah tipe **tidak** dilakukan dalam satu rilis. Gunakan tiga tahap:

1. **Expand:** tambahkan kolom/tabel baru (nullable atau punya default); aplikasi lama tetap berjalan.
2. **Migrate:** deploy aplikasi yang menulis ke keduanya/ke yang baru; isi ulang data lama (backfill) dengan skrip terkontrol.
3. **Contract:** rilis berikutnya setelah stabil, hapus kolom/tabel lama.

Menambah kolom `NOT NULL` pada tabel berisi data harus punya default atau backfill terlebih dahulu.

---

## 4. Aturan query

- **WAJIB** paginasi pada query multi-baris: `take` default 20, maksimum 100, plus `skip`; kembalikan `total`, `page`, `limit`, `totalPages`.
- **WAJIB** `select`/`include` eksplisit; jangan mengembalikan seluruh baris (terutama hash password) secara default.
- Hindari N+1: ambil relasi dengan `include`/`select` atau satu query `in`.
- **WAJIB** `prisma.$transaction` untuk penulisan multi-tabel.
- Operasi besar (impor, backfill) dijalankan dalam batch dan di luar jam sibuk.
- Raw SQL hanya dengan parameter (`Prisma.sql`/tagged template), setelah review.
- Gunakan koneksi pooled untuk runtime dan koneksi direct hanya untuk migrasi. Awasi batas koneksi provider.

---

## 5. Seed data

| Jenis | Lokasi | Aturan |
|---|---|---|
| Seed pengembangan | `packages/database/prisma/seed.ts` | Data sintetis; hanya dijalankan di lokal/staging |
| Data referensi | Migrasi atau seed idempotent | Aman dijalankan berulang (`upsert`) |
| Bootstrap production | Skrip terpisah sekali jalan | Lihat bagian 6 |

**DILARANG** data klien nyata atau PII nyata pada seed.

---

## 6. Bootstrap admin pertama

Role default pengguna baru adalah `USER`, sehingga admin pertama dibuat lewat prosedur terkontrol:

1. Skrip sekali jalan (`prisma/bootstrap-admin.ts`) membaca email dari argumen atau env sementara.
2. Password dibuat acak atau dimasukkan interaktif; **DILARANG** password tetap di kode atau `.env.example`.
3. Akun ditandai wajib ganti password saat login pertama.
4. Jalankan hanya oleh pihak yang berwenang; catat pelaksanaannya.
5. Hapus env sementara setelah selesai.

---

## 7. Backup dan restore

Prosedur teknis ada di `docs/deployment.md` bagian 7. Aturan tetap:

- Backup otomatis aktif di production dengan retensi sesuai kontrak.
- **Uji restore** ke database staging minimal setiap 3 bulan dan sebelum perubahan skema besar. Backup yang belum pernah diuji dianggap belum ada.
- Backup disimpan terenkripsi dengan akses terbatas karena memuat PII.
- Catat target RPO/RTO proyek di PRD.

---

## 8. Checklist PR perubahan skema

- [ ] File migrasi dibuat dengan `migrate dev` dan dikomit bersama `schema.prisma`.
- [ ] SQL migrasi sudah di-review; tidak ada perubahan destruktif dalam satu rilis.
- [ ] `onDelete`, index, dan constraint unik sudah dipertimbangkan.
- [ ] `createdAt` dan `updatedAt` ada; enum dipakai untuk nilai tetap.
- [ ] Query baru berpaginasi dan memakai `select` eksplisit.
- [ ] Diuji di staging; rencana rollback jelas (`docs/release-process.md`).
- [ ] Dokumentasi/PRD diperbarui bila model bisnis berubah.
