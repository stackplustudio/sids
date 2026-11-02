import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Landmark,
  ReceiptText,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Eduscout | Sistem Informasi Sekolah",
  description:
    "Kelola PPDB, data akademik, materi dan tugas, presensi, penilaian, rapor, serta administrasi SPP dalam satu portal sekolah.",
};

const modules: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "PPDB dan daftar ulang",
    description:
      "Kelola pendaftar, status berkas, dan daftar ulang.",
    icon: FileCheck2,
  },
  {
    title: "Data akademik",
    description:
      "Atur siswa, guru, kelas, mapel, dan penempatan.",
    icon: GraduationCap,
  },
  {
    title: "Jadwal pelajaran",
    description:
      "Susun jadwal pelajaran per kelas dan mapel.",
    icon: CalendarCheck,
  },
  {
    title: "Pembelajaran digital",
    description:
      "Kelola materi, tugas, dan pengumpulan jawaban siswa.",
    icon: BookOpenCheck,
  },
  {
    title: "Presensi dan perizinan",
    description:
      "Catat kehadiran kelas dan pengajuan izin.",
    icon: ClipboardCheck,
  },
  {
    title: "Penilaian dan SPP",
    description:
      "Atur komponen nilai, rapor, tagihan, dan pembayaran.",
    icon: WalletCards,
  },
];

const workflow = [
  {
    title: "Kelola penerimaan",
    description: "Pendaftar, verifikasi, daftar ulang.",
  },
  {
    title: "Atur data sekolah",
    description: "Siswa, kelas, mapel, penempatan, jadwal.",
  },
  {
    title: "Dukung pembelajaran",
    description: "Materi, tugas, presensi, jawaban siswa.",
  },
  {
    title: "Tinjau hasil dan biaya",
    description: "Nilai, rapor, tagihan, pembayaran SPP.",
  },
];

const roles: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Admin sekolah",
    description: "PPDB, data sekolah, operasional.",
    icon: Landmark,
  },
  {
    title: "Guru",
    description: "Materi, tugas, nilai, presensi.",
    icon: BookOpenCheck,
  },
  {
    title: "Siswa",
    description: "Jadwal dan pengumpulan tugas.",
    icon: GraduationCap,
  },
  {
    title: "Bendahara",
    description: "Tagihan dan pembayaran.",
    icon: ReceiptText,
  },
];

