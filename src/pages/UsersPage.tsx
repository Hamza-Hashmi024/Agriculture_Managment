import { useEffect, useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  GetAllUsers,
  AssignRoleToUser,
  CreateUser,
  GetAllRoles,
  Logout,
  LogoutAll,
  ForgotPassword,
  ResetPassword,
} from "@/Api/Api";
import { AuthContext } from "@/Context/AuthContext";
import ForgotPasswordDialog from "@/components/Auth/ForgotPasswordDialog";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Role {
  id: number;
  name: string;
}

export default function UsersPage() {
  const { user: currentUser } = useContext(AuthContext);
  const [userRoleMap, setUserRoleMap] = useState<{ [key: number]: string }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [creating, setCreating] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await GetAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Single logout
  const handleLogout = async (userId: number) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return toast.error("No refresh token found");

      await Logout(refreshToken);
      toast.success("User logged out successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Logout failed");
    }
  };

  // Logout all sessions
  const handleLogoutAll = async (userId: number) => {
    try {
      await LogoutAll(userId);
      toast.success("All sessions logged out successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Logout All failed");
    }
  };

  // Forgot password
  const handleForgotPassword = async (email: string) => {
    try {
      const res = await ForgotPassword(email);
      toast.success(res.message || "Reset token sent to email");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Forgot Password failed");
    }
  };

  // Reset password
  const handleResetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await ResetPassword(token, newPassword);
      toast.success(res.message || "Password reset successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Reset Password failed");
    }
  };

  // Assign role
  const handleRoleChange = async (userId: number, roleId: number) => {
    if (!userId || !roleId) return toast.error("User ID and Role ID required");

    try {
      const res = await AssignRoleToUser(userId, roleId);
      toast.success(res.message || "Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign role");
    }
  };

  // Create new user
  const handleCreateUser = async () => {
    const { name, email, password, role } = newUser;
    if (!name || !email || !password || !role)
      return toast.error("All fields are required");

    try {
      setCreating(true);
      await CreateUser(newUser);
      toast.success("User created successfully!");
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: roles[0]?.name || "",
      });
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.error || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await GetAllRoles();
      setRoles(data);
    } catch {
      toast.error("Failed to fetch roles");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage farmer profiles and information
          </p>
        </div>

         <Button
                          onClick={() => handleLogoutAll(currentUser?.id!)}
                          size="sm"
                          variant="destructive"
                        >
                          Logout All
                        </Button>

        <div className="flex gap-2">
          {/* Create User (Admin Only) */}
          {currentUser?.role === "admin" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New User</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <Input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                  <Select
                    value={newUser.role}
                    onValueChange={(val) =>
                      setNewUser({ ...newUser, role: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name.charAt(0).toUpperCase() +
                            role.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateUser} disabled={creating}>
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>


      </div>

      {/* Users Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Users List ({users.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading users...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Assign Role</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={userRoleMap[user.id] || ""}
                        onValueChange={(val) =>
                          handleRoleChange(user.id, Number(val))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem
                              key={role.id}
                              value={role.id.toString()}
                            >
                              {role.name.charAt(0).toUpperCase() +
                                role.name.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleLogout(user.id)}
                          size="sm"
                          variant="destructive"
                        >
                          Logout
                        </Button>
                       
                       <ForgotPasswordDialog trigger={<Button variant="link">Forgot your password?</Button>} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}