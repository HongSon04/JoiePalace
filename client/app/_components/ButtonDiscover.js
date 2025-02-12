import { Spinner } from "@nextui-org/react";
import { memo } from "react";
import { useRouter } from "next/navigation";

const ButtonDiscover = ({ link, name, className, isLoading, ...props }) => {
  const router = useRouter();

  const navigation = () => {
    router.push(link || "#");
  };

  return (
    <button
      className={`bg-gold flex justify-center items-center gap-1 py-2 px-3 rounded-3xl cursor-pointer ${className}`}
      {...props}
      onClick={navigation}
    >
      {isLoading && (
        <Spinner
          size="sm"
          classNames={{
            circle1: "w-12 h-12 border-b-gold",
            circle2: "w-12 h-12 border-b-gold",
          }}
        />
      )}
      <span className="text-[1em] max-lg:min-w-[65px] font-medium flex items-center h-6">
        {name ? name : "Khám phá"}
      </span>
      <div className="w-[24px] h-[24px]">
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
      </div>
    </button>
  );
};

export default memo(ButtonDiscover);
