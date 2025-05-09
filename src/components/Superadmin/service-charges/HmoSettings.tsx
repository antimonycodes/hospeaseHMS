import React, { useEffect, useState } from "react";
import Button from "../../../Shared/Button";
import { PlusCircle } from "lucide-react";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";

const HmoSettings = () => {
  const [hmoValue, setHmoValue] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const { updateHmoPercentage } = useCombinedStore();

  useEffect(() => {
    const savedHmo = localStorage.getItem("hmo");
    if (savedHmo !== null) {
      setHmoValue(Number(savedHmo));
      setInputValue(savedHmo); // pre-fill the input if needed
    }
  }, []);

  const handleSave = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    const percentage = parseFloat(inputValue);
    if (isNaN(percentage)) {
      alert("Please enter a valid number");
      return;
    }

    const success = await updateHmoPercentage(uid, {
      hmo_percentage: percentage,
    });

    if (success) {
      setHmoValue(percentage);
      localStorage.setItem("hmo", String(percentage));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            HMO Settings
          </h1>
          <p className="text-gray-500 text-sm">
            Current HMO Percentage:{" "}
            <span className="font-semibold text-black">
              {hmoValue !== null ? `${hmoValue}%` : "Not set"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter HMO percentage"
          className="border rounded-lg p-2 w-40"
        />
        <Button variant="primary" onClick={handleSave}>
          <PlusCircle className="w-4 h-4 mr-2" />
          {hmoValue !== null ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default HmoSettings;
