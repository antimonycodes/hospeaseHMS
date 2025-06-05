import React from "react";
import { Search, Filter, User, Bed, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  patientId: string;
  gender: "Male" | "Female";
  bedNumber: string;
  ward: string;
  diagnosis: string;
  status: "Critically Ill" | "Recovering";
  totalDays: string;
}

const AdmissionOverview: React.FC = () => {
  const patients: Patient[] = [
    {
      id: "1",
      name: "Philip Uchia",
      patientId: "001956/2",
      gender: "Male",
      bedNumber: "01",
      ward: "Male ward",
      diagnosis: "Typhoid",
      status: "Critically Ill",
      totalDays: "45",
    },
    {
      id: "2",
      name: "John Diangba",
      patientId: "002956/2",
      gender: "Female",
      bedNumber: "03",
      ward: "Female ward",
      diagnosis: "Kidney Disease",
      status: "Recovering",
      totalDays: "85",
    },
    {
      id: "3",
      name: "Mary Dunsaiye",
      patientId: "003956/2",
      gender: "Male",
      bedNumber: "05",
      ward: "Children ward",
      diagnosis: "Delivery",
      status: "Recovering",
      totalDays: "08",
    },
    {
      id: "4",
      name: "Martha Tanbo",
      patientId: "004956/2",
      gender: "Female",
      bedNumber: "10",
      ward: "Emergency ward",
      diagnosis: "Ulcer",
      status: "Critically Ill",
      totalDays: "15",
    },
    {
      id: "5",
      name: "Simon Olaniran",
      patientId: "005956/2",
      gender: "Female",
      bedNumber: "12",
      ward: "OPD",
      diagnosis: "Surgery",
      status: "Critically Ill",
      totalDays: "45",
    },
    {
      id: "6",
      name: "Naom Odi",
      patientId: "006956/2",
      gender: "Male",
      bedNumber: "14",
      ward: "Male ward",
      diagnosis: "Migraine",
      status: "Recovering",
      totalDays: "45",
    },
    {
      id: "7",
      name: "Deborah Dunsaiye",
      patientId: "007956/2",
      gender: "Female",
      bedNumber: "15",
      ward: "General ward",
      diagnosis: "Fever",
      status: "Recovering",
      totalDays: "45",
    },
    {
      id: "8",
      name: "Mary Bembo",
      patientId: "008956/2",
      gender: "Male",
      bedNumber: "08",
      ward: "Surgery room",
      diagnosis: "Fever",
      status: "Recovering",
      totalDays: "45",
    },
    {
      id: "9",
      name: "James Olowokere",
      patientId: "009956/2",
      gender: "Female",
      bedNumber: "08",
      ward: "Children ward",
      diagnosis: "Delivery",
      status: "Critically Ill",
      totalDays: "45",
    },
    {
      id: "10",
      name: "Stephen Suleiman",
      patientId: "010956/2",
      gender: "Female",
      bedNumber: "13",
      ward: "Female ward",
      diagnosis: "Lassa Fever",
      status: "Critically Ill",
      totalDays: "45",
    },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
  }> = ({ title, value, icon, bgColor, iconColor }) => (
    <div className="bg-white rounded-lg p-6 custom-shadow border border-gray-100">
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
    const statusClasses =
      status === "Critically Ill"
        ? "bg-red-100 text-red-700"
        : "bg-orange-100 text-orange-700";

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
  };

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
            value="2520"
            icon={<User size={24} />}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="OCCUPIED BEDS"
            value="850"
            icon={<Bed size={24} />}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="CRITICAL CASES"
            value="1100"
            icon={<AlertTriangle size={24} />}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="AVERAGE STAY (DAYS)"
            value="750"
            icon={<Clock size={24} />}
            bgColor="bg-pink-100"
            iconColor="text-pink-600"
          />
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg custom-shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Patients on Admission{" "}
                <span className="text-blue-600 text-sm ml-2">3,000</span>
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
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {patient.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {patient.patientId}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {patient.gender}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {patient.bedNumber}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {patient.ward}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {patient.diagnosis}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {patient.totalDays} days
                    </td>
                    <td className="py-4 px-6">
                      <Link to="/dashboard/admission-details">
                        <button className="text-primary text-sm font-medium">
                          View More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionOverview;
