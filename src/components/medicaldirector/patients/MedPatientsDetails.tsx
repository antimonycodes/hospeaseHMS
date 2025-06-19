import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  StickyNote,
  Download,
  Printer,
  Calendar,
  Clock,
  Loader2,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMatronNurse } from "../../Matron/nurse/useMatronNurse";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import EditPatientModal from "../../../Shared/EditPatientModal";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import DoctorReportSystem from "../../Admission/DoctorReportSystem";
import Button from "../../../Shared/Button";
import AdmitPatientModal from "../../../Shared/AdmitPatientModal";

interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: string;
}

interface PatientAttributes {
  is_admitted: boolean;
  id?: number;
  first_name: string;
  last_name: string;
  card_id: string;
  phone_number: string | null;
  occupation: string;
  gender: string;
  address: string;
  age: number;
  branch: string | null;
  next_of_kin: NextOfKin[];
}

interface InfoRowItem {
  label: string;
  value: string | number | null;
}

const InfoRow: React.FC<{
  items: InfoRowItem[];
  columns?: string;
}> = ({ items, columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value ?? "-"}</p>
      </div>
    ))}
  </div>
);

const MedPatientsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPatient, getMedPatientById, isLoading } = usePatientStore();
  const [activeTab, setActiveTab] = useState("note");
  const [note, setNote] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // const { getPatientByIdDoc } = usePatientStore();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [mergedData, setMergedData] = useState<
    Array<{
      date: string;
      reports: any[];
      notes: any[];
      isExpanded: boolean;
    }>
  >([]);

  const { getAllRoles, roles } = useGlobalStore();
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    {
      service_item_name: string;
      id: any;
      request_pharmacy_id: any;
      attributes: {
        amount?: any;
        name?: string;
      };
      quantity: number;
      item: {
        id: number;
        item: string;
      };
    }[]
  >([]);
  const [labTestSearch, setLabTestSearch] = useState("");
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  const [isLabSelectOpen, setIsLabSelectOpen] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState<
    {
      id: number;
      name: string;
      amount: string;
      quantity: number;
    }[]
  >([]);

  // if (isLoading) {
  //   return <Loader />;
  // }

  if (!selectedPatient || !selectedPatient.attributes) {
    return <div>No patient data found.</div>;
  }

  const patient: PatientAttributes = selectedPatient.attributes;
  const nextOfKinList: NextOfKin[] = patient.next_of_kin || [];

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* Back button */}
        <div className="flex items-center justify-between mb-4">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary "
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Patients</span>
          </div>
          {/*  */}
          {patient.is_admitted !== true ? (
            <Button onClick={() => setIsAdmitModalOpen((prev) => !prev)}>
              Admit Patient
            </Button>
          ) : (
            <h1 className=" bg-primary p-2 rounded-full text-white">
              Admitted
            </h1>
          )}
        </div>
        <div className="grid gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
            <InfoRow
              items={[
                { label: "First Name", value: patient.first_name },
                { label: "Last Name", value: patient.last_name },
                { label: "Patient ID", value: patient.card_id },
                { label: "Age", value: patient.age },
              ]}
            />
            <InfoRow
              items={[
                { label: "Gender", value: patient.gender },
                { label: "Branch", value: patient.branch },
                { label: "Occupation", value: patient.occupation },
                { label: "Phone", value: patient.phone_number },
              ]}
            />
            <InfoRow
              columns="grid-cols-1"
              items={[{ label: "House Address", value: patient.address }]}
            />
          </div>

          <hr className="text-[#979797]" />
          <div>
            {" "}
            <h3 className="font-semibold mb-4">Next of Kin</h3>
            {nextOfKinList.length > 0 ? (
              nextOfKinList.map((kin, index) => (
                <div key={index} className="mb-6 p-4  ">
                  <InfoRow
                    items={[
                      { label: "First Name", value: kin.name },
                      { label: "Last Name", value: kin.last_name },
                      { label: "Gender", value: kin.gender },
                      { label: "Occupation", value: kin.occupation },
                    ]}
                  />
                  <InfoRow
                    items={[
                      { label: "Phone", value: kin.phone },
                      { label: "Relationship", value: kin.relationship },
                    ]}
                  />
                  <InfoRow
                    columns="grid-cols-1"
                    items={[{ label: "Address", value: kin.address }]}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No next of kin information available.
              </p>
            )}
          </div>
        </div>
      </div>
      {/*  */}
      {id && <DoctorReportSystem patientId={id} />}

      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}
      {isAdmitModalOpen && (
        <AdmitPatientModal
          setIsAdmitModalOpen={setIsAdmitModalOpen}
          patientId={id ? Number(id) : 0}
        />
      )}
    </div>
  );
};

export default MedPatientsDetails;

const departmentLabels: Record<string, string> = {
  pharmacist: "Pharmacy",
  laboratory: "Laboratory",
  nurse: "Nurse",
};
