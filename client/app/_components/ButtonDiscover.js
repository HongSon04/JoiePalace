import { memo } from "react";

const ButtonDiscover = ({ name, className, ...props }) => {
  return (
    <button
      className={`bg-gold flex justify-center items-center gap-1 py-2 rounded-3xl cursor-pointer ${className}`}
      {...props}
    >
      <span className="text-[1em] font-medium flex items-center h-6">
        {name ? name : "Khám phá"}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M7.52867 11.5286L8.47133 12.4712L12.9427 7.9999L8.47133 3.52856L7.52867 4.47123L10.3907 7.33323H4V8.66656H10.3907L7.52867 11.5286Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default memo(ButtonDiscover);
