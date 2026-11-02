# STACKPLUS STUDIO — UI SYSTEM V3

**Versi:** 3.0 (final, menggantikan V1 dan V2)
**Cakupan:** Website marketing, dashboard, POS, HRIS, ERP, LMS, CRM, analytics, SaaS, dan aplikasi internal StackPlus Studio.
**Pengguna dokumen:** AI Agent, UI/UX Designer, Developer.

> **Prinsip utama:** One Studio. One Design Language. Different Product Experiences.
>
> Konsistensi ada pada *design language* (identitas, token, komponen, perilaku, aksesibilitas, kualitas), bukan pada keseragaman layout semua halaman.

---

# Daftar Isi

1. Cara Menggunakan Dokumen
2. Filosofi dan Identitas
3. Aturan Keputusan
4. Design Tokens
5. Color System
6. Typography
7. Layout, Density, dan Hierarchy
8. Komponen
9. Page Patterns
10. Navigation
11. Responsive Design
12. Interaction dan UI States
13. Forms dan Data Display
14. Icon dan Imagery
15. Motion
16. Accessibility
17. Content dan Microcopy
18. Implementasi Teknis
19. UI Quality Assurance
20. Anti-Patterns
21. Alur Kerja dan Protokol AI Agent
22. Definition of Done
23. Appendix: Baseline dan Keputusan V3

---

# 1. Cara Menggunakan Dokumen

## 1.1 Prioritas saat aturan bertabrakan

Gunakan urutan ini. Nomor lebih kecil menang.

1. Kebutuhan pengguna dan fungsi produk.
2. Accessibility dan usability.
3. Kejelasan informasi dan visual hierarchy.
4. Konsistensi design system.
5. Identitas visual StackPlus.
6. Estetika dan dekorasi.

Desain yang menarik tetapi sulit digunakan dianggap gagal.

## 1.2 Kekuatan aturan

| Kekuatan | Arti | Berlaku untuk |
|---|---|---|
| **WAJIB** | Tidak diubah tanpa alasan teknis atau keputusan desain | Brand token, skala spacing, radius, type scale, tinggi kontrol, z-index, durasi motion, breakpoint, state, accessibility, microcopy state (loading/empty/error) |
| **KONTEKSTUAL** | Dipilih sesuai jenis halaman dan produk | Lebar container, density, model navigasi, ukuran sidebar, density tabel, motion marketing |
| **BEBAS** | AI/Developer menentukan komposisi terbaik | Komposisi halaman, jumlah kolom, treatment visual marketing, ilustrasi, visualisasi data |

**Aturan deviasi:** nilai WAJIB boleh dilanggar hanya jika bertabrakan dengan prioritas yang lebih tinggi (1.1). Catat alasannya di komentar kode atau deskripsi PR, lalu usulkan perubahan dokumen ini.

## 1.3 Status nilai

| Status | Arti |
|---|---|
| **Baseline** | Tercatat dari UI sebelumnya (warna brand, stack, status utility). Verifikasi terhadap repository sebelum dipakai sebagai keputusan final. |
| **Standar V3** | Ditetapkan di dokumen ini. **Belum tentu sudah ada di codebase.** Implementasikan token atau komponen pendukung lebih dulu sebelum menggunakannya. |
| **(baru)** | Token yang tidak ada di baseline dan ditambahkan oleh V3. |

Jangan mengklaim token, utility, atau komponen tersedia sebelum memeriksa kode aktual. Jika dokumen dan kode berbeda, jangan menebak: identifikasi perbedaannya, tentukan nilai yang benar, lalu sinkronkan keduanya.

---

# 2. Filosofi dan Identitas

## 2.1 Karakter

Modern, clean, professional, warm, confident, approachable, functional. Karakter ini terlihat di website marketing maupun produk.

## 2.2 Lima pertanyaan yang harus terjawab di setiap halaman

1. Saya sedang berada di bagian apa?
2. Informasi apa yang paling penting?
3. Apa yang dapat saya lakukan di sini?
4. Apa yang terjadi setelah saya melakukan tindakan?
5. Bagaimana saya kembali atau memperbaiki kesalahan?

## 2.3 Prinsip

- Clarity over decoration.
- Purpose over convention.
- Content before layout.
- Consistency without uniformity.
- Functional density where the task requires it.
- Perbedaan visual harus menyampaikan makna.

## 2.4 Marketing UI dan Product UI

| Aspek | Marketing UI | Product UI |
|---|---|---|
| Tujuan | Menjelaskan nilai, mendorong ketertarikan | Membantu pengguna menyelesaikan pekerjaan |
| Density | Spacious | Compact sampai comfortable |
| Layout | Editorial, storytelling, showcase | Task-oriented, data-oriented |
| Visual | Ekspresif | Terukur dan fungsional |
| Motion | Boleh untuk storytelling | Singkat, informatif, tidak mengganggu |
| Komponen dominan | Hero, section, showcase, CTA | Navigation, form, table, filter, dialog |
| Prioritas | Brand, pesan, conversion | Efisiensi, kejelasan, akurasi |

Jangan menerapkan pola landing page ke dashboard atau aplikasi operasional.

## 2.5 Product identity

Setiap produk boleh memiliki karakter antarmuka sendiri sesuai pengguna, frekuensi pakai, kompleksitas workflow, volume data, dan perangkat utama.

| Produk | Karakter UI |
|---|---|
| POS | Cepat, jelas, touch-friendly, fokus pada transaksi |
| HRIS | Terstruktur, mudah dipindai, fokus data karyawan dan workflow |
| ERP | Padat, konsisten, kuat pada navigasi dan data |
| LMS | Progres mudah dipahami, konten mudah ditemukan |
| Analytics | Data-first, filter dan perbandingan mudah |
| Marketing | Ekspresif, editorial, conversion-oriented |

**Harus konsisten di semua produk:** brand color dan pemetaan semantic color, font, token (spacing, radius, border, shadow, motion), ukuran komponen, perilaku state, accessibility, kualitas typography dan hierarchy.

**Boleh berbeda:** struktur halaman, komposisi layout, model navigasi, density, jumlah kolom, visualisasi data, workflow spesifik produk, imagery dan ilustrasi.

## 2.6 Logo

- Gunakan aset logo resmi. Jangan ubah proporsi atau tambah efek dekoratif.
- Tinggi di navbar: desktop 28–36px, mobile 24–32px.
- Logo bukan pengganti heading halaman.

---

# 3. Aturan Keputusan

## 3.1 Mulai dari kebutuhan, bukan template

Sebelum memilih layout, tentukan: tujuan halaman, pengguna utama, tugas utama, informasi yang harus terlihat, aksi tersering, kondisi data (sedikit/banyak/kosong/berubah), perangkat dan konteks.

## 3.2 Memilih layout

| Jenis halaman | Pola yang disarankan |
|---|---|
| Landing page | Editorial, hero split, showcase |
| Dashboard | Sidebar + main content |
| POS | Transaction-focused |
| HRIS | Navigation + data workspace |
| ERP | Modular workspace |
| LMS | Learning dashboard |
| Detail data | Structured detail |
| Form | Single-column atau grouped |
| Authentication | Focused, satu tugas |
| Analytics | Filter + KPI + chart |

Pola di atas adalah pilihan, bukan template wajib. Aturan tambahan:

- Satu kolom untuk konten linear, form sederhana, detail yang butuh fokus.
- Dua kolom hanya jika dua kelompok informasi perlu dibandingkan atau dilihat bersamaan.
- Sidebar jika pengguna sering berpindah antarbagian aplikasi.
- Full-width untuk tabel, canvas, visualisasi yang butuh ruang.
- Constrained width untuk form dan teks panjang.
- Split atau asimetris hanya jika ada alasan hierarki atau storytelling.
- Jangan memilih grid hanya karena grid mudah dibuat.

## 3.3 Memilih komponen berdasarkan fungsi

| Kebutuhan | Komponen |
|---|---|
| Informasi ringkas | Text, statistic, badge, list |
| Kumpulan item sejenis | List atau table |
| Data yang dibandingkan | Table atau chart |
| Input sederhana | Form field |
| Pilihan dari banyak opsi | Select atau combobox |
| Konfirmasi tindakan penting | Dialog |
| Detail tambahan dalam konteks halaman | Popover atau drawer |
| Feedback singkat | Toast |
| Feedback yang harus tetap terlihat | Inline alert |

## 3.4 Card

Gunakan card hanya jika pemisahan visual membantu pemahaman atau interaksi: KPI, item produk, ringkasan, form section, widget dashboard, item yang dipindai sebagai unit mandiri.

Hindari card jika cukup heading dan separator, jika card bersarang membingungkan hierarchy, atau jika card tidak memberi informasi atau fungsi tambahan.

## 3.5 Aksi dan CTA

- Satu aksi paling menonjol per konteks tindakan. Area kerja yang independen boleh punya aksi utama masing-masing.
- Aksi sekunder mudah ditemukan tetapi tidak bersaing secara visual.
- Aksi destruktif memakai warna `danger` dan tidak tampil sebagai aksi utama tanpa konteks.
- Jangan menaruh banyak primary CTA yang saling bersaing dalam satu grup.
- Label menjelaskan hasil tindakan (lihat 17.2).

## 3.6 Konsistensi

- Reuse pola jika fungsi dan konteks sama; jangan reuse hanya karena tampilannya mirip.
- Jangan membuat variant tanpa perbedaan fungsi.
- Pola yang dipakai lintas produk dijadikan token atau komponen bersama.

