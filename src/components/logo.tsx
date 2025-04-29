import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <Image
        src={"/images/smile.jpg"}
        alt={""}
        width={500}
        height={500}
        className="h-12 w-12 object-cover rounded-md"
      />
      <span className="text-2xl font-medium">Better</span>
    </Link>
  );
};

export default Logo;
