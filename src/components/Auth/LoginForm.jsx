import { useState, useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Autofill from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const passwordParam = params.get("password");

    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (passwordParam) setPassword(decodeURIComponent(passwordParam));
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        setError("");
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
        {/* Left Section */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden flex-col  justify-center md:flex md:pl-12"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-semibold">Secure by Design</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-snug text-gray-900">
            Welcome to
            <span className="block text-green-600">Arthi Business</span>
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Sign in to access your dashboard, manage records,
            and continue where you left off.
          </p>
        </motion.div>

        {/* Right Section → Login Card */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <Card className="w-full max-w-md border border-gray-100 bg-white shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Sign in</CardTitle>
              <CardDescription className="text-gray-500">
                Use your email & password to continue
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {/* Error Box */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full rounded-xl bg-green-600 hover:bg-green-700">
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}