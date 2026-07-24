export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    </div>
  );
}
