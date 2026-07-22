import { MainNav, DesktopSidebar } from "@/components/layout/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="md:ml-64 pb-16 md:pb-0">
        {children}
      </main>
      <MainNav />
    </div>
  );
}
