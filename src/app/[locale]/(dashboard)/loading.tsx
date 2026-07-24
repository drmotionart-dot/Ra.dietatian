import { getTranslations } from "next-intl/server";

export default async function DashboardLoading() {
  const t = await getTranslations();
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground animate-pulse">{t("common.loading")}</div>
      </div>
    </div>
  );
}
