import { useEffect, useState } from "react";
import dashboardApi from "../../APIServices/dashboard.api";
import StatCard from "../../components/common/StatCard";

interface Stats {
  projects: number;
  blogs: number;
  skills: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    blogs: 0,
    skills: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here is what's happening with your portfolio today.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <div className="h-32 bg-slate-200/50 rounded-2xl animate-pulse" />
            <div className="h-32 bg-slate-200/50 rounded-2xl animate-pulse" />
            <div className="h-32 bg-slate-200/50 rounded-2xl animate-pulse" />
          </>
        ) : (
          <>
            <StatCard title="Total Projects" value={stats.projects} />
            <StatCard title="Published Blogs" value={stats.blogs} />
            <StatCard title="Skills Tracked" value={stats.skills} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;