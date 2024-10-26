import { AnimatePresence, motion } from "framer-motion";
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { capitalize } from "../_utils/helpers";
import { Button } from "@nextui-org/react";

/** 
 * @ Recommend: Before using this component, make sure that you have set up the useForm hook from react-hook-form with zod resolver and defined the schema for validation.
 * 
 * @ Set up Example:
 * const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
 * 
 * @ Usage:
 * <FormInput
    id={"email"}
    name={"email"} // Must have: because you have to using it to register the input
    label={"email"} // If empty: label won't show
    ariaLabel={"Email"} // Must have: for accessibility
    type={"email"}
    register={register}
    errors={errors}
    errorMessage={errors?.email?.message}
  ></FormInput>
 */

function FormInput({
  children,
  register,
  errors,
  label,
  ariaLabel,
  name,
  id,
  type = "text",
  className = "",
  errorMessage = "",
  isPasswordVisible,
  setIsPasswordVisible,
  labelClassName = "",
  placeholder = "",
  wrapperClassName = "",
  startContent = null,
  endContent = null,
  // for textarea
  cols = 12,
  rows = 8,

  // react ref
  inputRef = null,

  // for select input
  options = [],
  required = false,
  value,
  theme = "light",
  optionClassName = "",
}) {
  const themeClassName = {
    light: "",
    dark: "",
  }[theme];

  return (
    <div
      className={`flex flex-col gap-2 w-full mt-5 text-white ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label !== "" && (
        <label role="label" htmlFor={id} className={`${labelClassName}`}>
          {capitalize(label)}
        </label>
      )}
      {/* INPUT WRAPPER */}
      <div
        role="input-wrapper"
        className={`w-full rounded-lg overflow-hidden ${
          type === "password"
            ? "flex items-center bg-whiteAlpha-100 hover:bg-whiteAlpha-200"
            : ""
        }`}
      >
        {type === "textarea" && (
          <textarea
            ref={inputRef}
            cols={cols}
            rows={rows}
            placeholder={placeholder}
            role="input"
            {...register(name)}
            id={id || name}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className}`}
          />
        )}
        {type === "text" && (
          <input
            ref={inputRef}
            placeholder={placeholder}
            role="input"
            type="text"
            {...register(name)}
            id={id || name}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className}`}
          />
        )}
        {type === "password" && (
          <input
            ref={inputRef}
            placeholder={placeholder}
            role="input"
            type={isPasswordVisible ? "text" : "password"}
            {...register(name)}
            id={id}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 outline-none border-none text-white placeholder:text-gray-400 w-full flex-1 ${className}`}
          />
        )}
        {type === "select" && (
          <select
            name={name}
            id={id}
            value={value}
            className={`select !bg-blackAlpha-100 text-gray-600 hover:text-gray-400 ${className}`}
            required={required}
          >
            {options.map((option) => (
              <option
                value={option.id}
                key={option.key}
                className={`option text-gray-600 ${optionClassName}`}
              >
                {option.label}
              </option>
            ))}
          </select>
        )}
        {type !== "password" &&
          type !== "textarea" &&
          type !== "text" &&
          type !== "select" && (
            <input
              ref={inputRef}
              placeholder={placeholder}
              role="input"
              type={type}
              {...register(name)}
              id={id || name}
              name={name}
              aria-label={ariaLabel}
              className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className}`}
            />
          )}
        {type === "password" && (
          <Button
            role="toggle-button"
            onClick={setIsPasswordVisible}
            isIconOnly
            className="bg-transparent hover:bg-whiteAlpha-50"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="w-5 h-5 text-white" />
            ) : (
              <EyeIcon className="w-5 h-5 text-white" />
            )}
          </Button>
        )}
      </div>
      {errors[name] && (
        <AnimatePresence mode="wait" initial={false}>
          {errors[name] && <InputError message={errorMessage} key={name} />}
        </AnimatePresence>
      )}
    </div>
  );
}

export default FormInput;

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
