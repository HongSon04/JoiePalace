import { Spinner } from "@nextui-org/react";

function LoadingContent() {
  return (
    <div className="absolute inset-0 bg-blackAlpha-500 z-50 flex-center backdrop-blur-sm">
      <Spinner
        classNames={{
          circle1: "w-12 h-12 border-b-gold",
          circle2: "w-12 h-12 border-b-gold",
        }}
      />
    </div>
  );
}

export default LoadingContent;
