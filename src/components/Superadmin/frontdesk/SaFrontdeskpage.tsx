import { useEffect, useState } from "react";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import SaFrontDeskTable from "./SaFrontDeskTable";
import AddFrontDeskModal from "./AddFrontDeskModal";

const SaFrontdeskpage = () => {
  const [showModal, setShowModal] = useState(false);

  const { getFrontdesk, isLoading, frontdesks, createFrontdesk } =
    useNurseStore();

  useEffect(() => {
    getFrontdesk();
  }, []);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    // nurse_id: null,
    email: "",
    phone: "",
    address: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className=" w-full rounded-lg custom-shadow bg-white p-4">
      {/* header */}
      <div className=" w-full flex items-center justify-between mb-8">
        <div className="  flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Front desk</h1>
          <span className="bg-[#F9F5FF] py-1 px-4 rounded-full text-[#6941C6] font-medium">
            {frontdesks.length}
          </span>
        </div>
        {/* add button */}
        <div className=" md:w-auto">
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="md"
            // onClick={handleOpenModal}
            className="flex items-center gap-2 px-4"
          >
            Add new
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* table */}
      <SaFrontDeskTable frontdesks={frontdesks} isLoading={isLoading} />

      {/* Add Doctor Modal */}
      {showModal && (
        <AddFrontDeskModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
          createFrontdesk={createFrontdesk}
        />
      )}
    </div>
  );
};

export default SaFrontdeskpage;
