// import { AnimatePresence, motion } from "framer-motion";
// import {
//   ExclamationCircleIcon,
//   EyeIcon,
//   EyeSlashIcon,
// } from "@heroicons/react/24/outline";
// import { capitalize } from "../_utils/helpers";
// import { Button } from "@nextui-org/react";

// /**
//  * @ Recommend: Before using this component, make sure that you have set up the useForm hook from react-hook-form with zod resolver and defined the schema for validation.
//  *
//  * @ Set up Example:
//  * const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//   });
//  *
//  * @ Usage:
//  * <FormInput
//     id={"email"}
//     name={"email"} // Must have: because you have to using it to register the input
//     label={"email"} // If empty: label won't show
//     ariaLabel={"Email"} // Must have: for accessibility
//     type={"email"}
//     register={register}
//     errors={errors}
//     errorMessage={errors?.email?.message}
//   ></FormInput>
//  */

// /**
//  * FormInput Component
//  * @param {Object} props - Component props
//  * @returns {JSX.Element}
//  */
// function FormInput({
//   register,
//   errors,
//   label,
//   ariaLabel,
//   name,
//   id,
//   type = "text",
//   className = "",
//   labelClassName = "font-semibold text-[14px]",
//   errorMessage = "",
//   isPasswordVisible,
//   setIsPasswordVisible,
//   placeholder = "",
//   wrapperClassName = "",
//   cols = 12,
//   rows = 8,
//   inputRef = null,
//   options = [],
//   required = false,
//   defaultValue = "", // Add defaultValue prop
//   theme = "light",
// }) {
//   const themeClassName = {
//     light: {
//       input:
//         "!bg-whiteAlpha-100 !hover:bg-whiteAlpha-200 !focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400",
//       label: "!text-white",
//     },
//     dark: {
//       input:
//         "!bg-blackAlpha-200 !hover:bg-blackAlpha-400 !focus:bg-blackAlpha-400 !text-gray-800 !placeholder:text-gray-600",
//       label: "!text-gray-600",
//     },
//   }[theme];

//   const renderInput = () => {
//     const commonProps = {
//       ref: inputRef,
//       placeholder,
//       role: "input",
//       id: id || name,
//       name,
//       "aria-label": ariaLabel,
//       className: `px-3 py-2 rounded-lg outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className} ${themeClassName.input}`,
//       defaultValue,
//     };

//     switch (type) {
//       case "textarea":
//         return <textarea {...commonProps} cols={cols} rows={rows} />;
//       case "select":
//         return (
//           <select {...register(name)} {...commonProps} required={required}>
//             {options.map((option, index) => (
//               <option value={option.id} key={index} className="text-gray-600">
//                 {option.name}
//               </option>
//             ))}
//           </select>
//         );
//       case "password":
//         return (
//           <div className="flex items-center">
//             <input
//               {...commonProps}
//               type={isPasswordVisible ? "text" : "password"}
//             />
//             <Button
//               role="toggle-button"
//               onClick={setIsPasswordVisible}
//               isIconOnly
//               className="bg-transparent hover:bg-whiteAlpha-50"
//             >
//               {isPasswordVisible ? (
//                 <EyeSlashIcon className="w-5 h-5 text-white" />
//               ) : (
//                 <EyeIcon className="w-5 h-5 text-white" />
//               )}
//             </Button>
//           </div>
//         );
//       default:
//         return <input {...register(name)} {...commonProps} type={type} />;
//     }
//   };

//   return (
//     <div
//       className={`flex flex-col gap-2 w-full mt-5 text-white ${wrapperClassName}`}
//     >
//       {label && (
//         <label
//           role="label"
//           htmlFor={id}
//           className={`${labelClassName} ${themeClassName.label}`}
//         >
//           {capitalize(label)}
//         </label>
//       )}
//       <div role="input-wrapper" className="w-full rounded-lg overflow-hidden">
//         {renderInput()}
//       </div>
//       {errors[name] && (
//         <AnimatePresence mode="wait" initial={false}>
//           <InputError message={errorMessage} key={name} />
//         </AnimatePresence>
//       )}
//     </div>
//   );
// }

