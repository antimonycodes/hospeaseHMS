import React, { useState } from "react";
import Table from "../Shared/Table"; // Your reusable table component
import img from "../assets/ribiero.png";
import Button from "../Shared/Button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: "Available" | "Out-of-work";
  picture: string;
  religion?: string;
  gender?: string;
  age?: number;
  staffId?: string;
  houseAddress?: string;
  active: boolean;
}

const Consultants: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      firstName: "James",
      lastName: "Kawu",
      phone: "+234 704 230 9201",
      email: "james@bcd.com",
      status: "Out-of-work",
      picture: img,
      active: true,
      religion: "Christian",
      gender: "Male",
      age: 32,
      staffId: "0010602",
      houseAddress: "5, John Ayorife Close, Agodi, Ibadan Oyo State",
    },
    {
      id: "2",
      firstName: "Ruth",
      lastName: "Nwabueze",
      phone: "+234 702 129 7825",
      email: "rukwa@cimbu.com",
      status: "Available",
      picture: img,
      active: false,
    },
    {
      id: "3",
      firstName: "Priscilla",
      lastName: "Agtasu",
      phone: "+234 391 390 5590",
      email: "imbraurafym@putlook.com",
      status: "Available",
      picture: img,
      active: true,
    },
    {
      id: "4",
      firstName: "Elizabeth",
      lastName: "Takur",
      phone: "+234 319 829 4825",
      email: "etakur@yotnomail.com",
      status: "Out-of-work",
      picture: img,
      active: true,
    },
    {
      id: "5",
      firstName: "Joseph",
      lastName: "Ike",
      phone: "+234 902 989 7382",
      email: "jike.specialistdr@hotmail.com",
      status: "Out-of-work",
      picture: img,
      active: false,
    },
    {
      id: "6",
      firstName: "Daniel",
      lastName: "Kanesti",
      phone: "+234 905 145 6346",
      email: "medkan@email.com",
      status: "Out-of-work",
      picture: img,
      active: true,
    },
    {
      id: "7",
      firstName: "Joseph",
      lastName: "Wanjide",
      phone: "+234 815 242 7824",
      email: "drwan@outlook.com",
      status: "Out-of-work",
      picture: img,
      active: false,
    },
    {
      id: "8",
      firstName: "Deborah",
      lastName: "Iwelewa",
      phone: "+234 902 354 1574",
      email: "iwelewa@yandex.com",
      status: "Out-of-work",
      picture: img,
      active: false,
    },
    {
      id: "9",
      firstName: "Timothy",
      lastName: "Elokete",
      phone: "+234 811 962 3141",
      email: "telokooo@gmail.com",
      status: "Out-of-work",
      picture: img,
      active: true,
    },
    {
      id: "10",
      firstName: "Victoria",
      lastName: "Ogunigo",
      phone: "+234 809 771 7212",
      email: "victoriaog@outlook.com",
      status: "Out-of-work",
      picture: img,
      active: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  //   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const navigate = useNavigate();
  const handleViewMore = () => {
    navigate(`/dashboard/doctors/doctor`);
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
  });

  // Toggle doctor status
  const toggleDoctorStatus = (id: string) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, active: !doctor.active } : doctor
      )
    );
  };

  //   // View doctor details
  //   const viewDoctorDetails = (doctor: Doctor) => {
  //     setSelectedDoctor(doctor);
  //   };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add new doctor
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoctor: Doctor = {
      id: (doctors.length + 1).toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      status: "Available",
      picture: "/images/doctors/placeholder.jpg",
      active: true,
      religion: formData.religion,
      houseAddress: formData.houseAddress,
    };
    setDoctors([...doctors, newDoctor]);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      religion: "",
      houseAddress: "",
    });
    setShowModal(false);
  };

  const columns = [
    {
      key: "picture" as keyof Doctor,
      label: "Avatar",
      render: (value: string, row: Doctor) => (
        <div className="flex items-center">
          <img
            src={value}
            alt={`Dr. ${row.firstName} ${row.lastName}`}
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/40";
            }}
          />
        </div>
      ),
    },
    {
      key: "firstName" as keyof Doctor,
      label: "Name",
      render: (row: Doctor) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-sm text-gray-500">HCS{row.id}455</span>
        </div>
      ),
    },
    {
      key: "phone" as keyof Doctor,
      label: "Phone",
    },
    {
      key: "email" as keyof Doctor,
      label: "Email address",
    },
    {
      key: "status" as keyof Doctor,
      label: "Status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "Available"
              ? "bg-[#CCFFE7] text-[#009952]"
              : "bg-[#FCE9E9] text-[#F83E41]"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "active" as keyof Doctor,
      label: "Control",
      render: (value: boolean, row: Doctor) => (
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={value}
              onChange={() => toggleDoctorStatus(row.id)}
            />
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                value ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  value ? "transform translate-x-5" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
      ),
    },
    {
      key: "id" as keyof Doctor,
      label: "",
      render: () => (
        <button onClick={() => handleViewMore()} className="text-primary">
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="  rounded-lg shadow-md bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Consultants
          <span className="text-[#6941C6] bg-[#F9F5FF] py-1 px-4 rounded-full text-sm">
            {doctors.length}
          </span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-green-700 text-white px-4 py-4 rounded-md flex items-center"
        >
          <span className="mr-1">Add new</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.33333V12.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33334 8H12.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={doctors}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-y-auto w-full max-w-2xl h-[90%]">
            <div className="p-4 md:p-12">
              <div className="flex justify-between items-center mb-4 ">
                <h2 className=" text-custom-black text-lg font-semibold">
                  Add New Doctor
                </h2>
                <button onClick={() => setShowModal(false)} className="">
                  <X className=" text-black" />
                </button>
              </div>

              <form onSubmit={handleAddDoctor}>
                {/* Upload Picture */}
                <div className="mb-4 flex gap-4 ">
                  <div className="mb-2 text-center">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className=" space-y-2">
                    <p className=" text-custom-black font-medium">
                      Upload Picture
                    </p>
                    <p className="text-xs md:text-sm text-[#667085] w-full md:max-w-2/3">
                      Upload image with at least 6000px by 600px in jpg or png
                      format.
                    </p>
                    {/* <button
                      type="button"
                      className="mt-2 bg-primary text-white rounded-md px-4 py-4 text-sm"
                    >
                      Upload
                    </button> */}
                    <Button variant="primary">Upload</Button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-custom-black  mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-custom-black  mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-custom-black  mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                      placeholder="johndoe@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-custom-black  mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                      placeholder="+23470xxxxxxxx"
                      required
                    />
                  </div>
                </div>

                {/* Religion and Address */}
                <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="religion"
                      className="block text-sm font-medium text-custom-black  mb-1"
                    >
                      Religion
                    </label>
                    <input
                      type="text"
                      id="religion"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                      placeholder="Christianity"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="houseAddress"
                      className="block text-sm font-medium text-custom-black  mb-1"
                    >
                      House Address
                    </label>
                    <input
                      type="text"
                      id="houseAddress"
                      name="houseAddress"
                      value={formData.houseAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                      placeholder="10, Road George close, Surdere Ibadan"
                    />
                  </div>
                </div>
                {/* 
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-green-700 text-white font-medium py-4 px-4 rounded-md"
                >
                  Add Doctor
                </button> */}
                <Button>Add Doctor</Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultants;
