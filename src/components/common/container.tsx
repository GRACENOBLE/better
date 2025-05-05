const Container = ({
  children,
  size = "lg",
}: {
  children: React.ReactNode;
  size?: "sm" | "lg";
}) => {
  return (
    <div
      className={`${
        size == "sm" ? "max-w-[1056px]" : size == "lg" && "max-w-[1280px]"
      } w-full mx-auto px-4`}
    >
      {children}
    </div>
  );
};

export default Container;