---

# 4. Design Tokens

## 4.1 Aturan token

- Komponen memakai token, bukan nilai mentah (hex, px) yang tersebar.
- Nama token berdasarkan fungsi, bukan hanya warna.
- Jangan membuat token duplikat atau mengarang token yang belum didefinisikan.
- Nilai token harus punya sumber implementasi yang jelas (lihat 18.2).

## 4.2 Spacing

Kelipatan 4px. Angka `space-N` sama dengan utilitas Tailwind `N` (misal `p-4` = 16px). Skala ini hanya untuk padding, margin, dan gap; dimensi kontrol (checkbox 18px, switch, dll.) memakai token sizing di 4.11.

| Token | Nilai | Penggunaan |
|---|---:|---|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Gap ikon-teks kecil |
| `space-1.5` | 6px | Label ke input, padding vertikal tooltip |
| `space-2` | 8px | Gap internal komponen |
| `space-3` | 12px | Compact spacing |
| `space-4` | 16px | Default |
| `space-5` | 20px | Medium |
| `space-6` | 24px | Padding komponen |
| `space-8` | 32px | Section grouping |
| `space-10` | 40px | Grouping besar |
| `space-12` | 48px | Section spacing |
| `space-16` | 64px | Section besar |
| `space-20` | 80px | Marketing |
| `space-24` | 96px | Marketing besar |

Jangan memakai angka di luar skala (13px, 19px, 27px). Jarak antar kelompok informasi harus lebih besar daripada jarak antar elemen dalam satu kelompok.

## 4.3 Radius

| Token | Nilai | Penggunaan |
|---|---:|---|
| `radius-none` | 0 | Square layout |
| `radius-sm` | 4px | Elemen kecil |
| `radius-md` | 8px | Input, select, tooltip, dropdown, popover |
| `radius-lg` | 12px | Button, toast, card kecil |
| `radius-xl` | 16px | Card standar, dialog |
| `radius-2xl` | 24px | Card besar |
| `radius-3xl` | 32px | Container marketing |
| `radius-full` | 9999px | Badge pill, avatar, kontrol bulat |

Radius mengikuti tingkat komponen. Jangan mencampur banyak radius dalam satu kelompok komponen.

> **Perhatian:** skala radius (dan shadow) StackPlus berbeda dari default Tailwind v4 (`rounded-md` = 6px di Tailwind, 8px di StackPlus). Override di `@theme` (lihat 18.3) dan periksa dampaknya pada komponen shadcn sebelum dipakai.

## 4.4 Type scale

Font: Inter. Nilai di bawah cocok dengan default Tailwind kecuali `text-compact` (baru) dan line-height `text-5xl`/`text-6xl`.

| Token | Ukuran / line-height | Weight |
|---|---|---|
| `text-xs` | 12 / 16px | 400–500 |
| `text-compact` (baru) | 13 / 18px | 400–500 |
| `text-sm` | 14 / 20px | 400–500 |
| `text-base` | 16 / 24px | 400 |
| `text-lg` | 18 / 28px | 400–600 |
| `text-xl` | 20 / 28px | 500–600 |
| `text-2xl` | 24 / 32px | 600 |
| `text-3xl` | 30 / 36px | 600–700 |
| `text-4xl` | 36 / 40px | 600–700 |
| `text-5xl` | 48 / 52px | 600–700 |
| `text-6xl` | 60 / 64px | 600–700 |

Penggunaan peran tipografi ada di 6.3.

## 4.5 Breakpoint

Sama dengan default Tailwind. Gunakan mobile-first.

| Token | Lebar | Target |
|---|---:|---|
| `sm` | 640px | Mobile landscape / tablet kecil |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

Pakai breakpoint saat konten membutuhkan perubahan layout, bukan semata karena ukuran perangkat tertentu.

## 4.6 Container (KONTEKSTUAL)

| Container | Max width | Untuk |
|---|---:|---|
| Narrow | 640px | Form, authentication |
| Reading | 768px | Artikel, teks panjang |
| Standard | 1024px | Halaman konten |
| Wide | 1280px | Dashboard, tabel, marketing |
| Extra wide | 1440px | Marketing, workspace lebar |
| Fluid | 100% | Canvas, kalender, data grid |

Jangan menjadikan satu lebar container sebagai standar untuk semua halaman.

## 4.7 Border dan focus

| Elemen | Standar |
|---|---|
| Border default, divider | 1px `brand-line` |
| Border kontrol interaktif (input, select, checkbox, radio) | 1px `brand-line-strong` (baru), agar batas kontrol terlihat jelas |
| Border semantik | 1px warna semantik |
| Focus ring | 2px `brand-primary`, offset 2px |

Jangan memakai border tebal sebagai dekorasi default.

## 4.8 Shadow

| Token | Spesifikasi | Penggunaan |
|---|---|---|
| `shadow-none` | none | Default flat |
| `shadow-sm` | 0 1px 2px rgb(0 0 0 / .05) | Elevasi kecil |
| `shadow-md` | 0 4px 8px rgb(0 0 0 / .08) | Dropdown, popover |
| `shadow-lg` | 0 10px 24px rgb(0 0 0 / .10) | Modal, floating panel |

Shadow tidak boleh menjadi satu-satunya pembeda elemen dan background; pakai border.

## 4.9 Z-index

| Layer | Nilai |
|---|---:|
| Base | 0 |
| Sticky element | 10 |
| Dropdown | 20 |
| Sticky navigation | 30 |
| Overlay | 40 |
| Modal | 50 |
| Popover di atas modal | 60 |
| Toast | 70 |
| Critical system overlay | 80 |

Jangan memakai z-index arbitrer.

## 4.10 Motion token

| Token | Nilai | Penggunaan |
|---|---:|---|
| `duration-fast` | 100ms | Pressed/active |
| `duration-base` | 150ms | Hover, focus, dropdown |
| `duration-slow` | 200ms | Modal, drawer, page transition |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default semua transisi |

Spesifikasi motion marketing ada di 15.2.

## 4.11 Sizing kontrol

| Komponen | Small | Medium (default) | Large |
|---|---:|---:|---:|
| Button | 36px | 40px | 44px |
| Input, select | 36px | 40px | 44px |
| Icon button | 36×36 | 40×40 | 44×44 |
| Checkbox, radio | 16px | 18px | 20px |
| Switch (track) | 32×18 | 36×20 | 40×22 |

| Konteks ikon | Ukuran |
|---|---:|
| Inline teks, button, kontrol kecil | 16px |
| Kontrol standar, item navigasi | 20px |
| Icon container | 20–24px |
| Empty state | 40–48px |
| Ilustrasi ikon besar | 48–64px |

| Konteks | Gap |
|---|---:|
| Ikon + label | 8px |
| Label + input | 6px |
| Input + helper/error | 4px |
| Field group | 16px |
| Form section | 24px |
| Padding card | 16–24px |
| Jarak section halaman | 24–48px |

Target sentuh: gunakan area interaksi minimal 44×44px di mobile bila memungkinkan, walaupun ikon visualnya lebih kecil. Angka 44px adalah standar internal StackPlus, bukan syarat minimum WCAG AA.

---

# 5. Color System

## 5.1 Brand palette (Baseline)

| Token | Nilai | Fungsi |
|---|---|---|
| `brand-primary` | `#0053F1` | CTA, link, active state, focus ring |
| `brand-primary-dark` | `#003CB3` | Hover dan pressed pada elemen primary |
| `brand-background` | `#FCFBF6` | Background halaman |
| `brand-surface` | `#FDFBF7` | Card, panel, dialog |
| `brand-surface-alt` | `#F6F3EC` | Surface sekunder / muted, hover ringan |
| `brand-line` | `#EAE5D9` | Border dan divider dekoratif |
| `brand-ink` | `#423E3A` | Teks body |
| `brand-ink-dark` | `#2A2724` | Teks utama, heading |

Verifikasi terhadap `globals.css` sebelum mengubah atau memakainya sebagai acuan migrasi.

## 5.2 Token tambahan (baru, Standar V3)

Dibutuhkan agar semua state memiliki token. Nilai di bawah adalah perkiraan awal; **verifikasi kontras dengan alat** sebelum dikunci.

| Token | Nilai | Fungsi |
|---|---|---|
| `brand-primary-soft` | `#EEF3FE` | Background item terpilih / aktif |
| `brand-ink-muted` | `#6B665F` | Teks sekunder, helper, placeholder (min. 4.5:1 terhadap background) |
| `brand-line-strong` | `#8F897E` | Border kontrol interaktif (min. 3:1) |
| `overlay` | `rgb(42 39 36 / 0.5)` | Latar gelap dialog dan drawer |

Aturan state: hover tombol primary memakai `brand-primary-dark`; hover item netral memakai `brand-surface-alt`; disabled memakai opacity 50% dengan teks tetap terbaca dan alasan yang jelas; selected memakai `brand-primary-soft` ditambah indikator non-warna.

`brand-background` dan `brand-surface` hampir identik. Pemisahan card dari halaman dilakukan dengan border `brand-line`, bukan dengan selisih warna.

## 5.3 Semantic colors (Standar V3)

| Semantic | Foreground / solid | Soft background | Penggunaan |
|---|---|---|---|
| `success` | `#15803D` | `#F0FDF4` | Berhasil, selesai, status aktif |
| `warning` | `#B45309` | `#FFFBEB` | Perlu perhatian, stok menipis, menunggu tindakan |
| `danger` | `#DC2626` (solid, ikon, border) · `#B91C1C` (teks di atas soft bg, hover solid) | `#FEF2F2` | Gagal, validasi, tindakan destruktif |
| `info` | `#0369A1` | `#F0F9FF` | Informasi netral, petunjuk |

