import { HiX } from "react-icons/hi";

interface Props {
  isOpen: any;
  onClose: any;
}
const AddPatientModal = ({ isOpen, onClose }: Props) => {
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
            <h1 className="w-full text-[18px] font-medium">Add New Patient</h1>

            {/* close button */}
            <button className="cursor-pointer" onClick={onClose}>
              <HiX size={25} />
            </button>
          </div>

          {/* forms */}
          <form>
            {/* patients details */}
            <div className="flex flex-col gap-[29px]">
              {/* first name / last name */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* first name */}
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* last name */}
                <div>
                  <label htmlFor="firstName">Last Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* patient id / gender */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* patient id */}
                <div>
                  <label htmlFor="firstName">Patient ID</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* gender */}
                <div>
                  <label htmlFor="gender">Gender</label>
                  <div className="mt-1">
                    <select
                      name=""
                      id=""
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* branch / phone number */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* branch */}
                <div>
                  <label htmlFor="branch">Branch</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* phone number */}
                <div>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* occupation / religion */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* occupation */}
                <div>
                  <label htmlFor="occupation">Occupation</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* religion */}
                <div>
                  <label htmlFor="religion">Religion</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* house address*/}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* House Address */}
                <div>
                  <label htmlFor="houseAddress">House Address</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="w-full border-b border-[] py-5 mb-20">
                Add Next of kin
              </h1>
            </div>

            {/* patients next of kin */}
            <div className="flex flex-col gap-[29px]">
              {/* first name / last name */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* first name */}
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* last name */}
                <div>
                  <label htmlFor="firstName">Last Name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* phone number / gender */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* gender */}
                <div>
                  <label htmlFor="gender">Gender</label>
                  <div className="mt-1">
                    <select
                      name=""
                      id=""
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* phone number */}
                <div>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* occupation / house address */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* occupation */}
                <div>
                  <label htmlFor="occupation">Occupation</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* House Address */}
                <div>
                  <label htmlFor="houseAddress">House Address</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* religion / relationship */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* religion */}
                <div>
                  <label htmlFor="religion">Religion</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
                {/* branch */}
                <div>
                  <label htmlFor="branch">Branch</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* button */}
            <div className="mt-10">
              <button className="bg-primary cursor-pointer text-white py-[8px] px-[14px] text-sm rounded-[8px]">
                Add Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