const questions = [
  {
    question: "Perlu aplikasi khusus?",
    answer:
      "Tidak. Akses lewat browser dengan layout responsif.",
  },
  {
    question: "Tersedia portal orang tua?",
    answer:
      "Belum tersedia di aplikasi; kebutuhan ini tercantum dalam PRD.",
  },
  {
    question: "Bisa mengelola banyak sekolah?",
    answer:
      "Cakupan saat ini satu sekolah per deployment.",
  },
];

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <h2 className={styles.sectionTitle} id={id}>
        {title}
      </h2>
      <p className={styles.sectionDescription}>{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#konten">
        Lewati ke konten
      </a>

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link className={styles.brand} href="/" aria-label="Eduscout, beranda">
            <Image
              src="/logo.jpg"
              alt="Eduscout"
              width={727}
              height={210}
              priority
              className={styles.logo}
            />
          </Link>

          <nav className={styles.navigation} aria-label="Navigasi utama">
            <a href="#modul">Modul</a>
            <a href="#alur">Alur kerja</a>
            <a href="#pengguna">Pengguna</a>
          </nav>

          <Link className={styles.headerAction} href="/auth/login">
            Masuk portal <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </header>

      <main id="konten">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle} id="hero-title">
                Kelola sekolah dalam satu alur.
              </h1>
              <p className={styles.heroDescription}>
                Satukan penerimaan, akademik, pembelajaran, presensi, dan
                keuangan dalam satu sistem sekolah.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} href="/auth/login">
                  Masuk ke portal <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <a className={styles.secondaryAction} href="#modul">
                  Jelajahi modul <ArrowDown aria-hidden="true" size={17} />
                </a>
              </div>
            </div>

            <figure className={styles.systemMap}>
              <figcaption className={styles.mapCaption}>
                Satu portal untuk pekerjaan sekolah
              </figcaption>
              <div className={styles.mapRoot}>
                <span className={styles.mapRootIcon}>
                  <UsersRound aria-hidden="true" size={20} />
                </span>
                <span>
                  <strong>Eduscout SIDS</strong>
                  <small>Sistem informasi sekolah</small>
                </span>
              </div>
              <div className={styles.mapConnector} aria-hidden="true" />
              <ul className={styles.mapBranches} aria-label="Kelompok modul SIDS">
                <li>
                  <span className={styles.mapIcon}>
                    <FileCheck2 aria-hidden="true" size={18} />
                  </span>
                  <span>
                    <strong>Penerimaan</strong>
                    <small>PPDB dan daftar ulang</small>
                  </span>
                </li>
                <li>
                  <span className={styles.mapIcon}>
                    <GraduationCap aria-hidden="true" size={18} />
                  </span>
                  <span>
                    <strong>Akademik</strong>
                    <small>Siswa, kelas, dan jadwal</small>
                  </span>
                </li>
                <li>
                  <span className={styles.mapIcon}>
                    <BookOpenCheck aria-hidden="true" size={18} />
                  </span>
                  <span>
                    <strong>Pembelajaran</strong>
                    <small>Materi, tugas, dan presensi</small>
                  </span>
                </li>
                <li>
                  <span className={styles.mapIcon}>
                    <WalletCards aria-hidden="true" size={18} />
                  </span>
                  <span>
                    <strong>Administrasi</strong>
                    <small>Penilaian, rapor, dan SPP</small>
                  </span>
                </li>
              </ul>
            </figure>
          </div>
        </section>

        <section
          className={styles.modulesSection}
          id="modul"
          aria-labelledby="modules-title"
        >
          <div className={styles.container}>
            <SectionHeading
              id="modules-title"
              title="Pekerjaan sekolah, satu sistem"
              description="Modul inti untuk administrasi dan kegiatan belajar."
            />
            <ul className={styles.moduleGrid}>
              {modules.map(({ title, description, icon: Icon }) => (
                <li className={styles.moduleItem} key={title}>
                  <span className={styles.itemIcon}>
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className={styles.workflowSection}
          id="alur"
          aria-labelledby="workflow-title"
        >
          <div className={styles.container}>
            <SectionHeading
              id="workflow-title"
              title="Dari penerimaan ke kegiatan belajar"
              description="Alur kerja sekolah."
            />
            <ol className={styles.workflowList}>
              {workflow.map(({ title, description }) => (
                <li className={styles.workflowItem} key={title}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={styles.rolesSection}
          id="pengguna"
          aria-labelledby="roles-title"
        >
          <div className={styles.container}>
            <SectionHeading
              id="roles-title"
              title="Ruang kerja sesuai peran"
              description="Untuk tiap peran."
            />
            <ul className={styles.rolesList}>
              {roles.map(({ title, description, icon: Icon }) => (
                <li className={styles.roleItem} key={title}>
                  <Icon aria-hidden="true" size={22} />
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.scopeSection} aria-labelledby="scope-title">
          <div className={`${styles.container} ${styles.scopeGrid}`}>
            <div>
              <h2 className={styles.sectionTitle} id="scope-title">
                Dirancang untuk operasional sekolah
              </h2>
              <p className={styles.scopeDescription}>
                Aplikasi web untuk operasional satu sekolah.
              </p>
            </div>
            <div className={styles.questions}>
              {questions.map(({ question, answer }) => (
                <details className={styles.question} key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true" className={styles.questionMark}>
                      +
                    </span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} aria-labelledby="cta-title">
          <div className={`${styles.container} ${styles.ctaInner}`}>
            <div>
              <h2 className={styles.ctaTitle} id="cta-title">
                Lanjutkan ke portal sekolah.
              </h2>
            </div>
            <Link className={styles.primaryAction} href="/auth/login">
              Masuk ke portal <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <Link className={styles.footerBrand} href="/" aria-label="Eduscout, beranda">
            <Image
              src="/logo.jpg"
              alt=""
              width={727}
              height={210}
              className={styles.logo}
            />
          </Link>
          <a className={styles.footerLink} href="#modul">
            Modul SIDS <ArrowRight aria-hidden="true" size={15} />
          </a>
          <a className={styles.footerLink} href="#konten">
            Kembali ke atas <ArrowRight aria-hidden="true" size={15} />
          </a>
        </div>
      </footer>
    </div>
  );
}
