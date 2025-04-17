import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Shell } from "lucide-react";
import MangaGrid from "../components/MangaGrid"


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-50
              transition-colors"
              >
                <Shell className="w-6 h-6 text-purple-500" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button type="submit" className="btn bg-purple-400 text-white border-none w-full size-12 text-base transition-colors duration-500 ease-in-out hover:bg-purple-500" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="flex justify-center items-center mt-0 gap-x-1">
            <p className="text-base-content/60 flex justify-center items-center">
              You don't have an account?
            </p>
            <Link to="/signup" className="link text-purple-400 no-underline hover:text-purple-300">
              Sign up here.
            </Link>
          </div>  
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <MangaGrid />
      </div>

    </div>
  );
};
export default LoginPage;