// export default FormInput;

// function InputError({ message }) {
//   return (
//     <motion.p
//       className="flex items-center justify-start gap-1 font-semibold text-[12px] text-red-500"
//       {...framer_error}
//     >
//       <ExclamationCircleIcon className="w-4 h-4" />
//       {message}
//     </motion.p>
//   );
// }

// const framer_error = {
//   initial: { opacity: 0, y: 8 },
//   animate: { opacity: 1, y: 0 },
//   exit: { opacity: 0, y: 10 },
//   transition: { duration: 0.2 },
// };

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
  value = "",
  onChange,
  errors,
  label,
  ariaLabel,
  name,
  id,
  type = "text",
  className = "",
  labelClassName = "font-semibold text-[14px]",
  errorMessage = "",
  isPasswordVisible,
  setIsPasswordVisible,
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
  theme = "light",
  optionClassName = "",

  // for defaultValue
  defaultValue = "",
}) {
  const themeClassName = {
    light: {
      input:
        "!bg-whiteAlpha-100 !hover:bg-whiteAlpha-200 !focus:bg-whiteAlpha-200 !text-white !placeholder:text-gray-400",
      label: "!text-white",
    },
    dark: {
      input:
        "!bg-blackAlpha-200 !hover:bg-blackAlpha-400 !focus:bg-blackAlpha-400 !text-gray-800 !placeholder:text-gray-600",
      label: "!text-gray-600",
    },
  }[theme];

  return (
    <div
      className={`flex flex-col gap-2 w-full mt-5 text-white ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label !== "" && (
        <label
          role="label"
          htmlFor={id}
          className={`${labelClassName} ${themeClassName.label}`}
        >
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
            {...register(name)}
            value={value}
            onChange={onChange}
            ref={inputRef}
            cols={cols}
            rows={rows}
            placeholder={placeholder}
            role="input"
            id={id || name}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className} ${themeClassName.input}`}
            // defaultValue={defaultValue}
          />
        )}
        {type === "text" && (
          <input
            {...register(name)}
            value={value}
            onChange={onChange}
            ref={inputRef}
            placeholder={placeholder}
            role="input"
            type="text"
            id={id || name}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className} ${themeClassName.input}`}
            // defaultValue={defaultValue}
          />
        )}
        {type === "number" && (
          <input
            {...register(name)}
            value={value}
            onChange={onChange}
            ref={inputRef}
            placeholder={placeholder}
            role="input"
            type="number"
            id={id || name}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className} ${themeClassName.input}`}
            // defaultValue={defaultValue}
          />
        )}
        {type === "password" && (
          <input
            {...register(name)}
            value={value}
            onChange={onChange}
            ref={inputRef}
            placeholder={placeholder}
            role="input"
            type={isPasswordVisible ? "text" : "password"}
            id={id}
            name={name}
            aria-label={ariaLabel}
            className={`px-3 py-2 outline-none border-none text-white placeholder:text-gray-400 w-full flex-1 ${className} ${themeClassName.input}`}
            // defaultValue={defaultValue}
          />
        )}
        {type === "select" && (
          <select
            {...register(name)}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            className={`select w-full !bg-blackAlpha-100 text-gray-600 hover:text-gray-400 ${className} ${themeClassName.input}`}
            required={required}
            // defaultValue={defaultValue}
          >
            {options.map((option, index) => (
              <option
                value={option.id}
                key={index}
                className={`option text-gray-600 ${optionClassName}`}
              >
                {option.name}
              </option>
            ))}
          </select>
        )}
        {type !== "password" &&
          type !== "textarea" &&
          type !== "text" &&
          type !== "number" &&
          type !== "select" && (
            <input
              {...register(name)}
              value={value}
              onChange={onChange}
              ref={inputRef}
              placeholder={placeholder}
              role="input"
              type={type}
              id={id || name}
              name={name}
              aria-label={ariaLabel}
              className={`px-3 py-2 rounded-lg bg-whiteAlpha-100 outline-none border-none text-white placeholder:text-gray-400 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-400 w-full ${className} ${themeClassName.input}`}
              // defaultValue={defaultValue}
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
