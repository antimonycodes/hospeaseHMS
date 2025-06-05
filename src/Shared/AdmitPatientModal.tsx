import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import { useAdmissionStore } from "../store/super-admin/useAdmissionStore";
import toast from "react-hot-toast";

interface AdmitPatientModalProps {
  setIsAdmitModalOpen: (open: boolean) => void;
  patientId: number;
}

const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({
  setIsAdmitModalOpen,
  patientId,
}) => {
  const { getClinicaldept, clinicaldepts } = useGlobalStore();
  const { createAdmission, isLoading } = useAdmissionStore();

  const [department, setDepartment] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [ward, setWard] = useState("");
  const [bed, setBed] = useState("");
  const [status, setStatus] = useState("");

  const doctorId = Number(localStorage.getItem("uid"));

  useEffect(() => {
    getClinicaldept();
  }, []);

  const handleCreateAdmission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!department || !diagnosis || !ward || !bed || !status) {
      return toast.error("Please fill all fields.");
    }

    const success = await createAdmission({
      recommended_by: doctorId,
      patient_id: patientId,
      clinical_department_id: Number(department),
      bed_number: `${ward}-${bed}`,
      diagnosis,
      status,
    });

    if (success) {
      setIsAdmitModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Admit Patient
            </h2>
            <button onClick={() => setIsAdmitModalOpen(false)}>
              <X className="text-black w-5 h-5" />
            </button>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleCreateAdmission}
          >
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 bg-white"
              >
                <option value="">Select</option>
                {clinicaldepts.map((dept: any) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.attributes.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <input
                type="text"
                placeholder="Typhoid"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ward
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 bg-white"
              >
                <option value="">Select</option>
                <option>05</option>
                <option>06</option>
              </select>
            </div>

            {/* Bed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bed
              </label>
              <select
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 bg-white"
              >
                <option value="">Select</option>
                <option>01</option>
                <option>02</option>
                <option>03</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 bg-white"
              >
                <option value="">Select</option>
                <option>Critically ill</option>
                <option>Stable</option>
              </select>
            </div>
          </form>

          <div className="mt-10">
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleCreateAdmission}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? "Admitting..." : "Admit Patient"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitPatientModal;
