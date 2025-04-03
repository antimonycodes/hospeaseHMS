import { useState } from "react";
import { Mail } from "lucide-react";
import logo from "../assets/logo-full.png";
import onboardingImg from "../assets/onboardingImg.png";
import { useAuthStore } from "../store/_auth/useAuthStore";
import toast from "react-hot-toast";

const Signup = () => {
  const { signup, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    logo: null as File | null, // Store as File
    cac_docs: null as File | null, // Store as File
  });

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

    // Validate if files exist
    if (!formData.logo || !formData.cac_docs) {
      toast.error("Logo and CAC documents are required.");
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
        cac_docs: null,
      });
      toast.success("You will be contacted by hospease for the next step");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Banner Image - Hidden on smaller screens, visible on medium and up */}
      <div className="hidden md:block md:w-1/2 md:h-screen">
        <img
          src={onboardingImg}
          alt="Onboarding"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 min-h-screen bg-[#E3FFF2] flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          {/* Logo */}
          <div className="w-48 sm:w-56 mb-2">
            <img src={logo} alt="Logo" className="w-full" />
          </div>

          {/* Form Container */}
          <div className="bg-white py-6 px-4 sm:py-8 sm:px-7 border border-[#D0D5DD] rounded-[10px] w-full shadow-sm">
            <h1 className="text-center text-[#101928] text-2xl sm:text-3xl font-semibold mb-2">
              Welcome Onboard
            </h1>
            <p className="text-sm text-center text-[#667185]">
              Enter your credentials to get registered
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-3 sm:space-y-4 w-full"
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

              {/* Hospital CAC */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  HOSPITAL CAC
                </label>
                <input
                  type="file"
                  name="cac_docs"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full mt-1 p-2 sm:p-3 border border-[#009952] rounded-md outline-none text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2.5 sm:py-3 text-white font-medium text-base sm:text-lg bg-[#009952] rounded-md hover:bg-[#007a3e] transition-all 
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                disabled={!!isLoading}
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
