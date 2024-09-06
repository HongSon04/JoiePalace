function TextButton({
  size = "normal",
  type = "primary",
  children,
  onClick,
  className = "",
}) {
  let sizeClass = "text-[12px]";
  if (size === "sm") sizeClass = "text-sm";
  if (size === "md") sizeClass = "text-md";
  if (size === "lg") sizeClass = "text-lg";
  if (size === "xl") sizeClass = "text-xl";

  if (type === "primary")
    return (
      <button
        onClick={onClick}
        className={`text-[12px] font-semibold text-white hover:text-gray-200 ${className} ${sizeClass}`}
      >
        {children}
      </button>
    );

  if (type === "danger")
    return (
      <button
        onClick={onClick}
        className={`text-[12px] font-semibold text-red-500 hover:text-red-400 ${className} ${sizeClass}`}
      >
        {children}
      </button>
    );

  return <button className={`${className}`}>{children}</button>;
}

export default TextButton;
