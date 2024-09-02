import { Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <div className="fixed inset-0 bg-blackAlpha-50 backdrop-blur-lg flex-center min-h-full flex-col">
      <Spinner
        size="xl"
        color="#B5905B"
        borderWidth={4}
        width={100}
        height={100}
      />

      <span className="text-base text-gold mt-5">Vui lòng đợi...</span>
    </div>
  );
}

export default Loading;
