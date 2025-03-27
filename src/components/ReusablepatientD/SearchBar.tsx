import { getImageSrc } from "../../utils/imageUtils";

const SearchBar = () => {
  return (
    <div className="flex w-full items-center gap-2 border border-gray-200 py-2 px-4 rounded-[10px] ">
      <img src={getImageSrc("search.svg")} alt="Search" />
      <input
        type="search"
        placeholder="Type to search"
        className=" w-full  outline-none font-medium placeholder:text-xs text-xs"
      />
    </div>
  );
};

export default SearchBar;
