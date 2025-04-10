import { InfoRow } from "./InfoRow";
import { PatientActions } from "./PatientActions";

export const PatientInfoSection = ({
  patient,
  setIsEditModalOpen,
}: {
  patient: any;
  setIsEditModalOpen: (value: boolean) => void;
}) => (
  <div className="grid gap-6 bg-white p-6">
    <PatientActions
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => {
        /* Delete logic */
      }}
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <InfoRow label="First Name" value={patient.first_name} />
      <InfoRow label="Last Name" value={patient.last_name} />
      <InfoRow label="Patient ID" value={patient.card_id} />
      <InfoRow label="Age" value={patient.age?.toString()} />
      <InfoRow label="Gender" value={patient.gender} />
      <InfoRow label="Patient type" value={patient.patient_type} />
      <InfoRow
        label="Clinical Department"
        value={patient.clinical_department?.name}
      />
      <InfoRow label="Branch" value={patient.branch} />
      <InfoRow label="Occupation" value={patient.occupation} />
      <InfoRow label="Religion" value={patient.religion} />
      <InfoRow label="Phone" value={patient.phone_number} />
      <InfoRow
        className="sm:col-span-2 md:col-span-3 lg:col-span-4"
        label="Address"
        value={patient.address}
      />
    </div>

    <hr className="text-[#979797]" />

    <NextOfKinSection kin={patient.next_of_kin} />
  </div>
);

const NextOfKinSection = ({ kin }: { kin: any[] }) => (
  <div className="">
    <h3 className="text-sm font-medium text-gray-800 mb-4">Next of Kin</h3>
    {kin?.map((k, index) => (
      <div
        key={index}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
      >
        <InfoRow label="First Name" value={k.name} />
        <InfoRow label="Last Name" value={k.last_name} />
        <InfoRow label="Gender" value={k.gender} />
        <InfoRow label="Occupation" value={k.occupation} />
        <InfoRow label="Phone" value={k.phone} />
        <InfoRow label="Relationship" value={k.relationship} />
        <InfoRow
          className="sm:col-span-2 md:col-span-3 lg:col-span-4"
          label="Address"
          value={k.address}
        />
      </div>
    ))}
  </div>
);
