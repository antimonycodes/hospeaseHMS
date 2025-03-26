import { getImageSrc } from "../../utils/imageUtils";
import SearchBar from "./SearchBar";

interface TableheadProps {
  tableTitle: string;
  tableCount?: number;
  showControls?: boolean;
}

const Tablehead: React.FC<TableheadProps> = ({
  tableTitle,
  tableCount,
  showControls = true,
}) => {
  return (
    <div className="w-full font-inter  bg-white rounded-t-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px]  font-medium">
          {tableTitle}
          {tableCount !== undefined && (
            <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
              {tableCount}
            </span>
          )}
        </h1>

        {showControls && (
          <div className="flex items-center gap-4">
            <SearchBar />
            <button className="cursor-pointer">
              <img src={getImageSrc("filter.svg")} alt="Filter" />
            </button>
            <button className=" border rounded-xl ">Add New</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tablehead;
