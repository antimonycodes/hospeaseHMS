import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import { ChevronLeft, StickyNote, StickyNoteIcon } from "lucide-react";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import { useStickyNoteStore } from "../../../store/super-admin/useStickyNote";
import Button from "../../../Shared/Button";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";

interface InfoRowItem {
  label: string;
  value: string | number | null;
}
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
const FrontdeskPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedPatient, getFdeskPatientById, isLoading } = usePatientStore();
  const navigate = useNavigate();
  const { show } = useStickyNoteStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("Fetching patient with ID:", id);
      getFdeskPatientById(id).catch((error) => {
        console.error("Error fetching patient:", error);
      });
    }
  }, [id, getFdeskPatientById]);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedPatient || !selectedPatient.attributes) {
    return <div>No patient data found.</div>;
  }

  const patient: PatientAttributes = selectedPatient.attributes;
  const nextOfKinList: NextOfKin[] = patient.next_of_kin || [];

  return (
    <div className=" ">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 relative">
        <div className=" absolute top-0 right-8">
          <div className="absolute top-4 right-6 z-[99999] flex items-center justify-between">
            <button
              onClick={show}
              className="bg-yellow-200 hover:bg-yellow-300 p-2 rounded-full shadow-md"
              title="Open Sticky Note"
            >
              <StickyNoteIcon className="w-5 h-5 text-yellow-800" />
            </button>
          </div>
          {/* <StickyNote /> */}
        </div>
        {/* Back button */}
        <div
          className="flex items-center text-gray-600 hover:text-primary mb-5"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          <span className="ml-1">Patients</span>
        </div>

        {/* <div className=" mb-6">Transfer To doctor</div> */}
        <Button onClick={() => setOpenModal(true)}>Transfer To doctor</Button>

        <div className="grid gap-6 relative">
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

      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}

      {openModal && (
        <BookAppointmentModal
          onClose={() => setOpenModal(false)}
          // endpoint={bookEndpoint}
          // refreshEndpoint={refreshEndpoint}
        />
      )}
    </div>
  );
};

export default FrontdeskPatientDetails;

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
