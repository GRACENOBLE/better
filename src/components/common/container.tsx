const Container = ({
  children,
  size = "lg",
  className
}: {
  children: React.ReactNode;
  size?: "sm" | "lg";
  className?: string
}) => {
  return (
    <div
      className={`${
        size == "sm" ? "max-w-[1056px]" : size == "lg" && "max-w-[1280px]"
      } w-full mx-auto px-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
