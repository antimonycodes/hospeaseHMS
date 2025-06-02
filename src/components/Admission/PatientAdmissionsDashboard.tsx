import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Bed,
  Clock,
  AlertCircle,
  ChevronDown,
  Eye,
  Calendar,
  Phone,
  Mail,
  FileText,
  Heart,
  Activity,
} from "lucide-react";

interface Patient {
  id: string;
  hospitalNumber: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  bedNumber: string;
  ward: string;
  department: string;
  admissionDate: string;
  admissionTime: string;
  diagnosis: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  attendingPhysician: string;
  nurseAssigned: string;
  contactNumber: string;
  emergencyContact: string;
  insuranceProvider: string;
  allergies: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
  };
  status: "Stable" | "Monitoring" | "Critical" | "Recovering";
  lastUpdated: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    hospitalNumber: "MRN001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    bedNumber: "30",
    ward: "Cardiology",
    department: "Specialty",
    admissionDate: "2025-05-28",
    admissionTime: "08:30",
    diagnosis: "Acute Myocardial Infarction",
    severity: "High",
    attendingPhysician: "Dr. Sarah Wilson",
    nurseAssigned: "RN Angela",
    contactNumber: "+234-801-234-5678",
    emergencyContact: "+234-802-345-6789",
    insuranceProvider: "NHIS",
    allergies: ["Penicillin", "Latex"],
    vitalSigns: {
      bloodPressure: "140/90",
      heartRate: 88,
      temperature: 37.2,
      oxygenSaturation: 95,
    },
    status: "Monitoring",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    hospitalNumber: "MRN004",
    name: "Emily Davis",
    age: 32,
    gender: "Female",
    bedNumber: "25",
    ward: "Maternity",
    department: "General",
    admissionDate: "2025-05-27",
    admissionTime: "14:15",
    diagnosis: "Normal Delivery - Post Partum",
    severity: "Low",
    attendingPhysician: "Dr. Michael Chen",
    nurseAssigned: "RN Patricia",
    contactNumber: "+234-803-456-7890",
    emergencyContact: "+234-804-567-8901",
    insuranceProvider: "Private Insurance",
    allergies: [],
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 36.8,
      oxygenSaturation: 99,
    },
    status: "Stable",
    lastUpdated: "30 minutes ago",
  },
  {
    id: "3",
    hospitalNumber: "MRN005",
    name: "David Wilson",
    age: 67,
    gender: "Male",
    bedNumber: "20",
    ward: "ICU",
    department: "Specialty",
    admissionDate: "2025-05-26",
    admissionTime: "22:45",
    diagnosis: "Severe Pneumonia with Respiratory Failure",
    severity: "Critical",
    attendingPhysician: "Dr. Amanda Johnson",
    nurseAssigned: "RN Marcus",
    contactNumber: "+234-805-678-9012",
    emergencyContact: "+234-806-789-0123",
    insuranceProvider: "NHIS",
    allergies: ["Sulfa drugs"],
    vitalSigns: {
      bloodPressure: "95/60",
      heartRate: 110,
      temperature: 38.5,
      oxygenSaturation: 88,
    },
    status: "Critical",
    lastUpdated: "15 minutes ago",
  },
  {
    id: "4",
    hospitalNumber: "MRN013",
    name: "Aliyu Musa",
    age: 28,
    gender: "Male",
    bedNumber: "40",
    ward: "Orthopedics",
    department: "General",
    admissionDate: "2025-05-28",
    admissionTime: "11:20",
    diagnosis: "Fractured Femur - Post Surgical",
    severity: "Medium",
    attendingPhysician: "Dr. James Okafor",
    nurseAssigned: "RN Grace",
    contactNumber: "+234-807-890-1234",
    emergencyContact: "+234-808-901-2345",
    insuranceProvider: "State Insurance",
    allergies: [],
    vitalSigns: {
      bloodPressure: "130/85",
      heartRate: 78,
      temperature: 36.9,
      oxygenSaturation: 97,
    },
    status: "Recovering",
    lastUpdated: "1 hour ago",
  },
];

const PatientAdmissionsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedSeverity, setSelectedSeverity] = useState("All Severity");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const wards = [
    "All Wards",
    "Cardiology",
    "Maternity",
    "ICU",
    "Orthopedics",
    "Emergency",
    "Surgery",
  ];
  const severityLevels = ["All Severity", "Low", "Medium", "High", "Critical"];

  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.hospitalNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWard =
        selectedWard === "All Wards" || patient.ward === selectedWard;
      const matchesSeverity =
        selectedSeverity === "All Severity" ||
        patient.severity === selectedSeverity;

      return matchesSearch && matchesWard && matchesSeverity;
    });
  }, [searchTerm, selectedWard, selectedSeverity]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stable":
        return "bg-green-100 text-green-800";
      case "Monitoring":
        return "bg-blue-100 text-blue-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Recovering":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalBeds = mockPatients.length;
  const criticalPatients = mockPatients.filter(
    (p) => p.severity === "Critical"
  ).length;
  const averageStayDays = 3.2; // Mock calculation

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Patient Admissions
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, RN Angela
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPatients.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Bed className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Occupied Beds
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalBeds}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Critical Cases
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {criticalPatients}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg. Stay (days)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageStayDays}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, hospital number, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 flex flex-wrap gap-4">
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {wards.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {severityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vitals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.hospitalNumber} • {patient.age}y{" "}
                            {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Bed {patient.bedNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.ward} Ward
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {patient.diagnosis}
                      </div>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(
                          patient.severity
                        )}`}
                      >
                        {patient.severity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.lastUpdated}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {patient.vitalSigns.heartRate} bpm
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {patient.vitalSigns.bloodPressure}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Patient Details
              </h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Patient Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedPatient.name}
                    </p>
                    <p>
                      <span className="font-medium">Hospital Number:</span>{" "}
                      {selectedPatient.hospitalNumber}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {selectedPatient.age} years
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {selectedPatient.gender}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {selectedPatient.contactNumber}
                    </p>
                    <p>
                      <span className="font-medium">Emergency Contact:</span>{" "}
                      {selectedPatient.emergencyContact}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Medical Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Diagnosis:</span>{" "}
                      {selectedPatient.diagnosis}
                    </p>
                    <p>
                      <span className="font-medium">Attending Physician:</span>{" "}
                      {selectedPatient.attendingPhysician}
                    </p>
                    <p>
                      <span className="font-medium">Assigned Nurse:</span>{" "}
                      {selectedPatient.nurseAssigned}
                    </p>
                    <p>
                      <span className="font-medium">Allergies:</span>{" "}
                      {selectedPatient.allergies.length > 0
                        ? selectedPatient.allergies.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Current Status
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Bed:</span>{" "}
                      {selectedPatient.bedNumber}
                    </p>
                    <p>
                      <span className="font-medium">Ward:</span>{" "}
                      {selectedPatient.ward}
                    </p>
                    <p>
                      <span className="font-medium">Admission Date:</span>{" "}
                      {selectedPatient.admissionDate}
                    </p>
                    <p>
                      <span className="font-medium">Admission Time:</span>{" "}
                      {selectedPatient.admissionTime}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          selectedPatient.status
                        )}`}
                      >
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Vital Signs
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Blood Pressure:</span>{" "}
                      {selectedPatient.vitalSigns.bloodPressure} mmHg
                    </p>
                    <p>
                      <span className="font-medium">Heart Rate:</span>{" "}
                      {selectedPatient.vitalSigns.heartRate} bpm
                    </p>
                    <p>
                      <span className="font-medium">Temperature:</span>{" "}
                      {selectedPatient.vitalSigns.temperature}°C
                    </p>
                    <p>
                      <span className="font-medium">Oxygen Saturation:</span>{" "}
                      {selectedPatient.vitalSigns.oxygenSaturation}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAdmissionsDashboard;
