import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, Mail, Calendar, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    // In a real app, you would call an API to update the user profile
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen neon-text">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#0a0e27] grid-bg p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/chat")}
            className="dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-4xl font-bold neon-text-pink">My Profile</h1>
        </div>

        {/* Profile Card */}
        {user && (
          <Card className="bg-card dark:bg-[#1a1f3a] border-[#00ffff]/30 neon-border p-8">
            <div className="space-y-6">
              {/* User ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold neon-text mb-2">
                  <User size={18} />
                  User ID
                </label>
                <div className="bg-muted dark:bg-[#0a0e27] p-3 rounded border border-[#00ffff]/20 text-foreground dark:text-[#00ffff]">
                  {user.id}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold neon-text mb-2">
                  <User size={18} />
                  Name
                </label>
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="dark:bg-[#1a1f3a] dark:border-[#00ffff]/30 dark:text-[#00ffff]"
                  />
                ) : (
                  <div className="bg-muted dark:bg-[#0a0e27] p-3 rounded border border-[#00ffff]/20 text-foreground dark:text-[#00ffff]">
                    {name || "Not set"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold neon-text mb-2">
                  <Mail size={18} />
                  Email
                </label>
                {isEditing ? (
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    className="dark:bg-[#1a1f3a] dark:border-[#00ffff]/30 dark:text-[#00ffff]"
                  />
                ) : (
                  <div className="bg-muted dark:bg-[#0a0e27] p-3 rounded border border-[#00ffff]/20 text-foreground dark:text-[#00ffff]">
                    {email || "Not set"}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold neon-text mb-2">
                  <Shield size={18} />
                  Role
                </label>
                <div className="bg-muted dark:bg-[#0a0e27] p-3 rounded border border-[#00ffff]/20">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold inline-block ${
                      user.role === "admin"
                        ? "bg-[#ff00ff]/20 text-[#ff00ff]"
                        : "bg-[#00ffff]/20 text-[#00ffff]"
                    }`}
                  >
                    {user.role === "admin" ? "Administrator" : "User"}
                  </span>
                </div>
              </div>

              {/* Joined Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold neon-text mb-2">
                  <Calendar size={18} />
                  Joined
                </label>
                <div className="bg-muted dark:bg-[#0a0e27] p-3 rounded border border-[#00ffff]/20 text-foreground dark:text-[#00ffff]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Last Signed In */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold neon-text mb-2">
                  <Calendar size={18} />
                  Last Signed In
                </label>
                <div className="bg-muted dark:bg-[#0a0e27] p-3 rounded border border-[#00ffff]/20 text-foreground dark:text-[#00ffff]">
                  {new Date(user.lastSignedIn).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-accent dark:bg-[#ff00ff] text-white hover:bg-accent/90 dark:hover:bg-[#ff00ff]/90"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="dark:border-[#00ffff]/30 dark:text-[#00ffff] dark:hover:bg-[#00ffff]/10"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-accent dark:bg-[#ff00ff] text-white hover:bg-accent/90 dark:hover:bg-[#ff00ff]/90"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
