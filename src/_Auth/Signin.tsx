import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2, Mail } from "lucide-react";
import logo from "../assets/logo-full.png";
import { useAuthStore } from "../store/_auth/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
// import { useAdminStore } from "../store/_auth/useAuthStore";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { login, isLoading } = useAuthStore();

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login(formData);
    if (response) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-[#E3FFF2] flex flex-col items-center justify-center h-screen">
      <div className="w-56">
        <img src={logo} alt="Hospease Logo" />
      </div>
      <div className="bg-white py-8 px-7 border border-[#D0D5DD] rounded-[10px] mt-4 flex flex-col items-center">
        <div>
          <h1 className="text-center text-[#101928] text-3xl font-semibold mb-2">
            Log In
          </h1>
          <p className="text-sm md:text-base text-[#667185]">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-full">
          {/* Email Input */}
          <div className="mb-4 relative">
            <label className="block text-[#101928] font-semibold text-xs">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full md:w-[400px] mt-1 p-3 border border-[#009952] rounded-md outline-none focus:outline-none"
              required
            />
            <div className="absolute right-3 top-[70%] transform -translate-y-1/2">
              <Mail color="#667185" size={20} />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label className="block text-[#101928] font-semibold text-xs">
              PASSWORD
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full md:w-[400px] mt-1 p-3 border border-[#009952] rounded-md outline-none focus:outline-none"
              required
            />
            <div
              className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEye size={20} className="text-[#667185]" />
              ) : (
                <FaEyeSlash
                  size={20}
                  className="text-[#667185] transition-all"
                />
              )}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-1">
              <input type="checkbox" id="rememberMe" />
              <label
                htmlFor="rememberMe"
                className="text-[#101928] font-medium text-xs"
              >
                Remember me for 30 days
              </label>
            </div>
            <Link to="/forgot-password">
              <h3 className="text-[#009952] text-xs cursor-pointer">
                Forgot password?
              </h3>
            </Link>
          </div>

          {/* Error Message */}
          {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={!!isLoading}
            className={`w-full py-3 text-white font-medium text-lg bg-[#009952] rounded-md hover:bg-[#00783E] hover:shadow-md transition-all flex items-center justify-center
               ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                {/* Logging in */}
                <Loader2 className=" size-6 mr-2 animate-spin" />
              </>
            ) : (
              "Login to Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
