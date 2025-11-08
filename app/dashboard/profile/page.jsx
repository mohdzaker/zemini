"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import updatePassword from "@/actions/updatePassword";
import updateProfile from "@/actions/updateProfile";

export default function ProfilePage() {
  const { data, isLoading } = useProfile();
  const user = data?.data;

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  // ✅ Auto-fill profile info
  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("full_name", full_name);
    if (avatar) formData.append("avatar", avatar);

    const res = await updateProfile(formData);
    if (res.status === "success") {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Handle Password Update
  const handleChangePassword = async () => {
    if (!current || !newPass || !confirm) {
      toast.error("All fields are required!");
      return;
    }

    if (newPass !== confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    const res = await updatePassword(current, newPass);
    if (res.status === "success") {
      toast.success(res.message);
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } else {
      toast.error(res.message);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-muted-foreground">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10 max-w-3xl mx-auto"
      >
        {/* PROFILE INFORMATION */}
        <Card className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Profile Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <label className="relative group cursor-pointer">
                <img
                  src={preview || user?.image_link}
                  className="w-20 h-20 rounded-full object-cover shadow-lg border border-border/40 group-hover:opacity-80 transition"
                />

                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Upload size={20} className="text-white" />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              <Button
                variant="outline"
                className="text-sm"
                onClick={() =>
                  document.querySelector("input[type='file']").click()
                }
              >
                Change Avatar
              </Button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="bg-transparent focus:ring-2 focus:ring-primary opacity-60 cursor-not-allowed"
              />
            </div>

            <Button
              onClick={handleSaveChanges}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition w-full"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* CHANGE PASSWORD */}
        <Card className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Change Password
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition w-full"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
