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
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          </>
        ) : (
          <>
            <StatCard title="Projects" value={stats.projects} />
            <StatCard title="Blogs" value={stats.blogs} />
            <StatCard title="Skills" value={stats.skills} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;