import { useState } from "react";
import { Mail } from "lucide-react";
import logo from "../assets/logo-full.png";
import onboardingImg from "../assets/onboardingImg.png";
import { useAuthStore } from "../store/_auth/useAuthStore";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    signup(formData);
  };

  return (
    <div className="flex h-screen w-full overflow-y-auto">
      {/* Banner Image */}
      <div className="basis-1/2 h-full">
        <img
          src={onboardingImg}
          alt="Onboarding"
          className="h-full w-full object-cover"
        />
      </div>

<<<<<<< HEAD
      {/*  login buttons for stimulation*/}
      <div className=" cursor-pointer flex-col flex">
        <button
          onClick={() => handleLogin("superadmin")}
          className=" cursor-pointer"
        >
          Login as Super Admin
        </button>
        <button
          onClick={() => handleLogin("doctor")}
          className=" cursor-pointer"
        >
          Login as Doctor
        </button>
        <button
          onClick={() => handleLogin("frontdesk")}
          className=" cursor-pointer"
        >
          Login as Front Desk
        </button>
        <button
          onClick={() => handleLogin("laboratory")}
          className=" cursor-pointer"
        >
          Login as Laboratory
        </button>
        <button
          onClick={() => handleLogin("finance")}
          className=" cursor-pointer"
        >
          Login as Finance
        </button>
        <button
          onClick={() => handleLogin("pharmacy")}
          className=" cursor-pointer"
        >
          Login as Pharmacy
        </button>
        <button
          onClick={() => handleLogin("inventory")}
          className=" cursor-pointer"
        >
          Login as Inventory
        </button>
        <button
          onClick={() => handleLogin("nurses")}
          className=" cursor-pointer"
        >
          Login as Nurses
        </button>
        <button
          onClick={() => handleLogin("matron")}
          className=" cursor-pointer"
        >
          Login as Matron
        </button>
        <button
          onClick={() => handleLogin("consultant")}
          className=" cursor-pointer"
        >
          Login as Consultant
        </button>
=======
      {/* Form Section */}
      <div className="basis-1/2 w-full h-full bg-[#E3FFF2] flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col items-center gap-6 w-full max-w-lg h-full p-6">
          {/* Logo */}
          <div className="w-56">
            <img src={logo} alt="Logo" />
          </div>

          {/* Form Container */}
          <div className="bg-white py-8 px-7 border border-[#D0D5DD] rounded-[10px] mt-4 flex flex-col items-center w-full">
            <h1 className="text-center text-[#101928] text-3xl font-semibold mb-2">
              Welcome Onboard
            </h1>
            <p className="text-sm md:text-base text-[#667185]">
              Enter your credentials to get registered
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-full">
              {/* Hospital Name */}
              <div className="mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  HOSPITAL NAME
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Hospital Name"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-[#009952] rounded-md outline-none"
                  required
                />
              </div>

              {/* Phone number */}
              <div className="mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Phone Number"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-[#009952] rounded-md outline-none"
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-[#009952] rounded-md outline-none"
                />
              </div>

              {/* Email Address */}
              <div className="mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-[#009952] rounded-md outline-none"
                />
              </div>

              {/* Hospital Logo */}
              <div className="mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  HOSPITAL LOGO
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1 p-3 border border-[#009952] rounded-md outline-none"
                />
              </div>

              {/* Hospital CAC */}
              <div className="mb-4">
                <label className="block text-[#101928] font-semibold text-xs">
                  HOSPITAL CAC
                </label>
                <input
                  type="file"
                  name="cac_docs"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full mt-1 p-3 border border-[#009952] rounded-md outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 text-white font-medium text-lg bg-[#009952] rounded-md hover:bg-[#007a3e] transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>
>>>>>>> da874f1729ae2ef9f1db1d7067124aae49e10fa6
      </div>
    </div>
  );
};

export default Signup;
