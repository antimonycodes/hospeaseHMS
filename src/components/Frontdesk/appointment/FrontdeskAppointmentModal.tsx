import { HiX } from "react-icons/hi";
import SearchBar from "../../ReusablepatientD/SearchBar";

interface Props {
  isOpen: any;
  onClose: any;
}

const FrontdeskAppointmentModal = ({ isOpen, onClose }: Props) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#1E1E1E40] px-6 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white w-full max-w-3xl p-6 shadow-lg h-[90%] overflow-y-auto">
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
            <div>
              <SearchBar />
              {/* options from search */}
              <div className=""></div>
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
