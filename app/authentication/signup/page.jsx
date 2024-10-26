import dynamic from "next/dynamic";
import SignUp from "@/components/common/form/register/signup";

const index = () => {
  return <SignUp />;
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
