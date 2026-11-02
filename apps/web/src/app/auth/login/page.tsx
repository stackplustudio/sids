"use client";

import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login berhasil!");

      const userRole = res.data.user.role;
      if (userRole === "SISWA") {
        window.location.href = "/dashboard/student-portal";
      } else if (userRole === "GURU") {
        window.location.href = "/dashboard/lms";
      } else {
        window.location.href = "/dashboard/main";
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Email atau kata sandi salah"
        : "Login tidak dapat diproses. Silakan coba kembali.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-svh bg-brand-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-2xl border border-brand-line bg-brand-surface shadow-lg lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between bg-brand-surface-alt p-10 text-brand-ink-dark lg:flex lg:p-12">
          <div className="inline-flex w-fit items-center rounded-lg bg-brand-surface p-2">
            <Image
              src="/logo.jpg"
              alt="Eduscout"
              width={500}
              height={200}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          <div className="max-w-lg space-y-5">
            <h1 className="max-w-[12ch] text-4xl font-semibold leading-tight">
              School Integrated Digital System
            </h1>
            <p className="max-w-md text-base leading-relaxed text-brand-ink">
              Satu portal untuk menghubungkan layanan akademik dan operasional sekolah.
            </p>
          </div>

          <p className="text-sm text-brand-ink-muted">
            Kelola kebutuhan sekolah melalui akun Eduscout Anda.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[400px]">
            <div className="mb-8 flex justify-center lg:hidden">
              <Image
                src="/logo.jpg"
                alt="Eduscout"
                width={500}
                height={200}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold text-brand-ink-dark">
                Selamat datang kembali
              </h2>
              <p className="text-sm leading-6 text-brand-ink-muted">
                Masuk menggunakan kredensial akun sekolah Anda.
              </p>
            </div>

            <form id="login-form" onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-brand-ink">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 bg-brand-surface"
                  placeholder="nama@sekolah.sch.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-brand-ink">
                  Kata sandi
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 bg-brand-surface"
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-1">
                <a
                  href="#"
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full"
              >
                {isLoading ? "Memverifikasi…" : "Masuk"}
              </Button>

              <div className="flex items-center gap-4 py-2 text-sm text-brand-ink-muted">
                <span className="h-px flex-1 bg-brand-line" />
                <span>atau</span>
                <span className="h-px flex-1 bg-brand-line" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-11">
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-11">
                  Facebook
                </Button>
              </div>

              <p className="pt-4 text-center text-sm text-brand-ink-muted">
                Belum memiliki akun?{" "}
                <a href="#" className="font-medium text-brand-primary hover:underline">
                  Daftar sekarang
                </a>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
