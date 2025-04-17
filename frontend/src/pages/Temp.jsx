import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, MessageSquare, User, Sparkles } from "lucide-react";

const roles = [
  { name: "Artist", color: "text-sky-500 border-sky-300 shadow-[0_0_8px_2px_rgba(125,211,252,0.5)]", hoverBorder: "border-sky-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(125,211,252,0.5)]"},
  { name: "Writer", color: "text-purple-500 border-purple-300 shadow-[0_0_8px_2px_rgba(221,214,254,0.5)]", hoverBorder: "border-purple-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(221,214,254,0.5)]"},
  { name: "Dual Creator", color: "text-pink-500 border-pink-300 shadow-[0_0_8px_2px_rgba(251,207,232,0.5)]", hoverBorder: "border-pink-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(251,207,232,0.5)]"},
  { name: "Enthusiast", color: "text-green-500 border-green-300 shadow-[0_0_8px_2px_rgba(187,247,208,0.5)]", hoverBorder: "border-green-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(187,247,208,0.5)]"},
];

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "",
    password: ""
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-5" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Full Name</span>
              </label>
              <div className="relative flex items-center">
                <User className="size-5 absolute left-3 text-violet-300 z-10" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Email</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="size-5 absolute left-3 z-10 text-sky-300" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Username */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Username</span>
              </label>
              <div className="relative flex items-center">
                <Sparkles className="size-5 absolute left-3 z-10 text-pink-300" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="cooluser_xoxo"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Role</span>
              </label>
              <div className="grid grid-cols-2 gap-4 font-medium text-gray-700">
                {roles.map((role) => (
                  <div
                    key={role.name}
                    className={`w-full rounded-xl flex items-center justify-center border border-gray-300 
                      transition-all duration-300 p-2 cursor-pointer 
                      ${
                        selectedRole === role.name
                          ? `${role.color} font-semibold`
                          : `hover:${role.hoverBorder} hover:${role.hoverGlow}`
                      }`}
                    onClick={() => handleRoleSelect(role.name)}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="size-5 absolute left-3 text-base-content/40 z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