`#DC2626` di atas `#FEF2F2` mendekati batas kontras 4.5:1, karena itu teks di atas soft background memakai `#B91C1C`. Tombol destructive memakai `danger` solid dengan teks putih.

Aturan:
- Warna semantik hanya untuk status dan feedback, bukan dekorasi.
- Selalu sertakan teks, ikon, atau bentuk pendukung; jangan mengandalkan warna saja.
- Jangan memakai warna brand untuk menggantikan semantic color.

## 5.4 Hierarki surface

| Level | Token | Catatan |
|---|---|---|
| Page background | `brand-background` | |
| Surface (card, panel) | `brand-surface` + border `brand-line` | |
| Surface muted | `brand-surface-alt` | Area sekunder, header tabel |
| Surface elevated | `brand-surface` + `shadow-md/lg` | Dialog, dropdown |
| Interactive | `brand-surface-alt` (hover), `brand-primary-soft` (selected) | |

Tidak semua level harus berbeda warna. Cukup bedakan untuk memperjelas konteks.

## 5.5 Aturan pemakaian

- Biru brand untuk aksi utama dan active state, bukan untuk semua elemen.
- Mayoritas area memakai netral.
- Tidak ada gradient atau glow tanpa alasan produk; glow dekoratif hanya untuk marketing.
- Jangan memakai opacity rendah untuk teks penting.
- Periksa kontras pada kombinasi aktual, terutama teks kecil dan disabled.

## 5.6 Dark mode

Dark mode bukan default. Keberadaan token `.dark` (shadcn) tidak berarti dark mode tersedia.

Dark mode baru boleh dianggap tersedia jika: semua semantic token memiliki pasangan dark; komponen penting, chart, overlay, form, dan status sudah diuji kontrasnya; tidak ada hex hard-coded yang merusak tema; ada mekanisme pilihan tema yang jelas. Jangan menambahkan toggle hanya karena token `.dark` ada.

## 5.7 Warna data visualization (baru, Standar V3)

Urutan seri, maksimal 5 seri ditambah satu netral. Verifikasi kontras terhadap surface.

| Seri | Nilai |
|---|---|
| 1 | `#0053F1` |
| 2 | `#7C3AED` |
| 3 | `#0E7490` |
| 4 | `#BE185D` |
| 5 | `#475569` |
| Lainnya / netral | `#9A948A` |

- Pemetaan warna ke kategori harus sama di seluruh halaman.
- Jangan memakai warna status untuk kategori non-status.
- Jangan membedakan seri hanya dengan warna: sertakan label langsung, legend, tooltip, atau pattern.

---

# 6. Typography

## 6.1 Font

- Primary: **Inter**, dimuat lewat `next/font/google` di root layout (Baseline).
- Weight yang dipakai: 400, 500, 600, 700. Jangan memakai banyak weight dalam satu komponen.
- Font baru hanya dengan keputusan desain dan evaluasi performa.

## 6.2 Baseline per konteks

- Product UI: body 14px (`text-sm`), cocok untuk aplikasi dengan data cukup padat.
- Marketing dan artikel: body 16px (`text-base`).
- Hindari heading besar di dashboard operasional.

## 6.3 Peran tipografi

| Peran | Product UI | Marketing | Weight |
|---|---|---|---|
| Display / hero | n/a | `text-5xl`–`text-6xl` desktop; `text-3xl`–`text-4xl` mobile | 700 |
| Page title | `text-2xl`–`text-3xl` | `text-3xl`–`text-4xl` | 600–700 |
| Section title | `text-xl`–`text-2xl` | `text-3xl` | 600–700 |
| Subsection | `text-base`–`text-lg` | `text-lg`–`text-xl` | 600 |
| Body | `text-sm` | `text-base` | 400 |
| Supporting text | `text-sm` | `text-base` | 400 |
| Label form | `text-sm` | `text-sm` | 500 |
| Helper, error, caption, metadata | `text-xs` | `text-xs`–`text-compact` | 400–500 |
| Isi tabel | `text-sm` (default/comfortable), `text-compact` (compact) | n/a | 400 |
| Angka KPI | 24–32px (`text-2xl`–`text-3xl`) | sesuai konteks | 600–700 |

## 6.4 Aturan

- Hierarchy jelas; batasi jumlah ukuran dan weight per halaman.
- Ukuran besar bukan satu-satunya alat hierarchy.
- Label tidak boleh lebih dominan daripada nilai data.
- Gunakan `tabular-nums` untuk angka yang dibandingkan secara vertikal (harga, total, kuantitas, metrik, kolom tabel).
- Alignment: rata kiri sebagai default. Rata tengah hanya untuk hero tertentu, authentication sederhana, atau empty state. Angka rata kanan di tabel.
- Panjang baris teks panjang 60–75 karakter (`max-w-prose` atau container Reading).
- Uppercase hanya untuk label pendek (eyebrow, kategori), tidak untuk paragraf atau seluruh teks aplikasi.
- Jangan memecah heading dengan line break paksa jika wrapping alami lebih baik.

## 6.5 Heading dua warna

Ekspresi marketing StackPlus, bukan aturan universal.

- Boleh: hero dan heading section marketing, untuk satu frasa penting.
- Warna frasa penekanan: `brand-primary`; sisanya `brand-ink-dark`. Kontras harus tetap baik.
- Jangan dipakai pada: judul dashboard, tabel, form, pengaturan akun, dialog, halaman operasional.
- Jangan diterapkan pada semua heading dalam satu halaman.

---

# 7. Layout, Density, dan Hierarchy

## 7.1 Density (KONTEKSTUAL)

| Density | Penggunaan | Whitespace |
|---|---|---|
| Compact | POS, ERP, tabel, admin operasional | Efisien |
| Comfortable | HRIS, CRM, dashboard, form, workspace | Seimbang |
| Spacious | Marketing, onboarding, editorial | Lega |

Konsisten dalam satu konteks halaman; jangan mencampur kontrol compact dan spacious tanpa alasan. POS memakai density compact untuk informasi, tetapi kontrol sentuh tetap ukuran large (44px). Jangan memakai whitespace berlebihan pada aplikasi padat data, dan jangan memadatkan konten hingga sulit dipindai.

## 7.2 Tipe layout

- **Constrained:** form, artikel, detail teks.
- **Standard / Wide:** dashboard, halaman konten, tabel, analytics.
- **Full-width:** canvas, kalender, data grid.
- **Split:** detail dengan panel pendamping.
- **Sidebar layout:** aplikasi dengan banyak modul.
- **Stacked:** mobile dan workflow linear.
- **Asimetris / editorial:** marketing.

## 7.3 Dashboard baseline (KONTEKSTUAL)

| Elemen | Ukuran |
|---|---:|
| Sidebar desktop | 240px |
| Sidebar compact | 72px |
| Header | 64px |
| Padding konten desktop | 24px |
| Padding konten tablet | 20px |
| Padding konten mobile | 16px |

Struktur umum: navigasi utama, header/topbar, page title, filter dan aksi, konten utama, panel kontekstual opsional. Tidak semua dashboard butuh semua bagian, dan sidebar tidak wajib di semua produk. Dashboard tidak wajib memiliki KPI card.

## 7.4 Grid

| Layout | Kolom |
|---|---:|
| Mobile | 1 |
| Tablet | 2 |
| Desktop | 3–4 |
| Wide dashboard | 4–6 |

Jumlah kolom ditentukan oleh lebar minimum konten, bukan sekadar breakpoint. Jangan memaksakan tiga kolom jika satu atau dua kolom lebih mudah dipahami. Grid asimetris boleh jika hierarchy membutuhkannya.

## 7.5 Visual hierarchy

Klasifikasikan konten sebelum membuat layout:

1. **Primary:** informasi atau aksi paling penting untuk tujuan halaman.
2. **Secondary:** pendukung keputusan utama.
3. **Supporting:** metadata, penjelasan, detail tambahan.
4. **Decorative:** hanya memperkuat identitas; tidak boleh bersaing dengan informasi utama.

Alat hierarchy: ukuran dan weight, kontras warna, spacing dan grouping, posisi, surface dan border, ikon, urutan, tingkat detail. Gunakan emphasis secara selektif; jika semua menonjol, tidak ada yang menonjol.

Halaman harus dapat dipindai cepat: judul mudah ditemukan, aksi utama terlihat, label jelas, data penting tidak tenggelam dalam metadata, status dan feedback mudah dikenali.

## 7.6 Overflow

- Hindari horizontal overflow pada halaman.
- Tabel lebar boleh scroll horizontal di dalam container khusus.
- Jangan menyembunyikan informasi penting demi menghilangkan overflow; pakai wrapping, kolom responsif, atau presentasi alternatif.
- Sticky header dan sidebar tidak boleh menutupi konten atau focus target (gunakan `scroll-padding`).

---

# 8. Komponen

## 8.1 Aturan umum

Setiap komponen memiliki: tujuan, anatomy, variant yang benar-benar berbeda fungsi, ukuran, state, perilaku responsive, aksesibilitas, dan aturan pakai. Untuk komponen baru yang kompleks, dokumentasikan: Purpose, Anatomy, Variants, States, Responsive, Accessibility, Do, Don't.

