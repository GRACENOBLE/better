import Image from "next/image";

const Header = () => {
  return (
    <header>
        <Image src={"/images/smile.jpg"} alt={""} width={500} height={500} className=""/>
    </header>
  );
};

export default Header;