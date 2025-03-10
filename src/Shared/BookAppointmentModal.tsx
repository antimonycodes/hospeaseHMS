import { X } from "lucide-react";

const BookAppointmentModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1E1E1E40] px-6 ">
      <div className="bg-white w-full max-w-3xl p-6 shadow-lg h-[90%] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <label className="text-sm text-gray-600">Patient ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="0010602"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="Philip"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="Ikiriko"
              readOnly
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
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="+234 708 823 2411"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Occupation</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="Banker"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Religion</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="Christian"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">House Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
              defaultValue="5, John Ayanfe Close, Apodi, Ibadan"
              readOnly
            />
          </div>
        </div>

        {/* Appointment Booking Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Book Appointment</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-gray-600">Choose Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
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
            <button className="w-fit bg-primary px-4 text-white py-2 rounded-lg hover:bg-green-700">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
