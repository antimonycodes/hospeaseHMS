import { useState } from "react";
import img from "../assets/ribiero.png";
import Button from "../Shared/Button";
import ChangePasswordModal from "../components/Superadmin/profile/ChangePasswordModal";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);

  const details = {
    name: "Life Care Hospital",
    email: "lifecare@gmail.com",
    address: "No 5, Wahab close Agodi, Ibadan Oyo State",
    phoneNumber: ["+2347065666954,", "  +2347087643287"],
  };

  return (
    <div>
      <h1 className="text-custom-black text-xl font-medium mb-4">Profile</h1>
      <div className=" bg-white border-[1.67px] border-gray-200 rounded-[16.65px] p-4 md:p-8 space-y-8 ">
        {/* Avatar */}
        <div className=" w-fit flex flex-col items-center space-y-4">
          <h1 className=" text-[#667085] font-medium">
            Hospital Profile Picture
          </h1>
          {/* img */}
          <div className=" size-20">
            <img
              src={img}
              alt="Logo"
              className=" h-full w-full border border-[#009952]  rounded-full"
            />
          </div>
          {/* button */}
          <Button>Change Picture</Button>
        </div>
        {/* Hospital details */}
        <div className=" space-y-6">
          {/* name */}
          <div>
            <label className=" text-[#667085] font-medium">Hospital Name</label>
            <h1 className=" text-[#3E3E3E] font-medium text-xl">
              {details.name}
            </h1>
          </div>
          {/* email */}
          <div>
            <label className=" text-[#667085] font-medium">
              Hospital email Address
            </label>
            <h1 className=" text-[#3E3E3E] font-medium text-xl">
              {details.email}
            </h1>
          </div>
          {/* address */}
          <div>
            <label className=" text-[#667085] font-medium">
              Hospital Address
            </label>
            <h1 className=" text-[#3E3E3E] font-medium text-xl">
              {details.address}
            </h1>
          </div>
          {/* phone number */}
          <div>
            <label className=" text-[#667085] font-medium">Hospital Name</label>
            <h1 className=" text-[#3E3E3E] font-medium text-xl">
              {details.phoneNumber}
            </h1>
          </div>
        </div>
        {/* change password */}
        <button
          className=" text-primary font-semibold"
          onClick={() => setShowModal(true)}
        >
          Change password
        </button>
      </div>

      {/* modal */}
      {showModal && <ChangePasswordModal setShowModal={setShowModal} />}
    </div>
  );
};

export default Profile;
