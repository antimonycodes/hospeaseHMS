import { Bell, Menu } from "lucide-react";
import hospitalLogo from "../../assets/ribiero.png";
import { useAuthStore } from "../../store/_auth/useAuthStore";
import { useProfileStore } from "../../store/super-admin/useProfileStore";
import { useEffect } from "react";

interface TopNavProps {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNav: React.FC<TopNavProps> = ({ setIsMobileMenuOpen }) => {
  const { profileData, isLoading, getProfileData } = useProfileStore();

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);
  return (
    <div className="w-full z">
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
              src={profileData?.attributes?.logo}
              className="w-full h-full border border-primary rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
