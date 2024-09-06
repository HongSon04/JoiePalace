"use client";

import { findInputError } from "@/app/_utils/findInputError";
import { isFormInvalid } from "@/app/_utils/isFormInvalid";
import { AnimatePresence, motion } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { DatePicker, Input, Textarea } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import { parseAbsoluteToLocal } from "@internationalized/date";

function CustomInput({
  validation,
  inputType = "text",
  multiLine = false,
  label = "label",
  labelPlacement = "outside",
  value = "",
  className,
  classNames = {
    label: "!text-white font-bold",
    inputWrapper: "!bg-whiteAlpha-200",
    input: "!text-white",
  },
  placeholder = "",
  children: startContent,
  name = "",
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, label);
  const isInvalid = isFormInvalid(inputError);

  if (inputType === "date")
    return (
      <DatePicker
        size="md"
        variant="flat"
        label={label}
        labelPlacement={labelPlacement}
        value={parseAbsoluteToLocal(value)}
        className={className}
        classNames={classNames}
        isInvalid={isInvalid}
        {...register(name, validation)}
      />
    );

  if (multiLine)
    return (
      <Textarea
        name={name}
        value={value}
        label={label}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        className={className}
        classNames={classNames}
        startContent={startContent}
        isInvalid={isInvalid}
        {...register(name, validation)}
      />
    );

  return (
    <Input
      name={name}
      value={value}
      label={label}
      labelPlacement={labelPlacement}
      placeholder={placeholder}
      className={className}
      classNames={classNames}
      startContent={startContent}
      isInvalid={isInvalid}
      {...register(name, validation)}
    />
  );
}

function InputError({ message }) {
  return (
    <motion.p
      className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md"
      {...framer_error}
    >
      <ExclamationCircleIcon className="w-4 h-4" />
      {message}
    </motion.p>
  );
}

const framer_error = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 10 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2 },
};

export default CustomInput;
