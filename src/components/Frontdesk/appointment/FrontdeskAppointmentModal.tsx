import { HiX } from "react-icons/hi";

interface Props {
  isOpen: any;
  onClose: any;
}

const FrontdeskAppointmentModal = ({ isOpen, onClose }: Props) => {
  return (
    <div
      className={`fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[100] items-center p-4 justify-center ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white px-[18px] msm:px-[59px] py-[18px] rounded-[10px] w-[980px] overflow-y-scroll hide-scroll h-[900px]">
        <div>
          {/* head section */}
          <div className="flex items-center justify-between w-full">
            <h1 className="w-full text-[18px] font-medium">Book Appointment</h1>

            {/* close button */}
            <button className="cursor-pointer" onClick={onClose}>
              <HiX size={25} />
            </button>
          </div>

          {/* forms */}
          <form className="text-[#101928] text-sm mt-7">
            {/* patients details */}
            <div className="flex flex-col gap-[29px]">
              {/* patient id / first name */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* patient id */}
                <div>
                  <label className="font-medium" htmlFor="firstName">
                    Patient ID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* first name */}
                <div>
                  <label className="font-medium" htmlFor="firstName">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* last name / gender */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* last name */}
                <div>
                  <label className="font-medium" htmlFor="firstName">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* gender */}
                <div>
                  <label className="font-medium" htmlFor="gender">
                    Gender
                  </label>
                  <div className="mt-1">
                    <select
                      name=""
                      id=""
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* phone number / Ocuppation */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* phone number */}
                <div>
                  <label className="font-medium" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* occupation */}
                <div>
                  <label className="font-medium" htmlFor="occupation">
                    Occupation
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* religion / house address */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* religion */}
                <div>
                  <label className="font-medium" htmlFor="religion">
                    Religion
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* House Address */}
                <div>
                  <label className="font-medium" htmlFor="houseAddress">
                    House Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Booking Section */}
            <div className="mt-6">
              <h3 className="w-full text-[18px] font-medium">
                Book Appointment
              </h3>

              <div className="grid grid-cols-1 gap-4 mt-7">
                <div>
                  <label className="font-medium" htmlFor="date">
                    Choose Date
                  </label>
                  <div className="mt-1">
                    <input
                      name="date"
                      type="date"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* Choose time */}
                <div>
                  <label className="font-medium" htmlFor="time">
                    Choose Time
                  </label>
                  <div className="mt-1">
                    <select className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]">
                      <option>02:00pm</option>
                      <option>10:00am</option>
                      <option>12:00pm</option>
                    </select>
                  </div>
                </div>

                {/* select doctors */}
                <div>
                  <label className="font-medium" htmlFor="doctor">
                    Select Doctor
                  </label>
                  <div className="mt-1">
                    <select className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]">
                      <option>Dr Omoge Peter</option>
                      <option>Dr Akinwale John</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* button */}
            <div className="mt-10">
              <button className="bg-primary cursor-pointer text-white py-[8px] px-[14px] font-medium text-sm rounded-[8px]">
                Book appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FrontdeskAppointmentModal;
