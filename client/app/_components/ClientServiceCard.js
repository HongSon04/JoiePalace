import {
  useCheckbox,
  Chip,
  VisuallyHidden,
  tv,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ClientServiceCard({
  service,
  state,
  onChange,
  name,
  className,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <label
      key={service.id}
      className={`flex flex-col items-center gap-3 cursor-pointer p-3 rounded-lg ${
        state == service.id ? "bg-whiteAlpha-400" : ""
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={service.id}
        checked={state == service.id}
        onChange={onChange}
        className="hidden"
      />
      <div className="w-[110px] h-[100px] relative overflow-hidden rounded-lg">
        <Image
          fill
          sizes="100px"
          src={service.url || service.image}
          alt={service.name}
          className="object-cover"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        />
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Modal Title
                </ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat
                    consequat elit dolor adipisicing. Mollit dolor eiusmod sunt
                    ex incididunt cillum quis. Velit duis sit officia eiusmod
                    Lorem aliqua enim laboris do dolor eiusmod. Et mollit
                    incididunt nisi consectetur esse laborum eiusmod pariatur
                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <span className="text-white text-start w-full text-sm ">
        {service.name}
      </span>
      <span className="text-white text-start w-full text-sm ">
        {service.price.toLocaleString()} VNĐ
      </span>
    </label>
  );
}
