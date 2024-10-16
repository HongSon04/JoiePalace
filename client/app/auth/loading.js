import { Spinner } from "@nextui-org/react";

function Loading() {
  return (
    <div className="fixed inset-0 bg-blackAlpha-500 z-50 backdrop-blur-lg flex-center min-h-full flex-col">
      <Spinner
        classNames={{
          circle1: "w-12 h-12 border-b-white",
          circle2: "w-12 h-12 border-b-white",
        }}
      />

      <span className="text-base text-white mt-5">Vui lòng đợi...</span>
    </div>
  );
}

export default Loading;