Komponen di bab ini sudah dispesifikasikan. Komponen yang belum (split button, button group, command menu, context menu) mengikuti urutan fallback di 21.3 bila dibutuhkan.

## 8.2 Button

| Ukuran | Tinggi | Padding X | Font | Spinner |
|---|---:|---:|---|---:|
| Small | 36px | 12px | `text-compact` 13px | 14px |
| Medium | 40px | 16px | `text-sm` 14px | 16px |
| Large | 44px | 20px | `text-base` 16px | 18px |

Radius `radius-lg`. Gap ikon dan label 8px.

| Variant | Penggunaan |
|---|---|
| Primary | Aksi utama |
| Secondary | Aksi sekunder |
| Outline | Aksi alternatif |
| Ghost | Aksi ringan |
| Destructive | Aksi berbahaya (`danger`) |
| Link | Navigasi atau aksi berbentuk teks |

| State | Perilaku |
|---|---|
| Default | Normal |
| Hover | Background atau border berubah (primary → `brand-primary-dark`) |
| Active | Visual pressed |
| Focus | Ring 2px, offset 2px |
| Disabled | Tidak dapat diklik, opacity 50%, teks tetap terbaca |
| Loading | Spinner + label proses |

Loading button:
- Spinner di depan teks, gap 8px; ukuran tombol tidak berubah.
- Tombol dinonaktifkan selama proses; gunakan `aria-busy="true"`.
- Label berubah menjadi bentuk progresif: `Simpan` → `Menyimpan...`, `Kirim` → `Mengirim...`, `Unggah` → `Mengunggah...`, `Perbarui` → `Memperbarui...`, umum → `Memproses...`.
- Jangan menampilkan spinner tanpa label jika label bisa dipertahankan.

Icon button: 36/40/44px sesuai ukuran; wajib punya accessible name atau tooltip bila fungsinya tidak jelas.

## 8.3 Form controls

**Input** — tinggi 36/40/44px, padding X 12px, font 14px, radius `radius-md`, border 1px `brand-line-strong`. State: default, hover (border `brand-ink-muted`), focus (border `brand-primary` + ring 2px offset 2px), filled, disabled, read-only, error (border `danger`), success.

**Label dan helper**

| Elemen | Spesifikasi |
|---|---|
| Label | 14px, weight 500, spesifik |
| Helper dan error | 12px / 16px |
| Label ke input | 6px |
| Input ke helper | 4px |

Placeholder bukan pengganti label; placeholder memberi contoh. Tandai field required atau optional secara konsisten.

**Textarea** — min-height 96px, padding 12px, font 14px, radius 8px, resize vertikal bila perlu.

**Select** — tinggi sama dengan input, padding X 12px, chevron 16px, dropdown `shadow-md`, opsi aktif memakai `brand-primary-soft`, opsi disabled tidak dapat dipilih, dropdown tidak boleh terpotong viewport.

**Combobox / autocomplete** — gaya input + daftar opsi seperti select; ada pencarian; maks tinggi daftar 320px dan scroll; tampilkan `Tidak ada hasil` jika kosong; mendukung keyboard (panah, Enter, Escape).

**Checkbox dan radio** — 18px default (16/20 mengikuti ukuran kontrol), gap ke label 8px. Seluruh baris (kontrol + label) menjadi area klik; target 44px di mobile bila memungkinkan.

**Switch** — 32×18 / 36×20 / 40×22px. Hanya untuk pengaturan on/off yang langsung berlaku.

**Date picker** — input 40px dengan popover kalender; format tampilan `30 Okt 2026` (lihat 13.6); boleh memakai native date input jika kebutuhan sederhana dan aksesibel.

**File upload** — dropzone dengan teks format dan ukuran maksimum yang diterima; tampilkan progress per file, error per file, dan tombol hapus/ganti. Jangan menampilkan persentase palsu.

**Search field** — input dengan ikon cari 16px dan tombol hapus; label atau `aria-label` jelas; placeholder menyebut apa yang dicari (misal `Cari nama karyawan`).

## 8.4 Data display

**Badge** — tinggi 20px (small) atau 24px (medium), radius full, soft background + foreground semantik. Untuk status, kategori, metadata pendek. Tidak menggantikan informasi penting yang seharusnya berupa teks; sertakan teks (jangan hanya warna).

**Avatar** — 24/32/40/48px, lingkaran, rasio 1:1. Fallback: inisial di atas `brand-surface-alt`.

**Card** — padding compact 12px / default 16px / spacious 24px, border 1px `brand-line`, radius 12px (kecil) atau 16px (standar). Harus punya tujuan grouping yang jelas (lihat 3.4).

**Tooltip** — font 12px, padding 6px × 8px, max-width 240px, delay tampil 500ms, delay sembunyi 100ms. Bukan satu-satunya tempat instruksi penting.

**Accordion** — header tinggi minimal 48px, chevron 16px, bisa dioperasikan dengan keyboard, status buka/tutup dinyatakan lewat `aria-expanded`.

**Progress** — linear tinggi 6px; circular 16px (inline) atau 32px (standalone). Tampilkan persentase hanya jika progress terukur.

## 8.5 Overlay

**Dialog**

| Variant | Max width |
|---|---:|
| Small | 400px |
| Medium | 520px |
| Large | 720px |
| Extra large | 900px |

Padding desktop 24px; title 20px / weight 600; body 14–16px; jarak header ke body 16px; body ke footer 24px; gap aksi footer 8px; overlay `overlay`; `shadow-lg`; radius 16px. Mobile: lebar `calc(100% - 32px)` atau bottom sheet; konten panjang dapat di-scroll; fokus tetap di dalam dialog.

**Drawer** — lebar default 400px, besar 560px; mobile full width atau bottom sheet; padding 24px desktop / 16px mobile; header dan tombol tutup konsisten.

**Popover** — `shadow-md`, radius 8px, padding 16px, max-width 320px, menutup dengan Escape.

**Dropdown menu** — min-width 180px, tinggi item 36px, `shadow-md`, aksi destruktif dipisah divider dan memakai warna `danger`.

Aturan overlay: dialog untuk keputusan yang butuh fokus; drawer untuk detail atau form yang masih membutuhkan konteks halaman; jangan memakai dialog untuk informasi yang cukup tampil inline. Sediakan tombol tutup yang jelas; perhatikan Escape, focus management, dan focus return ke trigger.

## 8.6 Feedback

**Toast** (React Hot Toast, Baseline)

| Properti | Standar |
|---|---|
| Posisi | Desktop: kanan atas. Mobile: atas, lebar `calc(100% - 32px)`, margin 16px |
| Max width | 400px |
| Padding | 12–16px |
| Ikon | 20px, gap ke teks 12px |

| Tipe | Durasi |
|---|---:|
| Success | 3000ms |
| Info | 4000ms |
| Warning | 5000ms |
| Error | 6000ms |
| Persistent | Dismiss manual |

Toast tidak menutup kontrol penting, mendukung dismiss, dan bukan satu-satunya sumber informasi error kritis.

**Alert** — untuk informasi yang harus tetap terlihat di halaman. Tipe: info, success, warning, danger. Tidak hilang otomatis. Error yang butuh tindakan memakai alert, bukan toast.

**Skeleton** — meniru bentuk konten sebenarnya.

| Konten | Skeleton |
|---|---|
| Text | Bar setinggi line-height |
| Avatar | Lingkaran sesuai ukuran |
| Gambar | Rasio sama dengan gambar |
| KPI | Placeholder angka + label |
| Tabel | Header + baris sesuai struktur |
| Dashboard | Per widget |

Radius mengikuti komponen asli. Animasi `animate-pulse` hanya jika sesuai, dan tidak dipakai bersamaan dengan spinner untuk konten yang sama. Jangan menampilkan skeleton setelah data tersedia.

**Loading indicator**

| Konteks | Ukuran | Copy |
|---|---:|---|
| Button small / medium / large | 14 / 16 / 18px | `Memproses...` / `Menyimpan...` / `Mengirim...` |
| Inline | 20px | `Memuat data...` |
| Halaman | 32px | `Memuat halaman...` |
| Full-screen | 32px | Sesuai proses |

Aturan memilih: spinner untuk proses singkat tanpa struktur konten yang perlu dipertahankan; skeleton untuk konten yang sedang dimuat; progress untuk proses terukur; full-screen hanya jika seluruh halaman benar-benar tidak dapat dipakai. Jangan mengganti seluruh halaman dengan spinner untuk request kecil.

**Empty state** — struktur: ikon/ilustrasi (40–48px), title (16–18px / 600), description (14px), aksi opsional; gap 8–12px. Harus menjelaskan kondisi dan langkah berikutnya. Contoh: `Belum ada data` / `Data yang ditambahkan akan muncul di sini.` / `Tambah data`. Jika hasil kosong karena filter, sebutkan filter yang aktif dan sediakan `Hapus filter`.

**Error state** — pesan yang dapat dipahami, bukan error teknis mentah. Tampilkan `Coba lagi` jika retry memungkinkan. Contoh: `Data gagal dimuat.`, `Anda tidak memiliki akses untuk melakukan tindakan ini.`

---

# 9. Page Patterns

Pola adalah referensi komposisi, bukan template wajib. Urutan boleh berubah jika kebutuhan pengguna berbeda.

**Marketing / landing** — elemen yang boleh dipakai: navigation, hero (split), value proposition, showcase/portfolio, bento, social proof/testimonial, feature explanation, case study, pricing, marquee, CTA block, footer. Urutan dan jumlah section mengikuti pesan dan conversion. Urutan visual umum: pesan utama, pesan pendukung, CTA utama, bukti visual, konten pendukung.

