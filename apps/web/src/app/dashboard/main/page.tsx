"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

type AdminOverview = {
  statistik: {
    totalSiswa: number;
    totalGuru: number;
    totalKelas: number;
    totalPendaftar: number;
  };
  informasi_akademik?: string;
};

type DashboardStat = {
  title: string;
  value: number;
};

function getInitialUserName() {
  if (typeof window === "undefined") return "Admin";

  try {
    const storedUser = window.localStorage.getItem("user");
    if (!storedUser) return "Admin";

    const user: { name?: unknown } = JSON.parse(storedUser);
    return typeof user.name === "string" && user.name.trim() ? user.name : "Admin";
  } catch (error) {
    console.error("Gagal membaca nama user.", error);
    return "Admin";
  }
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [userName] = useState(getInitialUserName);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      setStatus("loading");
      try {
        const res = await api.get<AdminOverview>("/dashboard-stats/admin-overview");
        const stats = res.data?.statistik;
        if (
          !stats ||
          ![
            stats.totalSiswa,
            stats.totalGuru,
            stats.totalKelas,
            stats.totalPendaftar,
          ].every((value) => Number.isFinite(value))
        ) {
          throw new Error("Respons statistik sekolah tidak lengkap.");
        }
        if (active) {
          setData(res.data);
          setStatus("success");
        }
      } catch {
        if (active) {
          setData(null);
          setStatus("error");
          toast.error("Gagal memuat data statistik.");
        }
      }
    };

    void fetchStats();
    return () => {
      active = false;
    };
  }, [reload]);

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-8"
      >
        <p className="text-sm text-brand-ink-muted">Memuat ringkasan sekolah…</p>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-8">
        <section
          role="alert"
          className="max-w-2xl rounded-xl border border-brand-line bg-brand-surface p-6 shadow-sm sm:p-8"
        >
          <h1 className="text-2xl font-semibold text-brand-ink-dark">
            Ringkasan belum tersedia
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-ink-muted">
            Data sekolah belum dapat dimuat. Periksa koneksi, lalu coba kembali.
          </p>
          <Button
            type="button"
            className="mt-5"
            onClick={() => setReload((count) => count + 1)}
          >
            Coba lagi
          </Button>
        </section>
      </div>
    );
  }

  const stats: DashboardStat[] = [
    { title: "Siswa aktif", value: data.statistik.totalSiswa },
    { title: "Tenaga pendidik", value: data.statistik.totalGuru },
    { title: "Rombongan belajar", value: data.statistik.totalKelas },
    { title: "Pendaftar PPDB", value: data.statistik.totalPendaftar },
  ];

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-brand-ink-dark">
            Selamat datang, {userName}
          </h1>
          <p className="text-sm leading-6 text-brand-ink-muted">
            Ringkasan data operasional sekolah.
          </p>
        </div>
        {data.informasi_akademik && (
          <p className="inline-flex min-h-10 items-center rounded-lg border border-brand-line bg-brand-surface px-3 text-sm text-brand-ink">
            {data.informasi_akademik}
          </p>
        )}
      </header>

      <section aria-labelledby="school-overview-title" className="space-y-4">
        <h2
          id="school-overview-title"
          className="text-xl font-semibold text-brand-ink-dark"
        >
          Ikhtisar sekolah
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="min-w-0 rounded-xl border border-brand-line bg-brand-surface p-5 shadow-sm"
            >
              <dt className="whitespace-nowrap text-sm font-medium text-brand-ink-muted">
                {stat.title}
              </dt>
              <dd className="mt-3 text-3xl font-semibold tabular-nums text-brand-ink-dark">
                {new Intl.NumberFormat("id-ID").format(stat.value)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
