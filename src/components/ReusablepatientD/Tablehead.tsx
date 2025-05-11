import { Plus } from "lucide-react";
import Button from "../../Shared/Button";
import { getImageSrc } from "../../utils/imageUtils";
import SearchBar from "./SearchBar";

interface TableheadProps {
  tableTitle?: string;
  tableCount?: number;
  showControls?: boolean;
  showSearchBar?: boolean;
  showButton?: boolean;
  typebutton?: string;
  onButtonClick?: () => void;
  searchBar?: React.ReactNode;
}

const Tablehead: React.FC<TableheadProps> = ({
  tableTitle,
  typebutton,
  tableCount,
  showControls = false,
  showSearchBar = false,
  showButton = false,
  onButtonClick,
  searchBar,
}) => {
  return (
    <div className="w-full font-inter  bg-white rounded-t-[8px] shadow overflow-hidden">
      <div className="p-5 flex md:items-center flex-col md:flex-row justify-between space-x-3 space-y-3">
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
        <div className="flex   flex-grow justify-end items-center space-x-6 ">
          <div className="flex items-center space-x-4 min-w-[70%]  ">
            {showSearchBar && (
              <div className="w-full ">
                {searchBar || <SearchBar onSearch={() => {}} />}
              </div>
            )}

            {showControls && (
              <button className="cursor-pointer">
                <img src={getImageSrc("filter.svg")} alt="Filter" />
              </button>
            )}
          </div>
          {showButton && (
            <div className=" ">
              <Button
                variant="primary"
                // size="md"
                className="flex items-center text-[12px] gap-2 px-2 md:px-4"
                onClick={onButtonClick}
              >
                {typebutton}
                <Plus size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tablehead;
