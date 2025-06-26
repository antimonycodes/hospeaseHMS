import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import { useRole } from "../hooks/useRole";

interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  religion?: string;
  relationship: string;
  clinical_patient_type?: string;
}

interface PatientData {
  first_name: string;
  last_name: string;
  card_id: string;
  branch_id: string;
  phone_number: string;
  occupation: string;
  religion: string;
  address: string;
  gender: string;
  patient_type: string;
  dob: any;
  clinical_patient_type: any;
  patient_category_id: string;
  age?: number;
  branch?: string;
  clinical_department?: { id: number; name: string };
  patient_category?: { id: number; name: string } | null;
  next_of_kin: NextOfKin[];
}

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: PatientData | null;
  isLoading: boolean;
  onSave: (data: PatientData) => void;
  branches?: Array<{ id: number; attributes: { name: string } }>;
  categories?: Array<{ id: number; attributes: { name: string } }>;
  clinicaldepts?: Array<{ id: number; attributes: { name: string } }>;
}

const EditPatientModal = ({
  isOpen,
  onClose,
  patientData,
  isLoading,
  onSave,
}: EditPatientModalProps) => {
  const [formData, setFormData] = useState<PatientData | null>(null);
  const { branches, getBranches, clinicaldepts, getClinicaldept } =
    useGlobalStore();
  const { getAllCategory, categories } = useCombinedStore();
  const role = useRole();
  const branchEndpoint =
    role === "admin" ? "/admin/branches/fetch" : "/front-desk/branches/fetch";

  useEffect(() => {
    getAllCategory();
    getBranches(branchEndpoint);
    getClinicaldept();
  }, [getAllCategory, getBranches, getClinicaldept]);

  // Convert date string to Date object
  const parseDate = (dateString: string | Date | null) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Find branch ID by name
  const findBranchIdByName = (branchName: string) => {
    const branch = branches?.find((b) => b.attributes.name === branchName);
    return branch ? branch.id.toString() : "";
  };

  // Update form data when patientData changes or modal opens
  useEffect(() => {
    if (patientData && isOpen) {
      // console.log("Setting form data with patient:", patientData);

      setFormData({
        ...patientData,
        // Handle branch - use branch_id if available, otherwise find by branch name
        branch_id:
          patientData.branch_id ||
          (patientData.branch ? findBranchIdByName(patientData.branch) : ""),

        // Handle clinical department - use clinical_patient_type if available, otherwise use clinical_department.id
        clinical_patient_type:
          patientData.clinical_patient_type ||
          patientData.clinical_department?.id?.toString() ||
          "",

        // Handle patient category - use patient_category_id if available, otherwise use patient_category.id
        patient_category_id:
          patientData.patient_category_id ||
          patientData.patient_category?.id?.toString() ||
          "",

        // Parse date of birth
        dob: parseDate(patientData.dob),

        // Ensure next_of_kin has proper structure
        next_of_kin:
          patientData.next_of_kin?.length > 0
            ? [...patientData.next_of_kin]
            : [
                {
                  name: "",
                  last_name: "",
                  gender: "female",
                  phone: "",
                  occupation: "",
                  address: "",
                  relationship: "",
                  religion: "",
                  clinical_patient_type: "",
                },
              ],
      });
    }
  }, [patientData, isOpen, branches]);

  // console.log("Current formData:", formData);
  // console.log("Available branches:", branches);
  // console.log("Available categories:", categories);
  // console.log("Available clinical depts:", clinicaldepts);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (formData) {
      setFormData({
        ...formData,
        dob: date,
      });
    }
  };

  const handleKinChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number = 0
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    const updatedKin = [...formData.next_of_kin];
    updatedKin[index] = {
      ...updatedKin[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      next_of_kin: updatedKin,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    // Validate required fields
    if (!formData.branch_id) {
      toast.error("Please select both Branch and Category");
      return;
    }

    // Prepare the payload
    const payload: PatientData = {
      ...formData,
      branch_id: formData.branch_id,
      patient_category_id: formData.patient_category_id,
      clinical_patient_type: formData.clinical_patient_type,
      dob: formData.dob
        ? `${formData.dob.getFullYear()}-${String(
            formData.dob.getMonth() + 1
          ).padStart(2, "0")}-${String(formData.dob.getDate()).padStart(
            2,
            "0"
          )}`
        : "",
    };

    onSave(payload);
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Edit Patient</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Card ID
              </label>
              <input
                type="text"
                name="card_id"
                value={formData.card_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm bg-gray-100"
                // readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Patient Type
              </label>
              <select
                name="patient_type"
                value={formData.patient_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
              >
                <option value="" disabled>
                  Select Patient Type
                </option>
                <option value="Insurance">Insurance</option>
                <option value="HMO">HMO</option>
                <option value="Organised Private Scheme">
                  Organised Private Scheme
                </option>
                <option value="Regular Private">Regular Private</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Date of Birth
              </label>
              <DatePicker
                selected={formData.dob}
                onChange={handleDateChange}
                placeholderText="Date of birth"
                className="w-full border border-gray-300 rounded p-4 text-sm"
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                maxDate={new Date()}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Branch</label>
              <select
                name="branch_id"
                value={formData.branch_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
                required
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id.toString()}>
                    {branch.attributes.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Clinical Department
              </label>
              <select
                name="clinical_patient_type"
                value={formData.clinical_patient_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
              >
                <option value="" disabled>
                  Select Clinical Department
                </option>
                {clinicaldepts?.map((dept) => (
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.attributes.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Category
              </label>
              <select
                name="patient_category_id"
                value={formData.patient_category_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.attributes.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              House Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-4 text-sm"
            />
          </div>

          <hr className="my-8 text-gray-400" />

          {formData.next_of_kin.length > 0 && (
            <div className="pt-4 mt-4">
              <h3 className="text-sm font-medium mb-4">Next of Kin</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.next_of_kin[0].name}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.next_of_kin[0].last_name}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.next_of_kin[0].gender}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.next_of_kin[0].phone}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.next_of_kin[0].occupation}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    House Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.next_of_kin[0].address}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.next_of_kin[0].religion || ""}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Relationship with Patient
                  </label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.next_of_kin[0].relationship}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-primary text-white py-2 px-4 rounded text-sm ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
