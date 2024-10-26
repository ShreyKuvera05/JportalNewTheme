import dynamic from "next/dynamic";
import SignIn from "@/components/common/form/register/signin";

const index = () => {
  return <SignIn />;
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
