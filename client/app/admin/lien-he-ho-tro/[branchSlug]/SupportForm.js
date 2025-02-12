import FormInput from "@/app/_components/FormInput";
import { EnvelopeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { Col, Row } from "antd";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Tên liên hệ không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  content: z
    .string()
    .min(1, { message: "Nội dung hỗ trợ không được để trống" })
    .min(10, { message: "Nội dung hỗ trợ phải có ít nhất 10 ký tự" })
    .max(1000, { message: "Nội dung hỗ trợ không được vượt quá 255 ký tự" }),
});

function SupportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleOnSubmit = async (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="p-5 rounded-md bg-whiteAlpha-200 mt-8"
    >
      <div className="flex flex-col">
        <h4 className="flex gap-3 text-white leading-6 font-semibold">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.39 14.56C16.71 13.7 14.53 13 12 13C9.47 13 7.29 13.7 5.61 14.56C4.61 15.07 4 16.1 4 17.22V20H20V17.22C20 16.1 19.39 15.07 18.39 14.56Z"
              fill="white"
            />
            <path
              d="M9.78 12H14.22C15.43 12 16.36 10.94 16.2 9.74L15.88 7.29C15.57 5.39 13.92 4 12 4C10.08 4 8.43 5.39 8.12 7.29L7.8 9.74C7.64 10.94 8.57 12 9.78 12Z"
              fill="white"
            />
          </svg>
          Tên liên hệ
        </h4>
        <FormInput
          id="name"
          name="name"
          label=""
          ariaLabel={"Tên liên hệ"}
          register={register}
          errors={errors}
          errorMessage={errors?.name?.message}
          className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
          wrapperClassName="!mt-3"
        ></FormInput>
      </div>
      <div className="flex flex-col mt-3">
        <h4 className="flex gap-3 text-white leading-6 font-semibold">
          <EnvelopeIcon className="h-6 w-6 text-white" />
          Email
        </h4>
        <FormInput
          id="email"
          name="email"
          w
          label=""
          ariaLabel={"Email"}
          register={register}
          errors={errors}
          errorMessage={errors?.email?.message}
          className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
          wrapperClassName="!mt-3"
        ></FormInput>
      </div>
      <div className="flex flex-col h-full mt-3">
        <h4 className="flex gap-3 text-white leading-6 font-semibold">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16ZM7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z"
              fill="white"
            />
          </svg>
          Nội dung hỗ trợ
        </h4>
        <FormInput
          id="content"
          name="content"
          label=""
          ariaLabel={"Content"}
          register={register}
          errors={errors}
          type="textarea"
          errorMessage={errors?.content?.message}
          className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
          wrapperClassName="!mt-3"
        ></FormInput>
      </div>
      <div className="flex justify-end mt-5 gap-5">
        <Button
          radius="full"
          startContent={<XMarkIcon className="h-6 w-6 text-white" />}
          className="bg-red-400 text-white"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          radius="full"
          startContent={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.334 2.66667H2.66732C1.93398 2.66667 1.34065 3.26667 1.34065 4.00001L1.33398 12C1.33398 12.7333 1.93398 13.3333 2.66732 13.3333H13.334C14.0673 13.3333 14.6673 12.7333 14.6673 12V4.00001C14.6673 3.26667 14.0673 2.66667 13.334 2.66667ZM13.334 5.33334L8.00065 8.66667L2.66732 5.33334V4.00001L8.00065 7.33334L13.334 4.00001V5.33334Z"
                fill="white"
              />
            </svg>
          }
          className="text-white bg-teal-400"
        >
          Gửi ngay
        </Button>
      </div>
    </form>
  );
}

export default SupportForm;
