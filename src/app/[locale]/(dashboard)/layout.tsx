import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MainNav, DesktopSidebar } from "@/components/layout/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="md:ms-64 pb-16 md:pb-0">
        {children}
      </main>
      <MainNav />
    </div>
  );
}
