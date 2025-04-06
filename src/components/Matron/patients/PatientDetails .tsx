// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useMatronNurse } from "../nurse/useMatronNurse";
// import Loader from "../../../Shared/Loader";

// const PatientDetails = () => {
//   const { id } = useParams<{ id: string }>(); // Get patient ID from URL
//   const navigate = useNavigate();
//   const { selectedPatient, getPatientById, isLoading } = useMatronNurse();

//   useEffect(() => {
//     if (id) {
//       getPatientById(Number(id)); // Convert string to number
//     }
//   }, [id, getPatientById]);

//   if (isLoading || !selectedPatient) {
//     return <Loader />;
//   }

//   const attributes = selectedPatient; // Use selectedPatient directly as attributes

//   return (
//     <div className="p-6 bg-white rounded-lg shadow">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Patient Details</h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="text-gray-600 hover:text-gray-800"
//         >
//           Back
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="text-sm text-gray-600">Patient ID</label>
//           <p className="text-lg font-medium">{selectedPatient.id}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Full Name</label>
//           <p className="text-lg font-medium">
//             {attributes.first_name} {attributes.last_name}
//           </p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Card ID</label>
//           <p className="text-lg font-medium">{attributes.card_id}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Gender</label>
//           <p className="text-lg font-medium">{attributes.gender}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Phone Number</label>
//           <p className="text-lg font-medium">{attributes.phone_number}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Occupation</label>
//           <p className="text-lg font-medium">{attributes.occupation}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Address</label>
//           <p className="text-lg font-medium">{attributes.address}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Patient Type</label>
//           <p className="text-lg font-medium">{attributes.patient_type}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientDetails;
