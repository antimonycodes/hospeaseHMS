import { Bell } from "lucide-react";
import hospitalLogo from "../../assets/ribiero.png";

const TopNav = () => {
  //     border-width: 0px, 0px, 0px, 0px;

  // border-style: solid;

  // border-color: rgba(0, 153, 82, 1);

  return (
    <div className=" w-full py-2 px-4 flex justify-between items-center border-0 border-[#009952]">
      <input
        type="search"
        name=""
        id=""
        placeholder="Type to search"
        className=" border border-gray-200 py-2 px-4 rounded-[10px] w-[70%] shrink-0"
      />
      <div className=" flex items-center gap-6">
        <Bell className=" text-gray-700 w-5" />
        <div className=" size-8 ">
          <img
            src={hospitalLogo}
            className=" w-full h-full  border border-primary rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
