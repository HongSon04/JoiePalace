import { useToast } from "@chakra-ui/react";
import Toast from "../_components/Toast";

const useCustomToast = () => {
  const toast = useToast();

  const customToast = ({
    title = "",
    description,
    duration = 4000,
    position = "top",
    isClosable = true,
    type = "info",
  }) => {
    toast({
      position,
      duration,
      isClosable,
      render: () => (
        <Toast
          title={title}
          description={description}
          onClose={() => toast.closeAll()} // Pass the close function here
          type={type} // Pass the type to the CustomToast
        />
      ),
    });
  };

  return customToast;
};

export default useCustomToast;
