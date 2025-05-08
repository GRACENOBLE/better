import { cn } from "@/lib/utils";
import Image from "next/image";

export const Step = () => {
  return <Icon image={"/icons/connect.png"} />;
};

export const Goal = () => {
  return <Icon image={"/icons/branch-icon.png"} classname="rotate-180"/>;
};

const Icon = ({ image, classname }: { image: string; classname?: string }) => {
  return (
    <Image
      src={image}
      alt={"new step icon"}
      width={100}
      height={100}
      className={`object-contain h-full py-1 absolute ${classname}`}
    />
  );
};
