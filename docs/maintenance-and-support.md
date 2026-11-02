# Pemeliharaan dan Dukungan — StackPlus Studio

**Versi:** 1.0
**Terkait:** `docs/change-request.md`, `docs/security-rules.md`, `docs/incident-response.md`, `docs/delivery-sop.md`, `docs/observability.md`

Angka masa garansi, jam kerja, dan SLA adalah **default**; nilai yang berlaku tertulis di kontrak proyek dan menggantikan angka di sini.

---

## 1. Cakupan

| Kategori | Cakupan | Biaya |
|---|---|---|
| **Garansi bug** | Perbaikan bug (hasil kerja tidak sesuai PRD yang disetujui) selama **30 hari** sejak berita acara serah terima | Termasuk dalam proyek |
| **Pemeliharaan rutin** | Pembaruan dependensi, patch keamanan, uji restore, pemantauan | Sesuai paket pemeliharaan (bagian 6) |
| **Dukungan insiden** | Penanganan gangguan produksi | Sesuai paket; selama garansi untuk bug |
| **Fitur baru / perubahan** | Apa pun di luar PRD | Melalui `docs/change-request.md` |

### Bukan bug (di luar garansi)

- Permintaan fitur baru atau perubahan perilaku yang disetujui di PRD.
- Masalah akibat perubahan oleh pihak lain pada kode, konfigurasi, atau infrastruktur setelah serah terima.
- Kerusakan akibat data yang diubah langsung di database tanpa prosedur.
- Gangguan dari penyedia pihak ketiga (hosting, email, pembayaran), kecuali integrasinya salah.
- Masalah pada browser/perangkat di luar daftar yang disepakati di PRD.
- Biaya langganan layanan pihak ketiga.

---

## 2. Tingkat keparahan dan SLA

| Severity | Definisi | Respons awal | Target mitigasi/workaround | Target perbaikan tuntas |
|---|---|---|---|---|
| **S1 – Kritis** | Sistem down, data hilang/salah, celah keamanan aktif | ≤ 2 jam | ≤ 8 jam | ≤ 3 hari kerja |
| **S2 – Tinggi** | Fitur utama rusak, ada workaround sulit | ≤ 8 jam kerja | ≤ 2 hari kerja | ≤ 5 hari kerja |
| **S3 – Sedang** | Fitur sebagian bermasalah, ada workaround | ≤ 2 hari kerja | – | ≤ 10 hari kerja |
| **S4 – Rendah** | Kosmetik atau perbaikan kecil | ≤ 5 hari kerja | – | Dijadwalkan di rilis berikutnya |

- **Jam kerja default:** Senin–Jumat, 09.00–17.00 WIB, di luar libur nasional. Dukungan di luar jam kerja (terutama S1) hanya jika tercantum di paket.
- Waktu respons dihitung sejak tiket lengkap diterima lewat kanal resmi.
- S1 mengikuti alur `docs/incident-response.md`.

---

## 3. Kanal dan format laporan

- Gunakan **satu kanal resmi** untuk laporan (email dukungan, formulir, atau issue tracker), bukan pesan pribadi. Laporan S1 boleh disertai panggilan/WhatsApp ke kontak darurat yang disepakati.
- Setiap laporan memuat:

```markdown
**Pelapor / kontak :**
**Severity usulan :**
**Ringkasan :**
**Langkah mereproduksi :**
**Hasil yang diharapkan vs terjadi :**
**Waktu kejadian (WIB) dan frekuensi :**
**Bukti :** screenshot / rekaman / pesan error
**Dampak :** jumlah pengguna / fungsi bisnis yang terdampak
```

- StackPlus mengonfirmasi penerimaan, menetapkan severity final, dan memberi perkiraan waktu.

---

## 4. Alur penanganan tiket

1. **Terima dan konfirmasi** — catat ID tiket, tetapkan severity.
2. **Reproduksi/diagnosa** — periksa log, monitoring, dan rilis terakhir.
3. **Klasifikasi** — bug (garansi), pemeliharaan, atau perubahan (CR).
4. **Perbaikan** — branch `fix/...` atau `hotfix/...`; tulis regression test; ikuti `docs/coding-standards.md`.
5. **Rilis** — sesuai `docs/release-process.md` (jalur hotfix bila mendesak).
6. **Verifikasi** — pelapor mengonfirmasi, tiket ditutup dengan catatan penyebab dan perbaikan.

---

## 5. Pemeliharaan rutin (jadwal tetap)

| Frekuensi | Kegiatan |
|---|---|
| Mingguan | Tinjau hasil `security.yml` dan peringatan monitoring |
| Bulanan | Perbarui dependensi minor/patch; tinjau error dan performa; periksa penggunaan kuota dan biaya layanan |
| Triwulanan | **Uji restore backup** ke staging; tinjau akses dan akun pengguna; tinjau pengecualian scanner (`.trivyignore`, allowlist Gitleaks) |
| Tahunan | Rotasi secret (`docs/env-and-secrets.md`); evaluasi versi Node.js/runtime/major dependency; tinjau retensi data dan kebijakan privasi |
| Sesuai tanggal | Perpanjangan domain dan SSL (pengingat 30 dan 14 hari sebelumnya) |
| Sesuai SLA keamanan | Patch kerentanan: Critical 24 jam, High 7 hari, Medium 30 hari (`docs/security-rules.md` bagian 7) |

Pembaruan **major** (framework, ORM, Node.js) diperlakukan sebagai pekerjaan terjadwal terpisah dengan staging, regression test, dan UAT singkat.

---

## 6. Paket pemeliharaan (opsional, setelah garansi)

| Paket | Isi | Catatan |
|---|---|---|
| **Dasar** | Patch keamanan, pembaruan dependensi bulanan, uji restore triwulanan, laporan bulanan | Respons S1–S2 jam kerja |
| **Standar** | Dasar + monitoring aktif, dukungan S1 lanjutan, kuota jam untuk perbaikan kecil | |
| **Prioritas** | Standar + dukungan S1 di luar jam kerja, kuota jam lebih besar | |

Rincian harga dan batas jam mengikuti penawaran. Tanpa paket, permintaan dikerjakan sebagai pekerjaan terpisah.

---

## 7. Pelaporan

- **Laporan bulanan** (untuk paket berlangganan): ringkasan tiket, insiden, rilis, status keamanan dan dependensi, ringkasan uptime dan performa, rekomendasi.
- Insiden S1/S2 disertai ringkasan pasca-insiden (`docs/incident-response.md` bagian 8).

---

## 8. Akhir masa dukungan

- Pemberitahuan tertulis minimal 30 hari sebelum dukungan berakhir.
- Pastikan dokumentasi dan akses sudah diserahkan sepenuhnya (`docs/delivery-sop.md`); cabut akses StackPlus ke production setelah masa dukungan berakhir kecuali ada kesepakatan lanjutan.
- Aplikasi tanpa pemeliharaan keamanan menanggung risiko kerentanan yang menumpuk; klien diberi tahu secara tertulis.
