import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Mail } from "lucide-react";
import logo from "../assets/logo-full.png";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleLogin = (role: string) => {
    login("JohnDoe", role);
  };

  return (
    <div className=" bg-[#E3FFF2] flex flex-col items-center justify-center h-screen">
      {/* <h1 className=" text-[#009952]  text-2xl md:text-4xl font-bold mb-4">
        Hospease Technologies Ltd
      </h1> */}
      <div className=" w-56">
        <img src={logo} alt="" />
      </div>
      <div className=" bg-white py-8 px-7 border border-[#D0D5DD] rounded-[10px] mt-4 flex flex-col items-center">
        <div>
          <h1 className=" text-center text-[#101928] text-3xl font-semibold mb-2">
            Log In
          </h1>
          <p className=" text-sm md:text-base items-center text-[#667185]">
            Enter your credentials to access your account
          </p>
        </div>
        {/* form */}
        <form action="" className=" mt-6 space-y-4">
          {/* email input */}
          <div className="mb-4 relative">
            <label className="block text-[#101928] font-semibold text-xs ">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className=" w-full md:w-[400px] mt-1 p-3 border border-[#009952] rounded-md outline-none focus:outline-none "
              // required
            />
            <div className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer">
              <Mail color="#667185" size={20} />
            </div>
          </div>
          {/* password input */}
          <div className="mb-4 relative">
            <label className="block text-[#101928] font-semibold text-xs">
              PASSWORD
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className=" w-full md:w-[400px] mt-1 p-3 border border-[#009952] rounded-md outline-none focus:outline-none "
              // required
            />
            <div
              className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEye size={20} className=" text-[#667185]" />
              ) : (
                <FaEyeSlash
                  size={20}
                  className=" text-[#667185] transition-all"
                />
              )}
            </div>
          </div>
          {/* forgot password */}
          <div className="flex justify-between items-center py-3">
            {/* checkbox */}
            <div className=" flex items-center gap-1">
              <input type="checkbox" name="" id="" />
              <label className="text-[#101928] font-medium text-xs">
                Remember me for 30 days
              </label>
            </div>
            {/* link */}
            <h3 className=" text-[#009952] text-xs">forgot password?</h3>
          </div>
          {/* login button */}
          <button className="w-full py-3 text-white font-medium text-lg bg-[#009952] rounded-md hover:bg-[#009952] hover:shadow-md transition-all">
            Login to Account
          </button>
        </form>
      </div>

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
      </div>
    </div>
  );
};

export default Signup;
