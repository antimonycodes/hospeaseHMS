import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Table";
import img from "../../../assets/ribiero.png";
import { useState } from "react";

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

const DoctorsTable = () => {
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
                value ? "bg-primary" : "bg-gray-200"
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

  const navigate = useNavigate();
  const handleViewMore = () => {
    navigate(`/dashboard/doctors/doctor`);
  };

  // Toggle doctor status
  const toggleDoctorStatus = (id: string) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, active: !doctor.active } : doctor
      )
    );
  };

  //   const viewDoctorDetails = (doctor: Doctor) => {
  //     setSelectedDoctor(doctor);
  //   };

  return (
    <div>
      {/* Table */}
      <Table
        columns={columns}
        data={doctors}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default DoctorsTable;
