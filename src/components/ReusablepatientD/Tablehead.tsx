import SearchBar from "./SearchBar";
import { getImageSrc } from "../../utils/imageUtils";

const Tablehead = () => {
  return (
    <div className="w-full font-inter h-full bg-white rounded-t-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] w-[160px] font-medium">
          Patients{" "}
          <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
            3000
          </span>
        </h1>
        <SearchBar />
        <div className="flex items-center gap-4">
          <button className="cursor-pointer">
            <img src={getImageSrc("filter.svg")} alt="Filter" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tablehead;