**Dashboard overview** — page title dan konteks waktu; filter atau aksi utama; ringkasan metrik yang relevan (KPI bila membantu keputusan); alert/perubahan penting; chart atau ringkasan; aktivitas terbaru; shortcut pekerjaan umum. Hindari banyak statistic card yang tidak membantu keputusan.

**Data listing** — page title; aksi utama; search dan filter; tabel/list; sorting dan pagination; bulk action bila relevan; state loading, empty, dan error.

**Data detail** — identitas item; status; aksi tersedia; informasi inti; riwayat/aktivitas; data terkait. Gunakan tab atau section bila informasi banyak dan berkelompok.

**Create / edit form** — tujuan form; field berkelompok; label dan helper; validasi; indikasi required/optional; submit dan batal; peringatan unsaved changes. Form panjang boleh memakai section atau stepper jika mengurangi beban kognitif.

**Settings** — kelompokkan berdasarkan topik; tampilkan status saat ini, dampak perubahan, dan mekanisme penyimpanan (otomatis atau tombol simpan) dengan jelas.

**Authentication** — satu tugas per layar; label jelas; toggle visibilitas password; validasi; loading; error yang tidak membocorkan informasi sensitif; aksi pemulihan akun yang jelas; tetap usable di mobile. Tidak ada dekorasi yang mengganggu proses login.

**Analytics dan reporting** — tentukan pertanyaan yang harus dijawab data; filter dan rentang waktu; label dan unit jelas; visualisasi sesuai tipe data; state tanpa data; perhatikan format export.

**POS** — produk mudah dicari; cart terlihat jelas; item, kuantitas, harga, subtotal, diskon, pajak, dan total jelas; checkout mudah dijangkau; status transaksi mudah dipahami; feedback jelas pada perubahan cart dan pembayaran; kontrol touch-friendly (44px); alur keyboard sesuai perangkat kasir; konfirmasi tindakan berisiko. Tanpa layout dekoratif yang memperlambat kasir.

**HRIS** — informasi dan manajemen karyawan, attendance, leave request, approval, reporting. Pakai tabel, filter, detail view, dan form sesuai kebutuhan.

**ERP** — struktur modul, navigasi jelas, tabel data, filter, detail transaksi, aksi yang sadar permission.

**LMS** — navigasi course, progres belajar, konten dan status lesson, assessment, status penyelesaian.

HRIS, ERP, dan LMS tidak memakai satu template; tiap modul mengikuti workflow dan jenis datanya, dengan token, komponen, state, dan aksesibilitas yang sama.

Permission: aksi yang tidak diizinkan disembunyikan jika pengguna tidak pernah membutuhkannya; ditampilkan disabled dengan alasan jika pengguna perlu tahu bahwa aksi itu ada.

---

# 10. Navigation

## 10.1 Prinsip

- Label jelas dan konsisten; active state mudah dikenali dan **tidak bergantung pada warna saja** (tambahkan indikator bar, weight, atau background).
- Struktur bertingkat tidak terlalu dalam tanpa alasan; kelompokkan menu agar mudah dipindai.
- Ikon membantu identifikasi tetapi tidak menggantikan label untuk menu yang tidak umum.
- Keyboard navigation harus berfungsi.

## 10.2 Website

Desktop: navigasi horizontal. Mobile: hamburger / menu mobile. Active state memakai `brand-primary`. CTA dipisahkan dari link navigasi biasa jika perlu.

## 10.3 Aplikasi

Pola: sidebar, top navigation, tab, breadcrumb, contextual navigation. Pilih berdasarkan jumlah modul dan struktur informasi.

**Sidebar (KONTEKSTUAL)**

| Elemen | Ukuran |
|---|---:|
| Lebar expanded / collapsed | 240px / 72px |
| Tinggi item | 40px |
| Ikon | 20px |
| Padding X | 12px |
| Gap item | 8px |

Kelompokkan menurut area kerja; bedakan active, hover, focus, disabled; state collapsed tetap dapat dipahami (tooltip untuk ikon). Mobile: berubah menjadi drawer (lebar 280px, maks 85% viewport) atau compact; mudah dibuka dan ditutup.

**Tabs** — tinggi minimal 40px, gap 16–24px, indikator aktif memakai `brand-primary`. Mobile boleh scroll horizontal; jangan memotong label tanpa alternatif.

**Breadcrumb** — font 13px (`text-compact`), gap 8px, separator 12px, halaman saat ini weight 500–600. Tidak menggantikan navigasi utama.

**Pagination** — tombol 36px; tampilkan halaman saat ini dan konteks total (`Menampilkan 11–20 dari 134`); sediakan pilihan jumlah per halaman bila data banyak.

**Stepper** — tampilkan langkah saat ini dari total (`Langkah 2 dari 4`); pengguna dapat kembali tanpa kehilangan data yang sudah diisi.

---

# 11. Responsive Design

Responsive bukan sekadar mengecilkan desktop: susunan, prioritas, dan cara interaksi menyesuaikan perangkat. Breakpoint ada di 4.5. Mobile-first adalah pendekatan implementasi, tetapi tetap tentukan kebutuhan tiap viewport lalu pastikan transisinya masuk akal.

## 11.1 Perilaku

| Elemen | Desktop | Mobile |
|---|---|---|
| Sidebar | Expanded | Drawer atau compact |
| Navigation | Horizontal | Menu |
| Grid | Multi-kolom | Satu kolom |
| Tabel | Tabel penuh | Strategi tabel mobile (11.3) |
| Modal | Di tengah | Lebar penuh atau sheet |
| Form | Single / grouped | Satu kolom |
| Button group | Inline | Stack jika perlu |
| Filter | Inline | Collapsible |
| Typography | Sesuai peran | Hero 30–36px; sesuaikan dengan ruang |
| Gambar | Rasio sesuai konteks | Crop dan rasio yang tepat |

## 11.2 Persyaratan mobile

- Tidak ada horizontal overflow yang tidak disengaja.
- Target sentuh ideal 44×44px.
- Teks tidak terpotong secara tidak wajar; konten penting tidak hilang.
- Dialog dan drawer tidak keluar viewport.
- Elemen sticky tidak menutupi konten.
- Aksi utama mudah ditemukan.

## 11.3 Tabel di mobile

Jangan sekadar mengecilkan semua kolom. Pilih salah satu:

1. Scroll horizontal di dalam container dengan petunjuk yang jelas.
2. Prioritaskan kolom penting, sisanya di detail.
3. Ubah baris menjadi card.
4. Gunakan detail view untuk informasi tambahan.

---

# 12. Interaction dan UI States

## 12.1 State

| State | Definisi |
|---|---|
| Default | Normal |
| Hover | Pointer di atas elemen |
| Focus | Menerima fokus keyboard |
| Active | Sedang ditekan |
| Selected | Dipilih |
| Disabled | Tidak tersedia |
| Loading | Proses berlangsung |
| Success | Berhasil |
| Error | Gagal |
| Empty | Tidak ada data |
| Read-only | Dapat dilihat, tidak dapat diubah |

Tidak semua komponen butuh semua state; tentukan dari interaksi aktual.

## 12.2 Transisi

| Interaksi | Durasi |
|---|---:|
| Hover, focus, dropdown | 150ms |
| Button active | 100ms |
| Modal, drawer, page transition | 200ms |

Easing `ease-standard`. Hormati `prefers-reduced-motion` (15.3).

## 12.3 Feedback

Setiap aksi penting menjawab: apakah aksi diterima, apakah sedang berjalan, apakah berhasil, jika gagal apa yang harus diperbaiki, apakah bisa dicoba lagi. Tombol tidak boleh terlihat diam setelah diklik jika prosesnya butuh waktu. Tampilkan feedback berdasarkan hasil operasi sebenarnya, bukan asumsi.

## 12.4 Aksi destruktif

- Jelaskan dampak tindakan; gunakan label aksi spesifik (`Hapus karyawan`, bukan `OK`).
- Minta konfirmasi bila sulit dibatalkan; tindakan kecil yang mudah dipulihkan tidak perlu konfirmasi berulang.
- Untuk tindakan yang lebih kritis, jelaskan dampak sebenarnya sebelum pengguna mengonfirmasi.

## 12.5 Penanganan error

- Pesan dapat dipahami dan menjelaskan cara memperbaiki.
- Pertahankan input pengguna selama aman.
- Sediakan retry bila relevan.
- Jangan menampilkan stack trace atau detail internal.

---

# 13. Forms dan Data Display

## 13.1 Prinsip form

- Setiap field punya label; placeholder bukan label.
- Kelompokkan field berdasarkan topik; urutan mengikuti alur berpikir pengguna.
- Single-column untuk form; grouped dengan section untuk form panjang.
- Cegah double submission (tombol dinonaktifkan saat submitting).
- Tampilkan peringatan jika pengguna meninggalkan form dengan perubahan yang belum disimpan.

| Elemen | Standar |
|---|---:|
| Field gap | 16px |
| Section gap | 24px |
| Input | 40px |

State form: pristine, focused, filled, invalid, disabled, read-only, submitting, submitted, unsaved changes.

## 13.2 Validasi

