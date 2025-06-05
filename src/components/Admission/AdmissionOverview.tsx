import React, { useEffect, useState } from "react";
import { Search, Filter, User, Bed, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";

interface NextOfKin {
  [key: string]: any;
}

interface ClinicalDepartment {
  id: number;
  name: string;
}

interface RecommendedBy {
  id: number;
  first_name: string;
  last_name: string;
}

interface PatientAttributes {
  first_name: string;
  last_name: string;
  branch: string;
  card_id: string;
  phone_number: string;
  occupation: string;
  religion: string;
  card_type: string | null;
  gender: string;
  address: string;
  is_admitted: boolean;
  patient_type: string;
  clinical_department: ClinicalDepartment;
  age: number;
  next_of_kin: NextOfKin[];
  created_at: string;
}

interface Patient {
  type: string;
  id: number;
  attributes: PatientAttributes;
}

interface AdmissionAttributes {
  bed_number: string;
  status: string;
  diagnosis: string;
  clinical_department: ClinicalDepartment;
  recommended_by: RecommendedBy;
  recorded_by: RecommendedBy;
  created_at: string;
  updated_at: string;
}

interface AdmissionRecord {
  type: string;
  id: number;
  attributes: AdmissionAttributes;
  patient: Patient;
}

const AdmissionOverview: React.FC = () => {
  const { admissionList, isLoading, allAdmission } = useAdmissionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<AdmissionRecord[]>(
    []
  );

  useEffect(() => {
    allAdmission();
  }, [allAdmission]);

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm.trim() === "") {
      setFilteredPatients(admissionList);
    } else {
      const filtered = admissionList.filter((admission) => {
        const patientName =
          `${admission.patient.attributes.first_name} ${admission.patient.attributes.last_name}`.toLowerCase();
        const patientId = admission.patient.attributes.card_id.toLowerCase();
        const diagnosis = admission.attributes.diagnosis.toLowerCase();
        const ward =
          admission.attributes.clinical_department.name.toLowerCase();

        return (
          patientName.includes(searchTerm.toLowerCase()) ||
          patientId.includes(searchTerm.toLowerCase()) ||
          diagnosis.includes(searchTerm.toLowerCase()) ||
          ward.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredPatients(filtered);
    }
  }, [admissionList, searchTerm]);

  // Calculate statistics from the actual data
  const totalPatients = admissionList.length;
  const criticalCases = admissionList.filter((admission) =>
    admission.attributes.status.toLowerCase().includes("critical")
  ).length;
  const occupiedBeds = admissionList.filter(
    (admission) => admission.patient.attributes.is_admitted
  ).length;

  // Calculate average stay (this would need more data from backend for accurate calculation)
  const averageStay = "N/A"; // You'll need admission date vs current date calculation

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
  }> = ({ title, value, icon, bgColor, iconColor }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const statusClasses = status.toLowerCase().includes("critical")
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Good Morning! Doctor Abiola
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="TOTAL PATIENTS"
            value={totalPatients}
            icon={<User size={24} />}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="OCCUPIED BEDS"
            value={occupiedBeds}
            icon={<Bed size={24} />}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="CRITICAL CASES"
            value={criticalCases}
            icon={<AlertTriangle size={24} />}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="AVERAGE STAY (DAYS)"
            value={averageStay}
            icon={<Clock size={24} />}
            bgColor="bg-pink-100"
            iconColor="text-pink-600"
          />
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Patients on Admission{" "}
                <span className="text-blue-600 text-sm ml-2">
                  {totalPatients}
                </span>
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Type to search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Name
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Patient ID
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Gender
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Bed Number
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Ward
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Diagnosis
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Total stay (DAYS)
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700 text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 px-6 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No patients found matching your search."
                        : "No admission records found."}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((admission) => (
                    <tr key={admission.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        {`${capitalizeFirst(
                          admission.patient.attributes.first_name
                        )} ${capitalizeFirst(
                          admission.patient.attributes.last_name
                        )}`}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {admission.patient.attributes.card_id}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {capitalizeFirst(admission.patient.attributes.gender)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {admission.attributes.bed_number}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {admission.attributes.clinical_department.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {admission.attributes.diagnosis}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={admission.attributes.status} />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(admission.attributes.created_at)} days
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/dashboard/admission-details/${admission.id}`}
                        >
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            View More
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - You can implement this based on your backend pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {filteredPatients.length} of {totalPatients} results
              </p>
              {/* Add pagination controls here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionOverview;
