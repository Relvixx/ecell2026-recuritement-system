import { AdminShell, EmptyState, MetricCard, SkeletonBlock } from '@/components';

export default function AdminDashboardPage() {
  return (
    <AdminShell
      adminSlot="Admin identity slot"
      subtitle="Reusable admin workspace shell for future candidate operations."
      title="Admin application shell"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard accent="var(--status-submitted)" label="Total Applications" />
        <MetricCard accent="var(--status-under-review)" label="Under Review" />
        <MetricCard accent="var(--status-selected)" label="Selected" />
      </div>
      <EmptyState
        description="New candidates will appear here once recruitment opens."
        title="No applications yet."
      />
      <div className="grid gap-3 rounded-[var(--radius-paper)] border border-border bg-surface p-5">
        <SkeletonBlock />
        <SkeletonBlock className="w-10/12" />
        <SkeletonBlock className="w-8/12" />
      </div>
    </AdminShell>
  );
}
