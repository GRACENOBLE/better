import { cn } from "@/lib/utils";
import Image from "next/image";

export const Child = () => {
  return <Icon image={"/icons/connect.png"} />;
};

export const Sister = () => {
  return <Icon image={"/icons/branch-icon.png"} classname="-scale-y-[100%]" />;
};
export const AlignHorizontal = () => {
  return (
    <Icon image={"/icons/align-nodes-horizontal.png"} classname="rotate-180" />
  );
};
export const AlignVertical = () => {
  return (
    <Icon image={"/icons/align-nodes-vertical.png"} classname="rotate-180" />
  );
};
export const AlignAllNodes = () => {
  return <Icon image={"/icons/align-all-nodes.png"} classname="rotate-180" />;
};

const Icon = ({ image, classname }: { image: string; classname?: string }) => {
  return (
    <Image
      src={image}
      alt={"new step icon"}
      width={100}
      height={100}
      className={`object-contain h-full py-2 absolute ${classname}`}
    />
  );
};
