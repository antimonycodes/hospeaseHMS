import { HiX } from "react-icons/hi";

interface Props {
  onClose: any;
}
const AddPatientModal = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6 ">
      <div className="bg-white hide-scroll rounded-lg custom-shadow overflow-y-auto   p-12 h-[90%] w-full  max-w-[980px] ">
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
          <form className="text-[#101928] text-sm mt-7">
            {/* patients details */}
            <div className="flex flex-col gap-[29px]">
              {/* first name / last name */}
              <div className="grid gap-5 mmd:grid-cols-2">
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
              </div>

              {/* patient id / gender */}
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

              {/* branch / phone number */}
              <div className="grid gap-5 mmd:grid-cols-2">
                {/* branch */}
                <div>
                  <label className="font-medium" htmlFor="branch">
                    Branch
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="p-[16px] border border-[#D0D5DD] outline-primary w-full rounded-[6px] placeholder:text-[#98A2B3] text-[#98A2B3]"
                      placeholder=""
                    />
                  </div>
                </div>

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
              </div>

              {/* occupation / religion */}
              <div className="grid gap-5 mmd:grid-cols-2">
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
              </div>

              {/* house address*/}
              <div className="grid gap-5 mmd:grid-cols-2">
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

            <div>
              <h1 className="w-full border-b border-[#979797] py-5 mb-20 text-[18px] font-medium">
                Add Next of kin
              </h1>
            </div>

            {/* patients next of kin */}
            <div className="flex flex-col gap-[29px]">
              {/* first name / last name */}
              <div className="grid gap-5 mmd:grid-cols-2">
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
              </div>

              {/* phone number / gender */}
              <div className="grid gap-5 mmd:grid-cols-2">
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
              </div>

              {/* occupation / house address */}
              <div className="grid gap-5 mmd:grid-cols-2">
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

              {/* religion / relationship */}
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
                {/* branch */}
                <div>
                  <label className="font-medium" htmlFor="branch">
                    Branch
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
