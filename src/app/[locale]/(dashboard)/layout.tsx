import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import { MainNav, DesktopSidebar } from "@/components/layout/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean<{ isOnboarded?: boolean }>();

  if (user && !user.isOnboarded) {
    redirect(`/${locale}/onboarding`);
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
