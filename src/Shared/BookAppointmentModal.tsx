import { X } from "lucide-react";
import Input from "./Input";

const BookAppointmentModal = ({ onClose }: { onClose: () => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle input change
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1E1E1E40] px-6 ">
      <div className="bg-white w-full max-w-3xl p-6 shadow-lg h-[90%] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-black">
            <X size={20} />
          </button>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <label className="text-sm text-gray-600">Patient ID</label>
            <Input
              name="patientId"
              value="0010602"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <Input
              name="firstName"
              value="Philip"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <Input
              name="lastName"
              value="Ikiriko"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-4">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <Input
              name="phone"
              value="+234 708 823 2411"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Occupation</label>
            <Input
              name="occupation"
              value="Banker"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Religion</label>
            <Input
              name="religion"
              value="Christian"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">House Address</label>
            <Input
              name="address"
              value="5, John Ayanfe Close, Apodi, Ibadan"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-4"
            />
          </div>
        </div>

        {/* Appointment Booking Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Book Appointment</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-gray-600">Choose Date</label>
              <Input
                name="date"
                type="date"
                value=""
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-4"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Choose Time</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-4">
                <option>02:00pm</option>
                <option>10:00am</option>
                <option>12:00pm</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Select Doctor</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-4">
                <option>Dr Omoge Peter</option>
                <option>Dr Akinwale John</option>
              </select>
            </div>
          </div>

          {/* Book Button */}
          <div className="mt-6">
            <button className="w-fit bg-primary px-4 text-white py-2 rounded-lg 0">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
