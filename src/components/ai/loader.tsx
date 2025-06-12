const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      <div
        className="w-1 h-1 bg-black rounded-full animate-bounce-custom"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-1 h-1 bg-black rounded-full animate-bounce-custom"
        style={{ animationDelay: "100ms" }}
      ></div>
      <div
        className="w-1 h-1 bg-black rounded-full animate-bounce-custom"
        style={{ animationDelay: "300ms" }}
      ></div>
      <style jsx>{`
        @keyframes bounce-custom {
          100% {
            transform: translateY(-4px);
          }
        }
        .animate-bounce-custom {
          animation: bounce-custom 1s infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Loader;
