import { Link } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import EditPatientModal from "./EditPatientModal";
import Button from "./Button";

const PatientDetails = () => {
  const [openSections, setOpenSections] = useState({
    doctorsReport: true,
    medicalLaboratory: true,
    pharmacy: false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const patientData: any = {
    firstName: "Philip",
    lastName: "Ikiko",
    patientId: "001602",
    sex: "Male",
    dob: "28/04/1990",
    age: "32",
    religion: "Christian",
    email: "philip.ikiko@gmail.com",
    phone: "+2347098765435",
    address: "3, John Ajayi's Close, Agodi, Ibadan Oyo State",
    branch: "Agodi",

    nextOfKin: {
      firstName: "Philip",
      lastName: "Juliet",
      relationship: "Sister",
      phone: "+2348012345678",
      religion: "Christian",
      address: "3, John Ajayi's Close, Agodi, Ibadan Oyo State",
    },
    doctorsReport: [
      {
        name: "Heart",
        value: "ASD - Left to right shunting. Good surgical repair",
      },
      { name: "Red Blood Cell Count (RBC)", value: "4.78 10^6/uL (Normal)" },
      { name: "Mean Blood Cell Count (MBC)", value: "4.9 10^3/uL (Normal)" },
      { name: "Hemoglobin (Hb)", value: "12.6 g/dL (Normal)" },
      { name: "Hematocrit (Hct)", value: "42.0% (Normal)" },
      { name: "Platelet Count (Plt)", value: "257K (Normal)" },
    ],
    medicalLaboratory: [
      {
        name: "Tests: CBC, BMP, Lipid profile and Fasting blood sugar test results.",
        value: "",
      },
      { name: "Complete Blood Count (CBC):", value: "" },
      { name: "White Blood Cell Count (WBC)", value: "8.5 x 10^3/L (Normal)" },
      { name: "Red Blood Cell Count (RBC)", value: "4.5 x 10^12/L (Normal)" },
      { name: "Hemoglobin (Hb)", value: "14.6 g/dL (Normal)" },
      { name: "Hematocrit (Hct)", value: "42.0% (Normal)" },
      { name: "Platelet Count", value: "250 x 10^9/L (Normal)" },
      { name: "Basic Metabolic Panel (BMP):", value: "" },
      { name: "Glucose", value: "85 mg/dL (Normal)" },
      { name: "Potassium", value: "4.1 mmol/L (Normal)" },
      { name: "Calcium", value: "9.5 mg/dL (Normal)" },
      { name: "Bicarbonate", value: "24 mmol/L (Normal)" },
      { name: "Blood Urea Nitrogen (BUN)", value: "15 mg/dL (Normal)" },
      { name: "Creatinine", value: "1.0 mg/dL (Normal)" },
      { name: "Glucose", value: "85 mg/dL (Normal)" },
    ],
    lipidProfile: [
      { name: "Total Cholesterol", value: "180 mg/dL (Normal)" },
      { name: "High-Density Lipoprotein (HDL)", value: "50 mg/dL (Normal)" },
      { name: "Low-Density Lipoprotein (LDL)", value: "110 mg/dL (Normal)" },
      { name: "Triglycerides", value: "140 mg/dL (Normal)" },
    ],
    fastingBloodSugar: [
      { name: "Fasting Glucose", value: "90 mg/dL (Normal)" },
      {
        name: "Interpretation",
        value: "All test results are within normal limits.",
      },
    ],
    pharmacy: [
      { name: "Total Cholesterol", value: "205 mg/dL (Normal)" },
      { name: "High-Density Lipoprotein (HDL)", value: "45 mg/dL (Normal)" },
      { name: "Low-Density Lipoprotein (LDL)", value: "100 mg/dL (Normal)" },
      { name: "Triglycerides", value: "154 mg/dL (Normal)" },
    ],
  };

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          {/*  */}
          <div className=" flex justify-between items-center mb-12">
            {/* Back button */}

            <Link
              to="/dashboard/patients"
              className="flex items-center text-gray-600 mb-4 hover:text-primary"
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Patients</span>
            </Link>
            {/*  */}
            <div className=" flex items-center gap-3">
              {/* <button onClick={() => setIsEditModalOpen(true)}>
                Edit Patient
              </button> */}
              <Button
                variant="edit"
                rounded="lg"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Patient
              </Button>
              {/*  */}
              <Button variant="delete">Delete Patient</Button>
            </div>
          </div>
          {/* Patient information card */}

          <div className="grid  gap-6">
            {/* Left column */}
            <div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">First Name</p>
                  <p className="text-sm font-medium">{patientData.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Name</p>
                  <p className="text-sm font-medium">{patientData.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Patient ID</p>
                  <p className="text-sm font-medium">{patientData.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="text-sm font-medium">{patientData.age}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium">{patientData.sex}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Religion</p>
                  <p className="text-sm font-medium">{patientData.religion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Occupation</p>
                  <p className="text-sm font-medium">Student</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Marital</p>
                  <p className="text-sm font-medium">Christian</p>
                </div>
                <div className="">
                  <p className="text-xs text-gray-500">Phone</p>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{patientData.phone}</p>
                  </div>
                </div>
                <div className="">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium">{patientData.address}</p>
                </div>
              </div>
            </div>
            {/*  */}
            <hr className=" text-[#979797]" />
            {/* Next of Kin */}
            <div className="">
              <div className="">
                <h3 className="text-sm font-medium text-gray-800 mb-4">
                  Next of Kin
                </h3>
                <div className="grid  gap-6">
                  <div>
                    <div className="grid grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">First Name</p>
                        <p className="text-sm font-medium">
                          {patientData.nextOfKin.firstName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Name</p>
                        <p className="text-sm font-medium">
                          {patientData.nextOfKin.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="text-sm font-medium">Sister</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Relationship with patient
                        </p>
                        <p className="text-sm font-medium">
                          {patientData.nextOfKin.relationship}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-xs text-gray-500">Phone</p>
                        <div className="flex items-center">
                          <p className="text-sm font-medium">
                            {patientData.nextOfKin.phone}
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <p className="text-xs text-gray-500">
                          Relationship with Patient
                        </p>
                        <p className="text-sm font-medium">Sister</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 w-full">Address</p>
                        <p className="text-sm font-medium">
                          {patientData.nextOfKin.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor's Report Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div
          className="border-b border-gray-200 cursor-pointer"
          onClick={() => toggleSection("doctorsReport")}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex gap-1 flex-col">
              <h3 className="text-sm font-medium">Doctor's Report</h3>
              <div className=" flex items-center gap-2">
                <div className=" size-12 rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                  <User size={24} className="text-gray-600" />
                </div>
                <div className=" flex flex-col gap-2">
                  <h1 className="text-sm ">Dr Omoge Peter</h1>
                  <p className=" text-gray-500 text-xs">06/02/2025 11:00am</p>
                </div>
              </div>
            </div>
            {openSections.doctorsReport ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {openSections.doctorsReport && (
          <div className="p-4">
            {patientData.doctorsReport.map((item: any, index: number) => (
              <div key={`doctor-${index}`} className="mb-2">
                <div className="flex">
                  <span className="text-sm font-medium text-gray-800 min-w-40">
                    {item.name}:
                  </span>
                  <span className="text-sm text-gray-600">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medical Laboratory Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div
          className="border-b border-gray-200 cursor-pointer"
          onClick={() => toggleSection("medicalLaboratory")}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="size-12 rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div className=" space-y-2">
                <h3 className="text-sm font-medium">Medical Laboratory</h3>
                <p className="text-gray-500 text-xs">06/02/2025 11:00am</p>
              </div>
            </div>
            {openSections.medicalLaboratory ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {openSections.medicalLaboratory && (
          <div className="p-4">
            <div className=" flex items-center justify-between mb-6">
              <div className="text-sm font-medium mb-2">Laboratory Note</div>

              <div className="bg-[#FEF3CD] text-[#B58A00] py-2 px-4  rounded-full text-xs inline-block">
                ongoing
              </div>
            </div>

            <div className="mb-8">
              {patientData.medicalLaboratory.map((item: any, index: number) => (
                <div key={`lab-${index}`} className="mb-2 text-[#667085]">
                  {item.value ? (
                    <div className="flex">
                      <span className="text-sm font-medium min-w-40">
                        {item.name}:
                      </span>
                      <span className="text-sm ">{item.value}</span>
                    </div>
                  ) : (
                    <div className="text-sm font-medium ">{item.name}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-4 text-[#667085]">
              <div className="text-sm font-medium mb-2">Lipid Profile:</div>
              {patientData.lipidProfile.map((item: any, index: number) => (
                <div key={`lipid-${index}`} className="mb-2">
                  <div className="flex">
                    <span className="text-sm font-medium min-w-40">
                      {item.name}:
                    </span>
                    <span className="text-sm ">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className=" text-[#667085] mt-8">
              <div className="text-sm font-medium mb-2">
                Fasting Blood Sugar (FBS):
              </div>
              {patientData.fastingBloodSugar.map((item: any, index: number) => (
                <div key={`fbs-${index}`} className="mb-2">
                  <div className="flex">
                    <span className="text-sm font-medium  min-w-40">
                      {item.name}:
                    </span>
                    <span className="text-sm ">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            {/*  */}
            <div className="flex items-center mt-8">
              <div className="size-12 rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div className=" space-y-2">
                <h3 className="text-sm font-medium">Medical Laboratory</h3>
                <p className="text-gray-500 text-xs">06/02/2025 11:00am</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pharmacy Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div
          className="border-b border-gray-200 cursor-pointer"
          onClick={() => toggleSection("pharmacy")}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className=" size-12 rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div className=" space-y-2">
                <h3 className="text-sm font-medium">Pharmacy</h3>
                <p className="text-xs text-gray-500">06/02/2025 11:00am</p>
              </div>
            </div>
            {openSections.pharmacy ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {openSections.pharmacy && (
          <div className="p-4">
            {patientData.pharmacy.map((item: any, index: number) => (
              <div key={`pharmacy-${index}`} className="mb-2">
                <div className="flex">
                  <span className="text-sm font-medium text-gray-800 min-w-40">
                    {item.name}:
                  </span>
                  <span className="text-sm text-gray-600">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add the modal component at the end of your return statement */}
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={patientData}
        // onSave={handleSavePatient}
      />
    </div>
  );
};

export default PatientDetails;
