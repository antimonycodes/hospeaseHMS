import Button from "../../Shared/Button";
import { getImageSrc } from "../../utils/imageUtils";
import SearchBar from "./SearchBar";

interface TableheadProps {
  tableTitle: string;
  tableCount?: number;
  showControls?: boolean;
  showSearchBar?: boolean;
  showButton?: boolean;
}

const Tablehead: React.FC<TableheadProps> = ({
  tableTitle,
  tableCount,
  showControls = true,
  showSearchBar = true,
  showButton = true,
}) => {
  return (
    <div className="w-full font-inter  bg-white rounded-t-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between space-x-3">
        <div className="w-[20%] ">
          <h1 className="text-base sm:text-[18px]    font-medium">
            {tableTitle}
            {tableCount !== undefined && (
              <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
                {tableCount}
              </span>
            )}
          </h1>
        </div>
        {/*  */}
        <div className="flex flex-grow justify-end items-center space-x-4">
          {showSearchBar && <SearchBar />}

          {showControls && (
            <button className="cursor-pointer">
              <img src={getImageSrc("filter.svg")} alt="Filter" />
            </button>
          )}
          {showButton && (
            <div className="  ">
              <Button
                variant="primary"
                className="text-[10px]  sm:text-[14px]  "
              >
                Add New{" "}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tablehead;
