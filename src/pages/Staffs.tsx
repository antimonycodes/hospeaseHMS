import StaffsPage from "../components/Superadmin/Staffs/StaffsPage";

interface StaffsProps {
  department: string;
}

const Staffs = ({ department }: StaffsProps) => {
  return (
    <div>
      <StaffsPage department={department} />
    </div>
  );
};

export default Staffs;
