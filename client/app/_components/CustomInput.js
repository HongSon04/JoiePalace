"use client";

import { findInputError } from "@/app/_utils/findInputError";
import { isFormInvalid } from "@/app/_utils/isFormInvalid";
import { AnimatePresence, motion } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { DatePicker, Input, Textarea } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import { parseAbsoluteToLocal } from "@internationalized/date";

// onChange,
// autoFocus = false,
// validation,
// inputType = "text",
// multiLine = false,
// label = "label",
// labelPlacement = "outside",
// value = "",
// className,
// classNames = {
//   label: "!text-white font-bold",
//   inputWrapper: "!bg-whiteAlpha-100",
//   input: "!text-white",
//   placeholder: "!text-gray-400",
// },
// placeholder = "",
// children: startContent,
// name = "",
// errorMessage,
// ariaLabel,

function CustomInput(props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, props.name);
  const isInvalid = isFormInvalid(inputError);

  if (props.inputType === "date")
    return (
      <DatePicker
        {...props}
        size="md"
        variant="flat"
        value={parseAbsoluteToLocal(value)}
        {...register(props.name, validation)}
        aria-label={ariaLabel}
        ref={props.ref}
      />
    );

  if (props.inputType === "select")
    return (
      <div className="flex flex-col">
        <p className="font-semibold text-small leading-8">{props.label}</p>
        <select
          name={props.name}
          id={props.id}
          className={`${props.className} bg-blackAlpha-100`}
          value={props.value}
          onChange={props.onChange}
          aria-label={props.ariaLabel}
          required
        >
          {props.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && (
            <InputError
              message={`${props.ariaLabel} ${
                inputError?.error?.message || props.errorMessage
              }`}
              key={inputError?.error?.message}
            />
          )}
        </AnimatePresence>
      </div>
    );
  return (
    <div className="w-full">
      {props.multiLine ? (
        <Textarea
          {...props}
          ref={props.ref}
          aria-label={props.ariaLabel}
          {...register(props.name, props.validation)}
          errorMessage={`${props.ariaLabel} ${
            inputError?.error?.message || props.errorMessage
          }`}
          classNames={
            props.classNames || {
              label: "!text-white font-bold",
              inputWrapper: "!bg-whiteAlpha-100",
              input: "!text-white",
              placeholder: "!text-gray-400",
            }
          }
        />
      ) : (
        <Input
          {...props}
          {...register(props.name, props.validation)}
          ref={props.ref}
          value={props.value}
          onChange={props.onChange}
          errorMessage={`${props.ariaLabel} ${
            inputError?.error?.message || props.errorMessage
          }`}
          classNames={
            props.classNames || {
              label: "!text-white font-bold",
              inputWrapper: "!bg-whiteAlpha-100",
              input: "!text-white",
              placeholder: "!text-gray-400",
            }
          }
          aria-label={props.ariaLabel}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {isInvalid && (
          <InputError
            message={`${props.ariaLabel} ${
              inputError?.error?.message || props.errorMessage
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
      className="flex items-center justify-start gap-1 font-semibold text-[12px] text-red-500"
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
