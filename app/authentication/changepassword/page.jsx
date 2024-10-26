import dynamic from "next/dynamic";
import ChangePassword from "@/components/common/form/register/changePassword";

const index = () => {
  return <ChangePassword />;
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
