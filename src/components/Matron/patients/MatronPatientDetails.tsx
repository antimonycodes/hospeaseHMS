import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMatronNurse } from "../nurse/useMatronNurse";
import Loader from "../../../Shared/Loader";

// InfoRow reusable component
const InfoRow = ({
  items,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: {
  items: { label: string; value: string | number | undefined }[];
  columns?: string;
}) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    ))}
  </div>
);

const MatronPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedPatient, getPatientById } = useMatronNurse();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPatientById(parseInt(id))
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Error fetching appointment:", error);
          setIsLoading(false);
        });
    }
  }, [id, getPatientById]);

  if (isLoading) {
    return <Loader />;
  }

  const attributes = selectedPatient?.attributes || {};
  const patient = attributes.patient?.attributes || {};

  const nextOfKin =
    patient.next_of_kin && patient.next_of_kin.length > 0
      ? patient.next_of_kin[0]
      : {};

  return (
    <div>
      {/* <BackButton label="Patients" /> */}
      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
            { label: "Religion", value: "Christian" }, // hardcoded
          ]}
        />
        <InfoRow
          columns="grid-cols-2 md:grid-cols-4"
          items={[
            { label: "Phone", value: patient.phone_number },
            { label: "House Address", value: patient.address },
          ]}
        />

        {/* Next of Kin */}
        <hr className="my-6 border-gray-200" />
        <h3 className="font-semibold mb-4">Next of Kin</h3>
        <InfoRow
          items={[
            { label: "First Name", value: nextOfKin.name },
            { label: "Last Name", value: nextOfKin.last_name },
            { label: "Gender", value: nextOfKin.gender },
            { label: "Occupation", value: nextOfKin.occupation },
          ]}
        />
        <InfoRow
          items={[
            { label: "Religion", value: "Christian" },
            { label: "Phone", value: nextOfKin.phone },
            {
              label: "Relationship with Patient",
              value: nextOfKin.relationship,
            },
            { label: "House Address", value: nextOfKin.address },
          ]}
        />
      </div>
    </div>
  );
};

export default MatronPatientDetails;
