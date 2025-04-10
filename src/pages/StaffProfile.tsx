import React, { useState, useEffect } from "react";
import ChangePasswordModal from "../components/Superadmin/profile/ChangePasswordModal";
import Button from "../Shared/Button";
import { useStaffProfileStore } from "../store/staff/useStaffProfileStore";

const StaffProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const { profileData, isLoading, error, fetchProfile, changePassword } =
    useStaffProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const fullName =
    [profileData?.attributes?.first_name, profileData?.attributes?.last_name]
      .filter(Boolean)
      .join(" ") || "N/A";

  return (
    <div>
      <h1 className="text-custom-black text-xl font-medium mb-4">Profile</h1>
      <div className="bg-white border-[1.67px] border-gray-200 rounded-[16.65px] p-4 md:p-8 space-y-8">
        <div className="w-fit flex flex-col items-center space-y-4">
          <h1 className="text-[#667085] font-medium">
            Hospital Profile Picture
          </h1>
          <div className="size-20">
            <img
              src={profileData?.attributes?.hospital?.logo}
              alt="Hospital Logo"
              className="h-full w-full border border-[#009952] rounded-full object-cover"
            />
          </div>
          <Button>Change Picture</Button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[#667085] font-medium">Hospital Name</label>
            <h1 className="text-[#3E3E3E] font-medium text-xl">{fullName}</h1>
          </div>
          <div>
            <label className="text-[#667085] font-medium">
              Hospital Email Address
            </label>
            <h1 className="text-[#3E3E3E] font-medium text-xl">
              {profileData?.attributes?.email || "N/A"}
            </h1>
          </div>
          <div>
            <label className="text-[#667085] font-medium">
              Hospital Phone Number
            </label>
            <h1 className="text-[#3E3E3E] font-medium text-xl">
              {profileData?.attributes?.phone || "N/A"}
            </h1>
          </div>
        </div>

        <button
          className="text-primary font-semibold"
          onClick={() => setShowModal(true)}
        >
          Change password
        </button>
      </div>

      {showModal && (
        <ChangePasswordModal
          setShowModal={setShowModal}
          changePassword={changePassword}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default StaffProfile;
