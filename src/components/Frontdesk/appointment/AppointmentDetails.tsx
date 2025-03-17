import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const AppointmentDetails = () => {
  return (
    <div className="">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          {/*  */}
          <div className=" flex justify-between items-center mb-12">
            {/* Back button */}

            <Link
              to="/dashboard/appointments"
              className="flex items-center text-gray-600 mb-4 hover:text-primary"
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Patients</span>
            </Link>
          </div>
          {/* Patient information card */}

          <div className="grid font-medium gap-6">
            {/* Left column */}
            <div>
              <div className="grid grid-cols-4 gap-6 mb-6">
                {/* first name */}
                <div>
                  <p className=" text-[#667085]">First Name</p>
                  <p className="text-[20px] text-[#3E3E3E]">Philip</p>
                </div>
                {/* last name */}
                <div>
                  <p className=" text-[#667085]">Last Name</p>
                  <p className="text-[20px] text-[#3E3E3E]">Ikiko</p>
                </div>
                {/* patient id */}
                <div>
                  <p className=" text-[#667085]">Patient ID</p>
                  <p className="text-[20px] text-[#3E3E3E]">001602</p>
                </div>
                {/* age */}
                <div>
                  <p className=" text-[#667085]">Age</p>
                  <p className="text-[20px] text-[#3E3E3E]">32</p>
                </div>
                {/* gender */}
                <div>
                  <p className=" text-[#667085]">Gender</p>
                  <p className="text-[20px] text-[#3E3E3E]">Male</p>
                </div>
                {/* branch */}
                <div>
                  <p className=" text-[#667085]">Branch</p>
                  <p className="text-[20px] text-[#3E3E3E]">Agodi</p>
                </div>
                {/* occupation */}
                <div>
                  <p className=" text-[#667085]">Occupation</p>
                  <p className="text-[20px] text-[#3E3E3E]">Student</p>
                </div>
                {/* religion */}
                <div>
                  <p className=" text-[#667085]">Religion</p>
                  <p className="text-[20px] text-[#3E3E3E]">Christian</p>
                </div>
                {/* phone */}
                <div className="">
                  <p className=" text-[#667085]">Phone</p>
                  <div className="flex items-center">
                    <p className="text-[20px] text-[#3E3E3E]">+2347098765435</p>
                  </div>
                </div>
                {/* details */}
                <div className="">
                  <p className=" text-[#667085]">Address</p>
                  <p className="text-[20px] text-[#3E3E3E]">
                    3, John Ajayi's Close, Agodi, Ibadan Oyo State
                  </p>
                </div>
              </div>
            </div>
            {/*  */}
            <hr className=" text-[#979797]" />
            {/* Next of Kin */}
            <div className="">
              <div className="">
                <h3 className="text-[18px] text-[#3E3E3E] mb-4">Next of Kin</h3>
                <div className="grid gap-6">
                  <div>
                    <div className="grid grid-cols-4 gap-6 mb-4">
                      {/* first name */}
                      <div>
                        <p className=" text-[#667085]">First Name</p>
                        <p className="text-[20px] text-[#3E3E3E]">Philip</p>
                      </div>
                      {/* last name */}
                      <div>
                        <p className=" text-[#667085]">Last Name</p>
                        <p className="text-[20px] text-[#3E3E3E]">Ikiko</p>
                      </div>
                      {/* gender */}
                      <div>
                        <p className=" text-[#667085]">Gender</p>
                        <p className="text-[20px] text-[#3E3E3E]">Sister</p>
                      </div>
                      {/* relationship */}
                      <div>
                        <p className=" text-[#667085]">
                          Relationship with patient
                        </p>
                        <p className="text-[20px] text-[#3E3E3E]">Uncle</p>
                      </div>

                      {/* next of kin */}
                      <div className="">
                        <p className=" text-[#667085]">Phone</p>
                        <div className="flex items-center">
                          <p className="text-[20px] text-[#3E3E3E]">
                            +2347098765435
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <p className=" text-[#667085]">
                          Relationship with Patient
                        </p>
                        <p className="text-[20px] text-[#3E3E3E]">Sister</p>
                      </div>

                      {/* address */}
                      <div>
                        <p className=" text-[#667085] w-full">Address</p>
                        <p className="text-[20px] text-[#3E3E3E]">
                          3, John Ajayi's Close, Agodi, Ibadan Oyo State
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
