import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingPage from "@/components/LandingPage";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (session?.user) {
    redirect(`/${locale}/dashboard`);
  }

  return <LandingPage />;
}
