# Change Request — StackPlus Studio

**Versi:** 1.0
**Terkait:** `PRD.md`, `docs/uat-and-acceptance.md`, `docs/maintenance-and-support.md`

Angka ambang dan tenggat di dokumen ini adalah default; sesuaikan dengan kontrak.

---

## 1. Tujuan

Menjaga scope tetap terkendali setelah PRD disetujui. **Baseline scope adalah versi PRD yang sudah disetujui.** Perubahan terhadap baseline dicatat, dinilai dampaknya, disetujui tertulis, lalu dikerjakan.

---

## 2. Membedakan jenis permintaan

| Jenis | Definisi | Penanganan |
|---|---|---|
| **Bug** | Hasil kerja tidak sesuai PRD yang disetujui | Diperbaiki tanpa biaya tambahan sesuai garansi (`docs/maintenance-and-support.md`) |
| **Klarifikasi** | PRD sudah menjawab; pihak klien belum menemukannya | Dijawab dengan merujuk bagian PRD; tidak ada perubahan |
| **Perubahan (CR)** | Menambah, menghapus, atau mengubah fitur, aturan bisnis, peran, integrasi, atau desain yang disetujui | Mengikuti alur bagian 3 |
| **Penyempurnaan kecil** | Perubahan teks/warna/jarak yang tidak mengubah fungsi, selesai ≤ 2 jam kerja | Boleh tanpa CR formal; dicatat di register dengan tanda "kecil" |

Jika ragu apakah suatu permintaan bug atau perubahan: rujuk acceptance criteria di PRD. Yang tidak tertulis di PRD adalah perubahan.

---

## 3. Alur

1. **Ajukan** — klien atau tim mengajukan perubahan (lewat formulir bagian 4). Satu CR untuk satu perubahan utama.
2. **Catat** — beri ID `CR-001`, masukkan ke register (bagian 6).
3. **Analisis dampak** — StackPlus menilai paling lambat **3 hari kerja**:
   - Fitur dan modul yang terpengaruh, dependensi.
   - Perubahan skema database dan migrasi data.
   - Dampak keamanan, hak akses, dan privasi.
   - Dampak UI (`docs/ui.md`) dan konten.
   - Tambahan pengujian dan UAT ulang.
   - Estimasi waktu, biaya, dan efek pada jadwal/milestone.
4. **Keputusan** — klien menyetujui, menolak, atau menunda secara **tertulis** (email atau tanda tangan). Diam bukan persetujuan.
5. **Perbarui PRD** — naikkan versi PRD (misal 1.0 → 1.1), tambahkan baris di riwayat versi dengan nomor CR, dan perbarui acceptance criteria terkait.
6. **Kerjakan** — baru boleh mulai coding setelah langkah 4 dan 5. Cantumkan nomor CR di branch dan PR (`feat/cr-012-ekspor-excel`).
7. **Verifikasi** — uji dan UAT untuk bagian yang berubah.
8. **Tutup** — status register diperbarui.

**DILARANG** mengerjakan perubahan scope sebelum disetujui tertulis, termasuk "sekalian" saat mengerjakan hal lain.

---

## 4. Formulir CR

```markdown
# CR-[nnn] — [Judul singkat]

**Diajukan oleh :** [nama, pihak]          **Tanggal :** [dd MMM yyyy]
**Alasan / kebutuhan bisnis :**
**Deskripsi perubahan :** (apa yang ditambah/diubah/dihapus)
**Referensi PRD :** [bagian / FR-xxx]
**Prioritas :** Tinggi / Sedang / Rendah        **Tenggat yang diharapkan :**

## Analisis dampak (diisi StackPlus)
- Modul / fitur terpengaruh :
- Perubahan database / migrasi :
- Dampak keamanan / privasi :
- Dampak UI / konten :
- Pengujian tambahan :
- Estimasi usaha : [jam/hari]     Biaya : [Rp]
- Dampak jadwal : [+n hari / tidak ada]
- Risiko / alternatif :

## Keputusan
Disetujui / Ditolak / Ditunda     Tanggal :
Disetujui oleh klien : [nama]     Disetujui oleh StackPlus : [nama]
Versi PRD setelah perubahan : [x.y]
```

---

## 5. Perubahan mendesak

Untuk perubahan yang tidak bisa menunggu (insiden produksi, kewajiban hukum): kerjakan dulu secara minimal, dokumentasikan alasannya, dan ajukan CR retroaktif maksimal **2 hari kerja** setelah selesai. Perbaikan insiden mengikuti `docs/incident-response.md`.

---

## 6. Register CR

| ID | Judul | Diajukan | Dampak (waktu/biaya) | Status | Versi PRD | Tanggal keputusan |
|---|---|---|---|---|---|---|
| CR-001 | | | | Diusulkan / Disetujui / Ditolak / Selesai | | |

CR yang ditolak atau ditunda **tetap dicatat** agar dapat dirujuk kembali. Register disimpan bersama PRD di repository atau ruang kerja bersama.

---

## 7. Aturan tambahan

- Akumulasi perubahan kecil yang menggeser jadwal atau beban kerja signifikan dapat dihimpun menjadi satu CR.
- Perubahan yang memengaruhi keamanan atau privasi wajib ditinjau menggunakan `docs/security-rules.md` sebelum disetujui.
- Setiap CR yang mengubah skema database mengikuti `docs/database-standards.md`.
- Ringkasan CR yang disetujui dilaporkan pada update status berkala ke klien.
