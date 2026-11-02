"use client";

import { useEffect, useSyncExternalStore } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardUser = {
  name: string;
  role: string;
};

type Shortcut = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type DashboardSession = {
  token: string | null;
  user: DashboardUser | null;
  error: unknown;
};

const serverDashboardSession: DashboardSession = {
  token: null,
  user: null,
  error: null,
};

let cachedDashboardSession = serverDashboardSession;

function subscribeToDashboardSession(onChange: () => void) {
  window.addEventListener("focus", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getDashboardSession(): DashboardSession {
  const token = Cookies.get("token") ?? null;
  if (cachedDashboardSession.token === token) return cachedDashboardSession;

  if (!token) {
    cachedDashboardSession = { token, user: null, error: null };
    return cachedDashboardSession;
  }

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Token tidak memiliki payload.");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((character) => `%${("00" + character.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );
    const payload: unknown = JSON.parse(jsonPayload);
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("name" in payload) ||
      typeof payload.name !== "string" ||
      !("role" in payload) ||
      typeof payload.role !== "string"
    ) {
      throw new Error("Data user pada token tidak lengkap.");
    }

    cachedDashboardSession = {
      token,
      user: { name: payload.name, role: payload.role },
      error: null,
    };
  } catch (error) {
    cachedDashboardSession = { token, user: null, error };
  }

  return cachedDashboardSession;
}

const shortcutsByRole: Record<string, Shortcut[]> = {
  ADMIN_SISTEM: [
    {
      title: "Ringkasan sekolah",
      description: "Lihat statistik operasional yang terhubung ke data sekolah.",
      href: "/dashboard/main",
      icon: LayoutDashboard,
    },
    {
      title: "Penerimaan siswa",
      description: "Kelola pendaftaran dan proses PPDB.",
      href: "/dashboard/ppdb",
      icon: Users,
    },
    {
      title: "Data siswa",
      description: "Buka data siswa yang terdaftar.",
      href: "/dashboard/students",
      icon: GraduationCap,
    },
  ],
  ADMIN_TU: [
    {
      title: "Ringkasan sekolah",
      description: "Lihat statistik operasional yang terhubung ke data sekolah.",
      href: "/dashboard/main",
      icon: LayoutDashboard,
    },
    {
      title: "Penerimaan siswa",
      description: "Kelola pendaftaran dan proses PPDB.",
      href: "/dashboard/ppdb",
      icon: Users,
    },
    {
      title: "Data siswa",
      description: "Buka data siswa yang terdaftar.",
      href: "/dashboard/students",
      icon: GraduationCap,
    },
  ],
  GURU: [
    {
      title: "Portal guru",
      description: "Buka materi pembelajaran dan pengelolaan tugas.",
      href: "/dashboard/lms",
      icon: BookOpen,
    },
    {
      title: "Presensi harian",
      description: "Kelola presensi siswa pada kelas yang diampu.",
      href: "/dashboard/attendances",
      icon: Users,
    },
    {
      title: "Penilaian dan rapor",
      description: "Kelola komponen penilaian dan hasil belajar.",
      href: "/dashboard/grades",
      icon: GraduationCap,
    },
  ],
  WALI_KELAS: [
    {
      title: "Presensi harian",
      description: "Kelola presensi siswa pada kelas yang diampu.",
      href: "/dashboard/attendances",
      icon: Users,
    },
    {
      title: "Penilaian dan rapor",
      description: "Kelola komponen penilaian dan hasil belajar.",
      href: "/dashboard/grades",
      icon: GraduationCap,
    },
  ],
  SISWA: [
    {
      title: "Portal siswa",
      description: "Lihat jadwal, materi, dan tugas belajar.",
      href: "/dashboard/student-portal",
      icon: BookOpen,
    },
    {
      title: "Keuangan dan SPP",
      description: "Lihat informasi tagihan sekolah.",
      href: "/dashboard/finance",
      icon: CreditCard,
    },
  ],
};

export default function DashboardPage() {
  const session = useSyncExternalStore(
    subscribeToDashboardSession,
    getDashboardSession,
    () => serverDashboardSession,
  );
  const router = useRouter();

  useEffect(() => {
    if (!session.token) {
      router.replace("/dashboard/main");
      return;
    }

    if (!session.user) {
      console.error("Gagal membaca data user dari token.", session.error);
      Cookies.remove("token");
      router.push("/");
    }
  }, [router, session]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  if (!session.user) {
    return (
      <div role="status" aria-live="polite" className="p-6 text-sm text-brand-ink-muted">
        Memuat dashboard…
      </div>
    );
  }

  const user = session.user;
  const shortcuts = shortcutsByRole[user.role] ?? [];

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-brand-ink-dark">
            Halo, {user.name}
          </h1>
          <p className="text-sm text-brand-ink-muted">
            Anda masuk sebagai {user.role.replace(/_/g, " ")}.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          Keluar
        </Button>
      </header>

      {shortcuts.length > 0 ? (
        <section aria-labelledby="module-shortcuts-title" className="space-y-4">
          <h2
            id="module-shortcuts-title"
            className="text-xl font-semibold text-brand-ink-dark"
          >
            Modul yang tersedia
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="group flex min-h-32 items-start gap-4 rounded-xl border border-brand-line bg-brand-surface p-5 shadow-sm transition-colors hover:border-brand-primary hover:bg-brand-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <shortcut.icon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-brand-primary"
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-brand-ink-dark">
                    {shortcut.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-brand-ink-muted">
                    {shortcut.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-brand-line bg-brand-surface p-6 text-sm text-brand-ink-muted">
          Belum ada modul yang tersedia untuk peran ini.
        </p>
      )}
    </div>
  );
}
