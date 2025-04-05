import { Plus } from "lucide-react";
import Button from "../../Shared/Button";
import { getImageSrc } from "../../utils/imageUtils";
import SearchBar from "./SearchBar";

interface TableheadProps {
  tableTitle: string;
  tableCount?: number;
  showControls?: boolean;
  showSearchBar?: boolean;
  showButton?: boolean;
  typebutton: string;
  onButtonClick?: () => void;
}

const Tablehead: React.FC<TableheadProps> = ({
  tableTitle,
  typebutton,
  tableCount,
  showControls = true,
  showSearchBar = true,
  showButton = false,
  onButtonClick,
}) => {
  return (
    <div className="w-full font-inter  bg-white rounded-t-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between space-x-3">
        <div className="min-w-[15%] ">
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
          {showSearchBar && (
            <div className="w-full min-w-[60%] ">
              <SearchBar />
            </div>
          )}

          {showControls && (
            <button className="cursor-pointer">
              <img src={getImageSrc("filter.svg")} alt="Filter" />
            </button>
          )}
          {showButton && (
            <div className="w-[18%] flex justify-end  ">
              <Button
                variant="primary"
                size="md"
                className=" flex items-center gap-2  "
                onClick={onButtonClick}
              >
                {typebutton}
                <Plus size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tablehead;
