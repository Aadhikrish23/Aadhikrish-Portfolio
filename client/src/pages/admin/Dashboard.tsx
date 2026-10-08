import { useEffect, useState } from "react";
import dashboardApi from "../../APIServices/dashboard.api";
import StatCard from "../../components/common/StatCard";
import { Button, Loading, PageHeader } from "../../components/admin/ui";

interface Stats {
  projects: number;
  blogs: number;
  skills: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    dashboardApi
      .getDashboardStats()
      .then((data) => !cancelled && setStats(data))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setFailed(false);
    setAttempt((n) => n + 1);
  };

  return (
    <div className="space-y-10">
      <PageHeader title="Dashboard" description="What is on your portfolio right now. Pick a card to manage it." />

      {failed ? (
        <div className="border border-line bg-surface p-6">
          <p className="text-fg">Could not load the numbers.</p>
          <p className="mt-1 text-muted">The server may still be waking up.</p>
          <Button className="mt-4" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : !stats ? (
        <Loading rows={1} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Projects" value={stats.projects} to="/admin/projects" />
          <StatCard title="Blog posts" value={stats.blogs} to="/admin/blogs" />
          <StatCard title="Skills" value={stats.skills} to="/admin/skills" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
