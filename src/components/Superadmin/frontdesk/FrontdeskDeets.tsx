import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import Button from "../../../Shared/Button";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import Loader from "../../../Shared/Loader";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";

const FrontdeskDeets = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getFrontdeskById, selectedFrontdesk, isLoading } = useNurseStore();
  const { deleteUser, isDeleting } = useCombinedStore();

  useEffect(() => {
    if (id) {
      getFrontdeskById(id);
    }
  }, [id, getFrontdeskById]);

  const handleDelete = () => {
    if (selectedFrontdesk) {
      deleteUser(selectedFrontdesk.attributes?.user_id);
      // navigate(-1);
    }
  };
  console.log(selectedFrontdesk, "erg");

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="p-6 space-y-12">
        <div className="flex flex-col 2xs:flex-row justify-between gap-6 2xs:items-center">
          <div
            className="flex items-center text-gray-600 hover:text-primary mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Frontdesk Details</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="edit">Edit</Button>
            <Button
              variant="delete"
              onClick={handleDelete}
              disabled={!!isDeleting}
              className={`
                ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isDeleting ? (
                <>
                  Deleting
                  <Loader2 className=" size-6 mr-2 animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Info
            label="First Name"
            value={selectedFrontdesk?.attributes.first_name}
          />
          <Info
            label="Last Name"
            value={selectedFrontdesk?.attributes.last_name}
          />

          <Info label="Email" value={selectedFrontdesk?.email} />

          <Info label="Phone" value={selectedFrontdesk?.attributes.phone} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="mb-4">
    <p className="text-sm text-[#667085]">{label}</p>
    <p className="text-sm md:text-base font-medium text-custom-black">
      {value || "N/A"}
    </p>
  </div>
);

export default FrontdeskDeets;
