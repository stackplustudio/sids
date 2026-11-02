"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserPlus,
  GraduationCap,
  Briefcase,
  BookOpen,
  Library,
  CalendarDays,
  LayoutDashboard,
  UserCheck,
  LogOut,
  CheckSquare,
  BookMarked,
  FileText,
  Wallet,
  Menu,
  X,
} from "lucide-react";

const menuGroups = [
  {
    groupName: "Ringkasan",
    roles: ["ADMIN_SISTEM", "ADMIN_TU"],
    items: [{ name: "Dashboard utama", path: "/dashboard/main", icon: LayoutDashboard }],
  },
  {
    groupName: "Penerimaan siswa",
    roles: ["ADMIN_SISTEM", "ADMIN_TU"],
    items: [
      { name: "Manajemen PPDB", path: "/dashboard/ppdb", icon: Users },
      { name: "Daftar ulang", path: "/dashboard/daftar-ulang", icon: UserPlus },
    ],
  },
  {
    groupName: "Data sekolah",
    roles: ["ADMIN_SISTEM", "ADMIN_TU"],
    items: [
      { name: "Master siswa", path: "/dashboard/students", icon: GraduationCap },
      { name: "Master guru", path: "/dashboard/teachers", icon: Briefcase },
      { name: "Data mata pelajaran", path: "/dashboard/subjects", icon: BookOpen },
    ],
  },
  {
    groupName: "Akademik dan KBM",
    roles: ["ADMIN_SISTEM", "ADMIN_TU"],
    items: [
      { name: "Manajemen kelas", path: "/dashboard/classes", icon: Library },
      { name: "Penempatan", path: "/dashboard/enrollments", icon: UserCheck },
      { name: "Jadwal", path: "/dashboard/schedules", icon: CalendarDays },
      { name: "Perizinan dan cuti", path: "/dashboard/leave-requests", icon: FileText },
      { name: "Keuangan dan SPP", path: "/dashboard/finance", icon: Wallet },
    ],
  },
  {
    groupName: "Ruang guru",
    roles: ["GURU", "ADMIN_SISTEM", "ADMIN_TU"],
    items: [
      { name: "Portal guru (LMS)", path: "/dashboard/lms", icon: LayoutDashboard },
      { name: "Presensi harian", path: "/dashboard/attendances", icon: CheckSquare },
      { name: "Penilaian dan rapor", path: "/dashboard/grades", icon: BookMarked },
    ],
  },
  {
    groupName: "Ruang siswa",
    roles: ["SISWA"],
    items: [
      { name: "Portal siswa", path: "/dashboard/student-portal", icon: LayoutDashboard },
      { name: "Perizinan dan cuti", path: "/dashboard/leave-requests", icon: FileText },
      { name: "Keuangan dan SPP", path: "/dashboard/finance", icon: Wallet },
    ],
  },
];

let cachedUserJson: string | null | undefined;
let cachedUserRole: string | null = null;

function getStoredUserRole() {
  let storedUser: string | null;
  try {
    storedUser = window.localStorage.getItem("user");
  } catch (error) {
    console.error("Gagal membaca data user.", error);
    return "ADMIN_TU";
  }

  if (storedUser === cachedUserJson) return cachedUserRole;
  cachedUserJson = storedUser;
  if (!storedUser) {
    cachedUserRole = "ADMIN_TU";
    return cachedUserRole;
  }

  try {
    const user: { role?: unknown } = JSON.parse(storedUser);
    cachedUserRole = typeof user.role === "string" ? user.role : "ADMIN_TU";
  } catch (error) {
    console.error("Gagal membaca role user.", error);
    cachedUserRole = "ADMIN_TU";
  }
  return cachedUserRole;
}

function subscribeToUser(onChange: () => void) {
  window.addEventListener("focus", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export default function Sidebar() {
  const pathname = usePathname();
  const role = useSyncExternalStore(subscribeToUser, getStoredUserRole, () => null);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isMenuOpen = openPath === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[var(--z-sticky-nav)] flex h-16 items-center gap-3 border-b border-brand-line bg-brand-surface px-4 lg:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setOpenPath((path) => (path === pathname ? null : pathname))}
          className="inline-flex size-10 items-center justify-center rounded-lg text-brand-ink transition-colors duration-[var(--dur-short)] hover:bg-brand-surface-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Image
          src="/logo.jpg"
          alt="Eduscout"
          width={500}
          height={200}
          className="h-9 w-auto max-w-36 object-contain"
          priority
        />
      </header>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setOpenPath(null)}
          className="fixed inset-0 z-[var(--z-overlay)] bg-brand-ink-dark/40 lg:hidden"
        />
      )}

      <aside
        id="primary-navigation"
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-[var(--z-nav)] flex h-svh w-72 flex-col border-r border-brand-line bg-brand-surface transition-transform duration-[var(--dur-long)] ease-out lg:sticky lg:top-0 lg:h-svh lg:w-64 lg:translate-x-0 lg:transition-none ${
          isMenuOpen ? "visible translate-x-0" : "invisible -translate-x-full lg:visible"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center border-b border-brand-line px-6">
          <Image
            src="/logo.jpg"
            alt="Eduscout"
            width={500}
            height={200}
            className="h-10 w-40 object-contain object-left"
            priority
          />
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {menuGroups.map((group) => {
            if (!role || !group.roles.includes(role)) return null;

            return (
              <section key={group.groupName} className="mb-6 last:mb-0">
                <h2 className="mb-2 px-3 text-xs font-medium text-brand-ink-muted">
                  {group.groupName}
                </h2>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.path || pathname.startsWith(`${item.path}/`);

                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setOpenPath(null)}
                          className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-[var(--dur-short)] ${
                            isActive
                              ? "bg-brand-primary-soft text-brand-primary-dark"
                              : "text-brand-ink hover:bg-brand-surface-alt hover:text-brand-ink-dark"
                          }`}
                        >
                          <Icon className="size-5 shrink-0" aria-hidden="true" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-brand-line p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-brand-ink-muted transition-colors duration-[var(--dur-short)] hover:bg-danger-soft hover:text-danger-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />
            <span>Keluar sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
