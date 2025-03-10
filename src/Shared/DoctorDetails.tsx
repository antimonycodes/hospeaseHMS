import img from "../assets/ribiero.png";
import { ArrowLeft } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
type Doctor = {
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
};

const DoctorDetails = () => {
  const navigate = useNavigate();
  const doctors: Doctor[] = [
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
  ];
  return (
    <div className="bg-white rounded-lg shadow-md  w-full ">
      <div className="p-6 space-y-12">
        <div className="flex flex-col 2xs:flex-row justify-between gap-6 2xs:items-center ">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              // onClick={() => setSelectedDoctor(null)}
              className="mr-2  text-custom-black:"
            >
              <ArrowLeft />
            </button>
            <h2 className="text-lg   md:text-base font-medium text-custom-black">
              Doctor
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit">Edit</Button>
            <Button variant="delete">Block staff</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="mb-4">
            <p className="text-sm text-[#667085]">First Name</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].firstName}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-[#667085]">Last Name</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].lastName}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-[#667085]">Staff ID</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].staffId}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-[#667085]">Age</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].age}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#667085]">Gender</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].gender}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#667085]">Religion</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].religion}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-[#667085]">Phone</p>
            <p className=" text-sm md:text-base font-medium text-custom-black">
              {doctors[0].phone}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#667085]">House Address</p>
            <p className=" text-sm md:text-base   font-medium text-custom-black">
              {doctors[0].houseAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
