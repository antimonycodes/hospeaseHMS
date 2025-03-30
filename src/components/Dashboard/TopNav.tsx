import { Bell, Menu } from "lucide-react";
import hospitalLogo from "../../assets/ribiero.png";
import { useAuthStore } from "../../store/_auth/useAuthStore";

interface TopNavProps {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNav: React.FC<TopNavProps> = ({ setIsMobileMenuOpen }) => {
  const { user } = useAuthStore();
  console.log(user);
  // console.log(user.attributes.hospital.logo);
  return (
    <div className="w-full relative">
      <div className="w-full py-2 px-4 flex justify-between items-center border-0 border-[#009952] bg-white z-20 h-[61px] custom-shadow">
        <button
          className="md:hidden mr-2"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
        <input
          type="search"
          name=""
          id=""
          placeholder="Type to search"
          className="border border-gray-200 py-2 px-4 rounded-[10px] w-[70%] shrink-0 mr-2"
        />
        <div className="flex items-center gap-6">
          <Bell className="text-gray-700 w-5" />
          <div className="size-8">
            <img
              src={""}
              className="w-full h-full border border-primary rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
