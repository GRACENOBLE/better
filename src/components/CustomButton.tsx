const CustomButton = ({
  children,
  className,
  size,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
}) => {
  return (
    <button
      className={`group relative border-none bg-transparent p-0 outline-none cursor-pointer ${className}`}
      type="button"
    >
      {/* Shadow */}
      <span className="shadow absolute top-0 left-0 w-full h-full bg-black/25 rounded-full translate-y-[2px] transition-transform duration-[250ms] [transition-timing-function:cubic-bezier(0.3,0.7,0.4,1.5)] group-hover:translate-y-[4px] group-active:translate-y-[1px] group-active:duration-[34ms]"></span>
      {/* Border gradient */}
      <span
        className="absolute top-0 left-0 w-full h-full rounded-full"
        style={{
          background:
            "linear-gradient(to left, hsl(217, 33%, 16%) 0%, hsl(217, 33%, 32%) 8%, hsl(217, 33%, 32%) 92%, hsl(217, 33%, 16%) 100%)",
        }}
      ></span>
      {/* Front */}
      <div
        className={`front relative flex items-center justify-center ${
          size == "lg" ? "px-7 py-3" : size == "sm" ? "px-4 py-4 text-sm" : "px-6 py-2"
        }  text-white bg-black rounded-full translate-y-[-4px] transition-transform duration-[250ms] [transition-timing-function:cubic-bezier(0.3,0.7,0.4,1.5)] group-hover:translate-y-[-6px] group-active:translate-y-[-2px] group-active:duration-[34ms]`}
      >
        <span className="select-none font-medium">{children}</span>
      </div>
    </button>
  );
};

export default CustomButton;
