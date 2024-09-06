import { Spinner } from "@nextui-org/react";

function Loading() {
  return (
    <div className="fixed inset-0 bg-blackAlpha-50 backdrop-blur-lg flex-center min-h-full flex-col">
      <Spinner color="gold" />

      <span className="text-base text-gold mt-5">Vui lòng đợi...</span>
    </div>
  );
}

export default Loading;
