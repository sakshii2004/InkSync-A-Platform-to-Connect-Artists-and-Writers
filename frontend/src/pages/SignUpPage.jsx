import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, Mail, Shell, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"
import MangaGrid from "../components/MangaGrid"

const roles = [
  { name: "Artist", color: "text-sky-500 border-sky-300 shadow-[0_0_8px_2px_rgba(125,211,252,0.5)]", hoverBorder: "border-sky-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(125,211,252,0.5)]"},
  { name: "Writer", color: "text-green-500 border-green-300 shadow-[0_0_8px_2px_rgba(187,247,208,0.5)]", hoverBorder: "border-green-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(187,247,208,0.5)]"},
  { name: "Dual Creator", color: "text-pink-500 border-pink-300 shadow-[0_0_8px_2px_rgba(251,207,232,0.5)]", hoverBorder: "border-pink-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(251,207,232,0.5)]"},
  { name: "Enthusiast", color: "text-purple-500 border-purple-300 shadow-[0_0_8px_2px_rgba(221,214,254,0.5)]", hoverBorder: "border-purple-300", hoverGlow: "shadow-[0_0_8px_2px_rgba(221,214,254,0.5)]"},
];

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
  };

  const validateForm = () => {
    const { fullName, email, username, role, password, confirmPassword } = formData;  
    if (!fullName.trim()) return toast.error("Full name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if (email.length > 255) return toast.error("Email is too long");
    if (!username.trim()) return toast.error("Username is required");
    if (username.length < 3) return toast.error("Username must be at least 3 characters");
    if (username.length > 20) return toast.error("Username must be less than 20 characters");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return toast.error("Username can only contain letters, numbers, and underscores");
    if (!role) return toast.error("Please select a role");
    if (!password.trim()) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!confirmPassword.trim()) return toast.error("Confirm password is required");
    if (password !== confirmPassword) return toast.error("Passwords do not match"); 
    console.log("Validation passed!"); 
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      const { confirmPassword, ...dataToSend } = formData;
      signup(dataToSend);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 mt-12">
        <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-purple-100 flex items-center justify-center 
              group-hover:bg-purple-50 transition-colors"
              >
                <Shell className="w-6 h-6 text-purple-500" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Join InkSync</h1>
              <p className="text-base-content/60">Where words meet wonder.</p>
              </div>
          </div>
          {/*
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-5" />
              </div>
            </div>
          </div>
          */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Full Name</span>
              </label>
              <div className="relative flex items-center">
                <User className="size-5 absolute left-3 text-purple-300 z-10" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 focus:outline-none focus:ring-0 focus:border-gray-500"
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
                  className="input input-bordered w-full pl-10 focus:outline-none focus:ring-0 focus:border-gray-500"
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
                  className="input input-bordered w-full pl-10 focus:outline-none focus:ring-0 focus:border-gray-500"
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
                      ${ selectedRole !== role.name ? "hover:shadow-[0_0_8px_2px_rgba(209,213,219,0.6)]" : ""}
                      ${
                        selectedRole === role.name
                          ? `${role.color} font-semibold`
                          : ""
                      }`}
                    onClick={() => handleRoleSelect(role.name)}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Password</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="size-5 absolute left-3 text-base-content/40 z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 focus:outline-none focus:ring-0 focus:border-gray-500"
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
            
            {/* Confirm Password */}
            <div className="form-control space-y-1">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Confirm Password</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="size-5 absolute left-3 text-base-content/40 z-10" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 focus:outline-none focus:ring-0 focus:border-gray-500"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn bg-purple-400 text-white border-none w-full size-12 text-base transition-colors duration-500 ease-in-out hover:bg-purple-300" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="flex justify-center items-center mt-0 gap-x-1">
            <p className="text-base-content/60 flex justify-center items-center">
              You already have an account?
            </p>
            <Link to="/login" className="link text-purple-400 no-underline hover:text-purple-300">
              Sign in here.
            </Link>
          </div>         
        </div>
      </div>

      <div className="hidden md:flex fixed top-0 right-0 w-1/2 h-full items-center justify-center z-10 pointer-events-none">
        <MangaGrid />
      </div>

    </div>
  );
};

export default SignUpPage;
