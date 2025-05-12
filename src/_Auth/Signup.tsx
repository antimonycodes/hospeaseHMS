import { useState } from "react";
import { Mail, CheckSquare, Square } from "lucide-react";
import logo from "../assets/logo-full.png";
import onboardingImg from "../assets/onboardingImg.png";
import { useAuthStore } from "../store/_auth/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    logo: null as File | null,
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("You must accept the Terms and Conditions to register");
      return;
    }

    console.log(formData);
    const response = await signup(formData);
    if (response) {
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        logo: null,
      });
      navigate("/signup-success");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Banner Image */}
      <div className="hidden md:block md:w-1/2 md:h-screen">
        <img
          src={onboardingImg}
          alt="Onboarding"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 min-h-screen bg-[#E3FFF2] flex items-center justify-center py-2 px-4 overflow-y-scroll">
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          {/* Logo */}
          <div className="w-48 sm:w-32 mb-">
            <img src={logo} alt="Logo" className="w-full" />
          </div>

          {/* Form Container */}
          <div className="bg-white py-6 px-4 sm:py-4 sm:px-7 border border-[#D0D5DD] rounded-[10px] w-full shadow-sm overflow-y-auto">
            <h1 className="text-center text-[#101928] text-xl sm:text-3xl font-semibold mb-2">
              Welcome To Ease
            </h1>
            <p className="text-sm text-center text-[#667185]">
              Enter your credentials to get registered
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-3 sm:space-y-3 w-full"
            >
              {/* Hospital Name */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  HOSPITAL NAME
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Hospital Name"
                  onChange={handleChange}
                  className="w-full mt-1 p-2 sm:p-3 border border-[#009952] rounded-md outline-none text-sm"
                  required
                />
              </div>

              {/* Phone number */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Phone Number"
                  onChange={handleChange}
                  className="w-full mt-1 p-2 sm:p-3 border border-[#009952] rounded-md outline-none text-sm"
                />
              </div>

              {/* Address */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  onChange={handleChange}
                  className="w-full mt-1 p-2 sm:p-3 border border-[#009952] rounded-md outline-none text-sm"
                />
              </div>

              {/* Email Address */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  className="w-full mt-1 p-2 sm:p-3 border border-[#009952] rounded-md outline-none text-sm"
                />
              </div>

              {/* Hospital Logo */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  HOSPITAL LOGO
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1 p-2 sm:p-3 border border-[#009952] rounded-md outline-none text-sm"
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mb-3 sm:mb-2">
                <div
                  className="flex items-start cursor-pointer"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                >
                  <div className="mt-0.5 mr-2">
                    {acceptTerms ? (
                      <CheckSquare size={20} className="text-[#009952]" />
                    ) : (
                      <Square size={20} className="text-[#667185]" />
                    )}
                  </div>
                  <div className="text-sm text-[#667185]">
                    I accept the{" "}
                    <a href="/terms" className="text-[#009952] hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-[#009952] hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    of HospEase
                  </div>
                </div>
                {/* Hidden checkbox for form validation */}
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="hidden"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2.5 sm:py-3 text-white font-medium text-base sm:text-lg bg-[#009952] rounded-md hover:bg-[#007a3e] transition-all 
                  ${
                    isLoading || !acceptTerms
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  `}
                disabled={!!isLoading || !acceptTerms}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