- Tampilkan error dekat field terkait (12px, warna `danger-dark` `#B91C1C`) dan hubungkan dengan field lewat `aria-describedby` serta `aria-invalid="true"`.
- Waktu validasi: saat field kehilangan fokus setelah pernah diisi, dan saat submit. Hapus error segera setelah input diperbaiki. Jangan menampilkan error pada field yang belum disentuh.
- Setelah submit gagal, fokuskan field error pertama.
- Jangan menghapus input pengguna ketika validasi gagal.

| Kondisi | Copy |
|---|---|
| Required | `Field ini wajib diisi.` (atau sebut nama field: `Nama wajib diisi.`) |
| Email tidak valid | `Masukkan alamat email yang valid.` |
| Password pendek | `Password minimal 8 karakter.` |
| Angka tidak valid | `Masukkan angka yang valid.` |
| Error server | `Data gagal disimpan. Silakan coba lagi.` |

## 13.3 Tabel

| Density | Tinggi baris | Padding X sel |
|---|---:|---:|
| Compact | 40px | 12px |
| Default | 48px | 16px |
| Comfortable | 56px | 20px |

Header: tinggi 44px, 12–13px, weight 600, background `brand-surface-alt`. Isi: 13px (compact) atau 14px, weight 400.

Aturan:
- Angka rata kanan dengan `tabular-nums`; teks rata kiri.
- Format tanggal dan angka konsisten (13.6).
- Status memakai badge.
- Teks panjang di-truncate hanya jika isi lengkap tetap dapat diakses.
- Sorting menampilkan arah saat ini; pagination menampilkan halaman saat ini dan total.
- Pertimbangkan: sticky header, row selection, bulk action, row action, filter, state loading/empty/error.
- Jangan memasukkan terlalu banyak kolom tanpa prioritas: tentukan kolom inti dan detail tambahan.
- Jangan membuat tabel terlalu rapat hingga sulit dibaca.

## 13.4 KPI

Label 12–14px; nilai 24–32px, weight 600–700; supporting text 12px; indikator tren 12px (dengan ikon/teks, bukan hanya warna); ikon 20–24px. Jangan menggunakan angka dummy yang tampak seperti data aktual.

## 13.5 Chart

Pilih chart berdasarkan pertanyaan:

| Pertanyaan | Chart |
|---|---|
| Tren dari waktu ke waktu | Line / area |
| Perbandingan kategori | Bar |
| Komposisi sederhana (sedikit kategori) | Pie / donut |
| Distribusi | Histogram |
| Hubungan dua variabel | Scatter |

Setiap chart punya: judul atau konteks, label dan unit, legend bila lebih dari satu seri, tooltip informatif, rentang waktu/filter bila relevan, state tanpa data, dan representasi data alternatif bila perlu (misal tabel). Warna mengikuti 5.7. Chart tetap terbaca di mobile. Jangan membuat chart hanya untuk mengisi ruang atau memakai dekorasi yang tidak membantu membaca data.

## 13.6 Format data dan lokalisasi

Default untuk produk berbahasa Indonesia (`id-ID`). Gunakan `Intl.NumberFormat` dan `Intl.DateTimeFormat`, jangan menyusun format dengan string manual.

| Data | Format | Contoh |
|---|---|---|
| Rupiah | Pemisah ribuan titik, tanpa desimal kecuali dibutuhkan | `Rp 1.250.000` |
| Angka desimal | Koma desimal | `12,5` |
| Persen | Angka + `%` | `12,5%` |
| Tanggal | `dd MMM yyyy` | `30 Okt 2026` |
| Waktu | 24 jam | `14.30` |
| Zona waktu | Simpan UTC; tampilkan WIB/WITA/WIT bila relevan | `14.30 WIB` |
| Nilai negatif | Tanda minus, bukan hanya warna | `-Rp 50.000` |

- Selalu tampilkan unit dan mata uang.
- Bedakan nilai positif, negatif, dan netral dengan tanda atau ikon selain warna.
- Jika produk mendukung lebih dari satu bahasa: jangan hard-code teks di komponen; pastikan layout menampung panjang teks berbeda; jangan membentuk kalimat dengan string concatenation; format tanggal, waktu, angka, dan mata uang mengikuti locale; perubahan bahasa tidak boleh merusak navigasi dan form.

## 13.7 Search dan filter

- Search memiliki placeholder yang jelas.
- Filter aktif terlihat (chip atau penanda) dan dapat dihapus satu per satu dan sekaligus.
- Pertahankan filter saat berpindah halaman jika sesuai workflow.
- Hasil kosong menyebut filter yang digunakan.

---

# 14. Icon dan Imagery

## 14.1 Icon

- Outline, stroke 2px, round cap/join, `currentColor`; Lucide sebagai pilihan utama (Baseline: Lucide / inline SVG).
- Ukuran mengikuti 4.11.
- Satu gaya ikon; jangan mencampur outline, filled, 3D, dan emoji.
- Jangan memakai emoji sebagai ikon UI.
- Ikon dekoratif dipakai selektif dan diberi `aria-hidden`; tombol hanya-ikon wajib punya accessible name.

## 14.2 Imagery

Pilih berdasarkan tujuan: screenshot produk untuk fitur, fotografi untuk storytelling, ilustrasi untuk konsep abstrak, avatar untuk identitas. Hindari stock imagery generik yang tidak menambah konteks.

| Konteks | Rasio |
|---|---|
| Produk | 1:1 |
| Portfolio, artikel | 16:9 |
| Avatar | 1:1 |
| Banner | 16:9 atau sesuai layout |

- Pertahankan aspect ratio; gunakan `object-fit` sesuai konteks; tentukan crop dan focal point; jangan meregangkan gambar.
- Alt text menjelaskan fungsi atau informasi gambar; gambar dekoratif memakai `alt=""`.
- Optimalkan ukuran file dan format.
- Jangan memakai placeholder acak sebagai gambar final.
- Fallback jika gambar belum ada: placeholder konsisten di atas `brand-surface-alt`, ikon atau inisial bila sesuai. Placeholder tidak boleh menyerupai data asli dan tidak boleh menampilkan broken image.

---

# 15. Motion

## 15.1 Prinsip

Motion membantu memahami perubahan state, hubungan antar-elemen, atau hasil tindakan. Motion bukan dekorasi wajib. Gunakan token di 4.10.

Product UI: hover, focus, expand/collapse, dropdown, modal, drawer, progress, transisi state. Hindari animasi dekoratif yang mengganggu pekerjaan.

## 15.2 Marketing (KONTEKSTUAL)

| Efek | Aturan |
|---|---|
| Hero / scroll reveal | Fade + translate kecil (≤ 24px), 400–600ms, `ease-standard`, sekali saja per elemen |
| Marquee | Lambat (satu siklus ≥ 30 detik), berhenti saat hover, statis saat reduced motion, konten ganda bersifat `aria-hidden` |
| Decorative glow | Intensitas rendah, di belakang konten, `aria-hidden`, tidak menurunkan kontras teks |
| Floating elements | Terbatas, tidak menutupi konten |
| Hover | Halus (150ms) |

Jangan membawa marquee atau floating showcase ke dashboard operasional tanpa alasan kuat. Perhatikan performa (animasi hanya `transform` dan `opacity`).

## 15.3 Larangan dan reduced motion

- Hormati `prefers-reduced-motion`; state akhir harus tetap dapat dipahami tanpa animasi.
- Tidak boleh: bouncing berlebihan, spinning UI dekoratif, parallax besar tanpa kebutuhan, animasi infinite pada elemen penting atau animasi infinite baru tanpa alasan, animasi yang menghambat penyelesaian tugas.

---

# 16. Accessibility

Target: **WCAG 2.2 Level AA**. Jangan menganggap warna brand otomatis memenuhi kontras; periksa kombinasi aktual.

## 16.1 Persyaratan

- Semantic HTML dan struktur heading yang logis.
- Kontras teks normal ≥ 4.5:1, teks besar ≥ 3:1, komponen UI dan indikator ≥ 3:1.
- Semua fungsi utama dapat diakses dengan keyboard; focus indicator selalu terlihat.
- Form memiliki label; pesan error terhubung ke field (`aria-describedby`, `aria-invalid`).
- Tombol hanya-ikon memiliki accessible name.
- Gambar informatif memiliki alt text.
- Status tidak hanya dibedakan lewat warna.
- Dialog memiliki focus management.
- Layout tetap usable saat zoom hingga 200% dan text resizing.
- Reduced motion dihormati.
- Target sentuh ideal 44×44px (standar internal).

## 16.2 Keyboard

- Tab order logis.
- Enter dan Space bekerja sesuai jenis kontrol.
- Escape menutup dialog, popover, dan menu bila sesuai.
- Fokus kembali ke trigger setelah dialog ditutup.
- Tidak ada keyboard trap yang tidak disengaja.

## 16.3 Review

Lakukan pemeriksaan otomatis dan manual. Automated checker membantu menemukan masalah tetapi tidak menggantikan uji keyboard dan penggunaan nyata.

---

# 17. Content dan Microcopy

## 17.1 Bahasa dan nada

Bahasa default mengikuti target pengguna; untuk aplikasi Indonesia gunakan bahasa Indonesia yang natural. Nada: jelas, ringkas, profesional, ramah, tidak berlebihan, tidak menyalahkan pengguna. Hindari istilah teknis yang tidak perlu dan gunakan istilah yang konsisten.

## 17.2 Label tombol

Label menyebut tindakan dan, bila konteks ambigu, objeknya: `Simpan perubahan`, `Tambah karyawan`, `Buat transaksi`, `Unduh laporan`, `Kirim undangan`. Hindari `Klik di sini`, `Proses`, `Submit`, `OK` bila ada label yang lebih deskriptif. Kamus kata kerja dasar:

