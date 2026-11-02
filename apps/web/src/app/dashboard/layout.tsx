import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh bg-brand-background">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-clip overflow-y-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}