import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

function Error({ error, children, className, withOverlay }) {
  if (withOverlay) {
    return (
      <div className="fixed inset-0 bg-blackAlpha-500 backdrop-blur-md flex-center min-h-full flex-col z-50">
        <ExclamationCircleIcon className="h-16 w-16 text-red-500 inline-block" />
        <span className="text-red-500 text-xl mt-5">{error}</span>
        {children}
      </div>
    );
  }

  return (
    <div className={`flex flex-col flex-center gap-5 ${className}`}>
      <ExclamationCircleIcon className="h-5 w-5 text-red-500 inline-block" />
      <span className="text-red-500 text-base">{error}</span>
      {children}
    </div>
  );
}

export default Error;