| Aksi | Label |
|---|---|
| Create | Tambah |
| Save | Simpan |
| Update | Perbarui |
| Delete | Hapus |
| Cancel | Batal |
| Confirm | Konfirmasi |
| Retry | Coba lagi |
| Search | Cari |
| Filter | Filter |
| Export | Ekspor |
| Download | Unduh |
| Upload | Unggah |
| Close | Tutup |

## 17.3 Feedback

Sebut objek bila memungkinkan (`Karyawan berhasil ditambahkan.`); bentuk generik di bawah dipakai jika objek tidak relevan.

| Konteks | Copy |
|---|---|
| Simpan berhasil | Data berhasil disimpan. |
| Perbarui berhasil | Data berhasil diperbarui. |
| Hapus berhasil | Data berhasil dihapus. |
| Tambah gagal | Data gagal ditambahkan. |
| Perbarui gagal | Data gagal diperbarui. |
| Hapus gagal | Data gagal dihapus. |
| Jaringan | Koneksi terputus. Periksa koneksi internet Anda. |
| Error umum | Terjadi kesalahan. Silakan coba lagi. |
| Memuat | Memuat data... |
| Menyimpan | Menyimpan... |
| Memproses | Memproses... |

Pesan menjelaskan kondisi: success (apa yang berhasil), error (apa yang gagal dan langkah berikutnya), warning (risiko), empty (mengapa kosong dan apa yang bisa dilakukan), loading (proses yang berjalan bila cukup lama).

## 17.4 Konfirmasi hapus

Judul `Hapus data ini?` · Deskripsi `Data yang dihapus tidak dapat dipulihkan.` · Aksi `Batal` dan `Hapus`. Sebut nama objek bila perlu (`Hapus karyawan Budi?`). Untuk tindakan kritis, jelaskan dampak sebenarnya.

---

# 18. Implementasi Teknis

## 18.1 Stack baseline

| Layer | Teknologi (Baseline) |
|---|---|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS v4, CSS-first lewat `globals.css` |
| Font | Inter lewat `next/font/google` |
| Icon | Lucide / inline SVG |
| Notification | React Hot Toast |
| HTTP client | Axios |
| Komponen | `apps/web/src/components/` |

Periksa repository aktual sebelum mengasumsikan versi, dependency, atau struktur masih sama.

## 18.2 Source of truth

Periksa: `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`, komponen aktual di `apps/web/src/components/`, konfigurasi dan dependency yang benar-benar dipakai. Token brand (`--brand-*`) dan token shadcn OKLCH (`--background`, `--primary`, dst.) adalah dua kelompok terpisah; jangan menganggap nilainya sama. Pemetaan antar keduanya harus eksplisit bila dibutuhkan.

## 18.3 Implementasi token

Struktur usulan (Standar V3). Ini bukan pengganti otomatis konfigurasi existing; gabungkan dengan `globals.css` setelah memeriksa konflik dengan token shadcn.

```css
:root {
  /* Brand (Baseline) */
  --brand-primary: #0053F1;
  --brand-primary-dark: #003CB3;
  --brand-background: #FCFBF6;
  --brand-surface: #FDFBF7;
  --brand-surface-alt: #F6F3EC;
  --brand-line: #EAE5D9;
  --brand-ink: #423E3A;
  --brand-ink-dark: #2A2724;

  /* Tambahan (baru) */
  --brand-primary-soft: #EEF3FE;
  --brand-ink-muted: #6B665F;
  --brand-line-strong: #8F897E;
  --overlay: rgb(42 39 36 / 0.5);

  /* Semantic */
  --success: #15803D;  --success-soft: #F0FDF4;
  --warning: #B45309;  --warning-soft: #FFFBEB;
  --danger: #DC2626;   --danger-dark: #B91C1C;  --danger-soft: #FEF2F2;
  --info: #0369A1;     --info-soft: #F0F9FF;

  /* Sizing */
  --control-height-sm: 36px;
  --control-height-md: 40px;
  --control-height-lg: 44px;

  /* Z-index */
  --z-sticky: 10;  --z-dropdown: 20;  --z-nav: 30;  --z-overlay: 40;
  --z-modal: 50;   --z-popover: 60;   --z-toast: 70; --z-critical: 80;

  /* Motion */
  --duration-fast: 100ms;
  --duration-base: 150ms;
  --duration-slow: 200ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}

/* Tailwind v4: ekspos token sebagai utility */
@theme inline {
  --color-brand-primary: var(--brand-primary);
  --color-brand-primary-dark: var(--brand-primary-dark);
  --color-brand-primary-soft: var(--brand-primary-soft);
  --color-brand-background: var(--brand-background);
  --color-brand-surface: var(--brand-surface);
  --color-brand-surface-alt: var(--brand-surface-alt);
  --color-brand-line: var(--brand-line);
  --color-brand-line-strong: var(--brand-line-strong);
  --color-brand-ink: var(--brand-ink);
  --color-brand-ink-dark: var(--brand-ink-dark);
  --color-brand-ink-muted: var(--brand-ink-muted);
}

/* Override skala Tailwind default (periksa dampak pada shadcn) */
@theme {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-3xl: 32px;

  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 8px rgb(0 0 0 / 0.08);
  --shadow-lg: 0 10px 24px rgb(0 0 0 / 0.10);

  --text-compact: 0.8125rem;
  --text-compact--line-height: 1.125rem;
}
```

## 18.4 Tailwind dan styling

- Gunakan Tailwind v4 dengan konfigurasi CSS-first; jangan menambahkan konfigurasi v3 tanpa alasan migrasi.
- Hindari arbitrary value jika token tersedia; jika terpaksa, jelaskan alasannya.
- Jangan menyebarkan hex atau nilai visual yang sama ke banyak file; hindari inline style bila token atau utility tersedia.
- Jangan memakai class atau utility custom sebelum implementasinya benar-benar ada (status di Appendix 23.3).

## 18.5 Komponen dan arsitektur

- **Reuse before create:** cari komponen existing, periksa apakah variant atau composition sudah cukup, perluas dengan aman, baru buat komponen baru jika tanggung jawabnya jelas dan reusable.
- Pisahkan komponen berdasarkan tanggung jawab; hindari komponen besar yang menangani seluruh halaman dan semua state.
- Gunakan composition untuk variasi layout; variant harus eksplisit.
- Jangan membuat komponen design-system untuk elemen yang hanya muncul sekali.
- Jangan menambah dependency hanya untuk detail kecil yang bisa ditangani stack yang ada.

## 18.6 State, form, dan semantik

- Pisahkan server state dan UI state; hindari state duplikat yang membuat UI tidak sinkron.
- Form memiliki validasi dan submission state yang jelas; cegah double submission; pertahankan input saat error.
- Gunakan semantic HTML; jangan memakai elemen interaktif hanya untuk styling; gunakan native control jika sesuai dan aksesibel.

## 18.7 Performa

Optimalkan ukuran gambar; hindari render dan state update yang tidak perlu; batasi animasi berat; perhatikan bundle size; gunakan dynamic loading hanya jika bermanfaat nyata. Jangan mengorbankan UX demi optimasi mikro yang tidak terukur.

## 18.8 Sinkronisasi dokumentasi

Perubahan token, komponen, atau pola harus diikuti pembaruan dokumen ini dan dokumentasi komponen terkait. Jangan biarkan dokumen mendeskripsikan implementasi yang sudah tidak ada.

---

# 19. UI Quality Assurance

## 19.1 Visual

Typography, spacing, alignment, density, warna dan kontras, sizing komponen, surface dan border, hierarchy, overflow, keterbacaan data, serta state empty/loading/error.

## 19.2 Fungsional

Semua tombol dan link, validasi dan submit form, search, filter, sorting, pagination, dropdown, modal, drawer, tabs, aksi tabel, navigasi, interaksi keyboard.

## 19.3 Responsive

Uji minimal pada: 375, 640, 768, 1024, 1280, dan 1536px. Pastikan tidak ada horizontal overflow, konten tidak terpotong, tombol dapat dipakai, tabel punya strategi mobile, navigasi berfungsi, dialog dan drawer tidak keluar layar.

## 19.4 Accessibility

Navigasi keyboard, visibilitas fokus, label dan accessible name, kontras, semantic HTML, perilaku dialog.

## 19.5 Browser

Periksa hasil aktual di browser, bukan hanya kode: jalankan halaman, ambil screenshot di viewport utama, periksa error console dan network, uji interaksi utama, bandingkan dengan target desain, perbaiki perbedaan sebelum menyatakan selesai. Jika browser QA tidak tersedia, nyatakan batasan pemeriksaan; jangan mengklaim sudah melakukan visual review jika hanya membaca kode.

## 19.6 Regression

Setelah mengubah token atau komponen bersama: periksa halaman lain yang memakainya, pastikan tidak ada perubahan visual yang tidak diinginkan, jalankan test yang relevan, periksa responsive, dan perbarui screenshot atau visual regression baseline bila ada.

---

# 20. Anti-Patterns

Pola berikut boleh dipakai jika sesuai kebutuhan, tetapi bukan default.

**Layout generik**
- Semua halaman memakai hero centered, heading besar di tengah, atau tiga kolom.
- Semua konten dijadikan card; semua dashboard berupa grid statistic card; semua form dalam card besar di tengah.
- Semua heading dua warna; semua section diawali eyebrow; semua halaman memakai split header atau urutan section yang sama.

