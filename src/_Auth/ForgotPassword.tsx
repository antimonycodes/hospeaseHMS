import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/_auth/useAuthStore";
import logo from "../assets/logo-full.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await forgotPassword({ email });
    if (response) {
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigate("/signin");
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#E3FFF2] flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-56 mb-6">
          <img src={logo} alt="Hospease Logo" />
        </div>
        <div className="bg-white py-8 px-7 border border-[#D0D5DD] rounded-[10px] max-w-md w-full flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#E3FFF2] p-4 rounded-full mb-4">
              <CheckCircle size={48} className="text-[#009952]" />
            </div>
            <h1 className="text-center text-[#101928] text-2xl font-semibold mb-2">
              Check Your Email
            </h1>
            <p className="text-center text-[#667185] max-w-xs">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and spam folder.
            </p>
          </div>

          <div className="w-full space-y-4">
            {/* <button
              className="w-full py-3 text-white font-medium text-lg bg-[#009952] rounded-md hover:bg-[#00783E] hover:shadow-md transition-all"
              onClick={() => window.open("https://mail.google.com", "_blank")}
            >
              Open Email App
            </button> */}

            <button
              className="w-full py-3 text-[#009952] font-medium text-lg bg-white border border-[#009952] rounded-md hover:bg-[#F0FFF8] transition-all flex items-center justify-center"
              onClick={handleBackToLogin}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Login
            </button>
          </div>

          <p className="text-sm text-[#667185] mt-6">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              className="text-[#009952] font-medium hover:underline"
              onClick={() => setIsSubmitted(false)}
            >
              try another email
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E3FFF2] flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-56 mb-6">
        <img src={logo} alt="Hospease Logo" />
      </div>
      <div className="bg-white py-8 px-7 border border-[#D0D5DD] rounded-[10px] max-w-md w-full">
        <div>
          <h1 className="text-center text-[#101928] text-2xl font-semibold mb-2">
            Forgot Password
          </h1>
          <p className="text-center text-sm md:text-base text-[#667185]">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <div className="mt-8 w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-[#E3FFF2] p-4 rounded-full">
              <Mail size={32} className="text-[#009952]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-[#101928] font-semibold text-xs mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[#009952] rounded-md outline-none focus:outline-none"
                required
              />
              <div className="absolute right-3 top-[60%] transform -translate-y-1/2">
                <Mail color="#667185" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-medium text-lg bg-[#009952] rounded-md hover:bg-[#00783E] hover:shadow-md transition-all flex items-center justify-center
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <>
                  Sending
                  <Loader2 className="ml-2 size-5 animate-spin" />
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <button
            onClick={handleBackToLogin}
            className="w-full mt-4 py-3 text-[#009952] font-medium bg-white border border-[#009952] rounded-md hover:bg-[#F0FFF8] transition-all flex items-center justify-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
