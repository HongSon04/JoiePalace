"use client";

import { findInputError } from "@/app/_utils/findInputError";
import { isFormInvalid } from "@/app/_utils/isFormInvalid";
import { AnimatePresence, motion } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { DatePicker, Input, Textarea } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import { parseAbsoluteToLocal } from "@internationalized/date";

function CustomInput({
  onChange,
  autoFocus = false,
  validation,
  inputType = "text",
  multiLine = false,
  label = "label",
  labelPlacement = "outside",
  value = "",
  className,
  classNames = {
    label: "!text-white font-bold",
    inputWrapper: "!bg-whiteAlpha-100",
    input: "!text-white",
    placeholder: "!text-gray-400",
  },
  placeholder = "",
  children: startContent,
  name = "",
  errorMessage,
  ariaLabel,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, name);
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
        aria-label={ariaLabel}
      />
    );

  if (multiLine)
    return (
      <Textarea
        onChange={onChange}
        autoFocus={autoFocus}
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
        aria-label={ariaLabel}
      />
    );

  return (
    <div className="w-full">
      <Input
        autoFocus={autoFocus}
        name={name}
        value={value}
        label={label}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        className={className}
        classNames={classNames}
        startContent={startContent}
        // isInvalid={isInvalid}
        {...register(name, validation)}
        onChange={onChange}
        errorMessage={`${ariaLabel} ${
          inputError?.error?.message || errorMessage
        }`}
        aria-label={ariaLabel}
      />
      <AnimatePresence mode="wait" initial={false}>
        {isInvalid && (
          <InputError
            message={`${ariaLabel} ${
              inputError?.error?.message || errorMessage
            }`}
            key={inputError?.error?.message}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InputError({ message }) {
  return (
    <motion.p
      className="flex items-center justify-start gap-1 font-semibold text-[10px] text-red-500"
      {...framer_error}
    >
      <ExclamationCircleIcon className="w-4 h-4" />
      {message}
    </motion.p>
  );
}

const framer_error = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2 },
};

export default CustomInput;
