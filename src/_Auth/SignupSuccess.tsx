import { useState, useEffect } from "react";
import { Check, Mail, ArrowRight, CheckCircle } from "lucide-react";
import logo from "../assets/logo-full.png";
import { useNavigate } from "react-router-dom";

const SignupSuccess = () => {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate email being sent
    const timer = setTimeout(() => {
      setEmailSent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#E3FFF2] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-4 bg-[#E3FFF2] rounded-full p-4 w-20 h-20 flex items-center justify-center">
          <CheckCircle size={40} className="text-[#009952]" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-[#101928] mb-2">
          Registration Successful!
        </h1>
        <p className="text-[#667185] mb-6">
          Thank you for registering with HospEase. We're excited to have you
          onboard!
        </p>

        {/* Email Notification */}
        <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded-lg p-4 mb-6 flex items-center">
          <div className="bg-[#E3FFF2] rounded-full p-2 mr-4">
            <Mail size={24} className="text-[#009952]" />
          </div>
          <div className="text-left">
            <p className="font-medium text-[#101928]">Check your email</p>
            <p className="text-sm text-[#667185]">
              We've sent you an email with instructions for the next steps.
            </p>
          </div>
        </div>

        {/* SVG Illustration */}
        <div className="mb-6">
          <svg
            className="w-full max-w-xs mx-auto"
            viewBox="0 0 400 240"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect
              x="50"
              y="30"
              width="300"
              height="180"
              rx="10"
              fill="#E3FFF2"
            />

            {/* Hospital Building */}
            <rect
              x="150"
              y="70"
              width="100"
              height="110"
              fill="#FFFFFF"
              stroke="#009952"
              strokeWidth="2"
            />
            <rect x="185" y="130" width="30" height="50" fill="#009952" />
            <rect x="130" y="60" width="140" height="20" fill="#009952" />

            {/* Email Icon */}
            <rect
              x="250"
              y="90"
              width="60"
              height="40"
              rx="5"
              fill="#FFFFFF"
              stroke="#009952"
              strokeWidth="2"
            />
            <polyline
              points="250,90 280,110 310,90"
              stroke="#009952"
              strokeWidth="2"
              fill="none"
            />

            {/* Success Check Mark */}
            <circle cx="280" cy="90" r="15" fill="#009952" />
            <polyline
              points="274,90 280,96 288,84"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
            />

            {/* Mail Path */}
            <path
              d="M230,110 Q245,80 280,90"
              stroke="#009952"
              strokeWidth="2"
              strokeDasharray="4"
              fill="none"
            />

            {/* Cross */}
            <rect
              x="165"
              y="90"
              width="20"
              height="20"
              fill="#FFFFFF"
              stroke="#009952"
              strokeWidth="2"
            />
            <line
              x1="165"
              y1="90"
              x2="185"
              y2="110"
              stroke="#009952"
              strokeWidth="2"
            />
            <line
              x1="185"
              y1="90"
              x2="165"
              y2="110"
              stroke="#009952"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Animation for email sent confirmation */}
        <div className="mb-6 text-sm text-[#667185] flex items-center justify-center">
          <span className="mr-2">
            {emailSent
              ? "Email sent successfully!"
              : "Sending confirmation email..."}
          </span>
          {!emailSent && (
            <div className="animate-spin h-4 w-4 border-2 border-[#009952] border-t-transparent rounded-full"></div>
          )}
          {emailSent && <Check size={16} className="text-[#009952]" />}
        </div>
        {/* 
        <button
          className="w-full py-3 text-white font-medium text-base bg-[#009952] rounded-md hover:bg-[#007a3e] transition-all flex items-center justify-center"
          onClick={() => navigate("/")}
        >
          Return to Homepage
          <ArrowRight size={18} className="ml-2" />
        </button> */}
      </div>

      <p className="mt-4 text-sm text-[#667185]">
        Need help? Contact our support team at support@hospease.com
      </p>
    </div>
  );
};

export default SignupSuccess;