**Visual noise**
- Gradient dekoratif, glassmorphism, glow berlebihan, shadow tebal tanpa tujuan.
- Border di setiap elemen; radius besar di semua komponen; badge dan pill berlebihan.
- Ikon, ilustrasi, atau chart hanya untuk mengisi ruang; watermark besar yang mengganggu konten.
- Animasi infinite tanpa fungsi.

**Hierarchy buruk**
- Semua teks besar; semua tombol terlihat primary; informasi penting di teks kecil.
- Warna aksen di terlalu banyak elemen; heading terlalu besar di dashboard.
- Whitespace terlalu luas di aplikasi padat data.

**Sistem dan kualitas**
- Menambah warna, font, atau token tanpa persetujuan; mengarang token yang belum didefinisikan.
- Placeholder sebagai label.
- Spinner untuk semua proses.
- Dummy data yang terlihat seperti data aktual.
- Tombol tanpa fungsi.
- Menghilangkan error state atau mengabaikan responsive.
- Mengubah business logic demi tampilan.
- Menambah dependency untuk efek visual kecil.
- Membuat komponen baru tanpa memeriksa komponen existing.

---

# 21. Alur Kerja dan Protokol AI Agent

## 21.1 Alur kerja

1. **Understand** — tujuan halaman, pengguna, task utama, informasi yang dibutuhkan, aksi utama dan sekunder, kondisi data, target viewport.
2. **Inspect** — dokumen ini, halaman existing, komponen existing, token, konvensi proyek, kemampuan stack.
3. **Plan** — content hierarchy, tipe layout, density, navigasi, komponen, perilaku responsive, state interaksi. Jangan mulai dengan memilih dekorasi sebelum memahami tujuan halaman, dan jangan langsung coding sebelum struktur dan prioritas dipahami.
4. **Implement** — pakai komponen dan token yang tersedia; layout sesuai kebutuhan; implementasikan state penting, semantic HTML, dan responsive; hindari overengineering. Perubahan sekecil mungkin: jangan redesign seluruh aplikasi jika hanya satu komponen diminta.
5. **Validate** — pemeriksaan teknis, browser QA, interaksi utama, mobile dan desktop, aksesibilitas dasar (bab 19). Perbaiki sebelum selesai.
6. **Document** — jika standar berubah, perbarui dokumen ini, dokumentasi token/komponen, dan catat extension yang dibuat.

## 21.2 Aturan AI Agent

1. Baca dokumen ini sebelum membuat atau mengubah UI.
2. Periksa struktur proyek, komponen, token, dan pola halaman sebelum menulis kode.
3. Gunakan token yang telah ditentukan; jangan membuat warna, ukuran, radius, shadow, atau animasi arbitrer.
4. Gunakan komponen existing sebelum membuat yang baru.
5. Jangan memaksakan layout marketing ke aplikasi operasional.
6. Jangan menambahkan fitur atau dependency yang tidak diminta.
7. Jangan mengubah business logic demi kebutuhan visual.
8. Jangan mengklaim token, utility, atau komponen tersedia sebelum memeriksa kode.
9. Laporkan hal yang belum dapat diverifikasi (misal tidak ada browser preview).
10. Jika kebutuhan belum tercakup, ikuti 21.3.

## 21.3 Jika standar belum tersedia

1. Cari token existing.
2. Cari komponen existing.
3. Cari pola yang serupa.
4. Gunakan standar terdekat.
5. Jika tidak cukup, usulkan token atau komponen baru sekecil mungkin dan reusable.
6. Jelaskan kebutuhan dan dampaknya, lalu dokumentasikan.
7. Jangan memperluas design system secara diam-diam, dan jangan membuat style acak.

> Jangan menciptakan variasi tanpa alasan. Jangan pula memaksakan konsistensi yang merusak usability.

---

# 22. Definition of Done

UI selesai jika kriteria yang relevan terpenuhi.

**Design**
- [ ] Layout sesuai tujuan halaman; hierarchy jelas; density sesuai konteks.
- [ ] Identitas StackPlus terasa tanpa memaksakan semua produk sama.
- [ ] Tidak memakai template secara membabi buta; tidak semua konten dipaksa menjadi card.

**Token dan komponen**
- [ ] Token yang sesuai dipakai; tidak ada nilai arbitrer atau token duplikat.
- [ ] Komponen existing diperiksa; ukuran dan variant sesuai standar.
- [ ] Tidak ada utility yang diasumsikan tersedia tanpa verifikasi.

**State dan interaksi**
- [ ] Loading, empty, dan error state tersedia sesuai standar.
- [ ] Tombol dan link berfungsi; form punya label dan validasi.
- [ ] Format angka, mata uang, dan tanggal mengikuti 13.6.

**Responsive**
- [ ] Mobile, tablet, desktop berfungsi; tidak ada horizontal overflow; tidak ada elemen yang menutupi konten.

**Accessibility**
- [ ] Semantic HTML; fokus terlihat; keyboard berfungsi.
- [ ] Label dan accessible name tersedia; kontras diperiksa; status tidak hanya warna; reduced motion dihormati.

**Teknis**
- [ ] Tidak ada fitur atau dependency tambahan yang tidak diperlukan.
- [ ] Test atau pemeriksaan relevan dijalankan; regression QA bila token/komponen bersama berubah.
- [ ] Browser QA dilakukan bila tersedia; batasan pemeriksaan dilaporkan.
- [ ] Dokumentasi diperbarui jika standar berubah.

---

# 23. Appendix: Baseline dan Keputusan V3

## 23.1 Arah visual baseline

Warm background + surface putih/cream + biru sebagai aksen utama + tipografi bersih + border tipis + sudut membulat terkontrol + motion halus + layout fungsional.

## 23.2 Catatan implementasi tercatat

- Token `--brand-*` tercatat di `globals.css`; token shadcn OKLCH adalah kelompok terpisah.
- Radius dan shadow brand sebelumnya belum tercatat sebagai token lengkap (V3 mendefinisikannya di 4.3 dan 4.8).
- Transisi mikro sebelumnya tercatat 200–300ms.
- Tema terang adalah baseline; token `.dark` tidak berarti dark mode tersedia.

## 23.3 Status utility (Baseline, verifikasi sebelum dipakai)

| Item | Status tercatat |
|---|---|
| `animate-pulse` | Tersedia |
| `.card-hover`, `.hide-scrollbar`, `.reveal`, komponen `Reveal` | Belum tersedia |
| Marquee dan floating animation | Referensi desain, bukan utility. Implementasikan di `globals.css` mengikuti 15.2 bila dibutuhkan |

## 23.4 Pola marketing yang sudah ada (boleh dipertahankan untuk konteks marketing)

Hero dengan copy dan visual showcase, heading dua warna, eyebrow, section header split, portfolio card, bento composition, marquee band, CTA block, floating navigation, footer multi-kolom, chatbot floating. Tidak wajib untuk dashboard atau aplikasi operasional.

## 23.5 Arah product UI yang sudah tercatat (titik awal)

Login, dashboard shell, sidebar, topbar, data table, CRUD form, loading skeleton, empty state, error state, status badge, toast. Periksa kebutuhan dan implementasi aktual sebelum memperluas.

## 23.6 Keputusan V3 yang menyelesaikan perbedaan V1 dan V2

| Hal | Keputusan | Alasan |
|---|---|---|
| Durasi transisi | 100–200ms (V1: 200–300ms) | Interaksi lebih responsif. Komponen yang sudah memakai 200–300ms tidak wajib diubah segera |
| Nama semantik | `danger` (V2: `error`) | Konsisten dengan V1 dan varian tombol Destructive |
| Warna teks danger | `#B91C1C` di atas soft background | `#DC2626` di atas `#FEF2F2` mendekati batas 4.5:1 |
| Skala 4px | Ditambah `space-1.5` (6px); dimensi kontrol dipisah dari skala spacing | Gap 6px dan padding tooltip dipakai V2 |
| Type scale | Ditambah `text-compact` 13px; tombol large 16px (bukan 15px); line-height 5xl/6xl dalam px | Menghilangkan ukuran di luar skala |
| Checkbox | 18px default, 16/20px mengikuti ukuran kontrol | V2 menyebut dua nilai berbeda |
| Label tombol | Kata kerja dasar + objek bila ambigu | V1 menolak label generik; V2 membakukan kata kerja dasar |
| Border kontrol | `brand-line-strong` untuk input, select, checkbox | `brand-line` terlalu tipis untuk batas kontrol (kontras UI 3:1) |
| Prioritas | Urutan V1 (fungsi → aksesibilitas → hierarchy → konsistensi → identitas → estetika) | Memberi aturan penyelesaian konflik |
| Status nilai | Satu sistem: Baseline / Standar V3 / (baru), plus kekuatan WAJIB/KONTEKSTUAL/BEBAS | Menghindari "Proposed — Mandatory" |
| Token baru | `brand-primary-soft`, `brand-ink-muted`, `brand-line-strong`, `overlay`, warna chart | V1 dan V2 menyebut state ini tanpa nilai |

---

# Prinsip Akhir

```text
CONSISTENT SYSTEM.
CONTEXTUAL LAYOUT.
PREDICTABLE COMPONENTS.
NO ARBITRARY UI DECISIONS.
```

**One Studio. One Design Language. Different Product Experiences.**

Design with purpose. Build with consistency. Validate with real usage.
