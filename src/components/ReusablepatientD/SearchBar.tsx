// SearchBar.tsx
import { getImageSrc } from "../../utils/imageUtils";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex w-full items-center gap-2 border border-gray-200 py-2 px-4 rounded-[10px]">
      <img src={getImageSrc("search.svg")} alt="Search" />
      <input
        type="search"
        placeholder="Search by name or card ID"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full outline-none font-medium placeholder:text-xs text-xs"
      />
    </div>
  );
};

export default SearchBar;
