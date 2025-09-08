import { useState } from "react";
import { useSearchParams ,  useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ResetPassword } from "@/Api/Api";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newPassword || !confirmPassword)
    return toast.error("Please fill both fields");
  if (newPassword !== confirmPassword)
    return toast.error("Passwords do not match");

  try {
    setLoading(true);
    const res = await ResetPassword(token!, newPassword);
    toast.success(res.message || "Password reset successful!");
    navigate("/login"); 
  } catch (err: any) {
    toast.error(err?.error || "Failed to reset password");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}