import { useAuth } from "./auth/AuthContext";
import { useState, useEffect } from "react";
import { getUserById, updateUser } from "./api/users.api";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router";

export default function Profile() {
  const { authState } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user?.id) {
      getUserById(authState.user.id)
        .then((user) => {
          setForm({ name: user.name, email: user.email, password: "" });
        })
        .finally(() => setLoading(false));
    }
  }, [authState.user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!authState.user?.id) return;
    e.preventDefault();
    setError("");
    setSuccess("");
    const data: Partial<{ name: string; email: string; password: string }> = {
      ...(form.name && { name: form.name }),
      ...(form.email && { email: form.email }),
      ...(form.password && { password: form.password }),
    };

    try {
      await updateUser(authState.user.id, data);
      setSuccess("Profile updated successfully.");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch {
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-card p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            placeholder="Leave blank to keep current password"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex gap-2">
          <Button type="submit">Update</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
