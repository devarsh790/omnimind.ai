import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, FileText, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch all users
  const { data: usersList } = trpc.admin.listUsers.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Fetch analytics
  const { data: analyticsData } = trpc.admin.getAnalytics.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Update user role mutation
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated");
      // Refetch users
    },
    onError: () => toast.error("Failed to update user role"),
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (usersList) {
      setUsers(usersList);
    }
  }, [usersList]);

  useEffect(() => {
    if (analyticsData) {
      setAnalytics(analyticsData);
    }
  }, [analyticsData]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen neon-text">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#0a0e27] grid-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neon-text-pink mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground dark:text-[#00ffff]/60">System analytics and user management</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 p-6 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#00ffff]/60">Total Users</p>
                  <p className="text-3xl font-bold neon-text">{analytics.totalUsers}</p>
                </div>
                <Users size={32} className="text-accent dark:text-[#ff00ff]" />
              </div>
            </Card>

            <Card className="bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 p-6 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#00ffff]/60">Total Messages</p>
                  <p className="text-3xl font-bold neon-text">{analytics.totalMessages}</p>
                </div>
                <MessageSquare size={32} className="text-accent dark:text-[#ff00ff]" />
              </div>
            </Card>

            <Card className="bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 p-6 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#00ffff]/60">Total Documents</p>
                  <p className="text-3xl font-bold neon-text">{analytics.totalDocuments}</p>
                </div>
                <FileText size={32} className="text-accent dark:text-[#ff00ff]" />
              </div>
            </Card>

            <Card className="bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 p-6 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#00ffff]/60">Active Users</p>
                  <p className="text-3xl font-bold neon-text">{analytics.activeUsers}</p>
                </div>
                <Activity size={32} className="text-accent dark:text-[#ff00ff]" />
              </div>
            </Card>
          </div>
        )}

        {/* Users Table */}
        <Card className="bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 neon-border">
          <div className="p-6">
            <h2 className="text-2xl font-bold neon-text-pink mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00ffff]/20">
                    <th className="text-left p-3 text-sm font-semibold neon-text">ID</th>
                    <th className="text-left p-3 text-sm font-semibold neon-text">Name</th>
                    <th className="text-left p-3 text-sm font-semibold neon-text">Email</th>
                    <th className="text-left p-3 text-sm font-semibold neon-text">Role</th>
                    <th className="text-left p-3 text-sm font-semibold neon-text">Joined</th>
                    <th className="text-left p-3 text-sm font-semibold neon-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5 transition-colors">
                      <td className="p-3 text-sm text-foreground dark:text-[#00ffff]">{u.id}</td>
                      <td className="p-3 text-sm text-foreground dark:text-[#00ffff]">{u.name || "N/A"}</td>
                      <td className="p-3 text-sm text-foreground dark:text-[#00ffff]">{u.email || "N/A"}</td>
                      <td className="p-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-[#ff00ff]/20 text-[#ff00ff]"
                              : "bg-[#00ffff]/20 text-[#00ffff]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-foreground dark:text-[#00ffff]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newRole = u.role === "admin" ? "user" : "admin";
                            updateRoleMutation.mutate({
                              userId: u.id,
                              role: newRole as "user" | "admin",
                            });
                          }}
                          className="dark:border-[#ff00ff]/30 dark:text-[#ff00ff] dark:hover:bg-[#ff00ff]/10"
                        >
                          Make {u.role === "admin" ? "User" : "Admin"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
