"use client";

function IconButton({ onClick, className = "", children, size = "md", type }) {
  const _size = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  return (
    <button
      type={type}
      className={`flex-center rounded-full ${className} ${_size} hover:bg-whiteAlpha-300`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IconButton;
