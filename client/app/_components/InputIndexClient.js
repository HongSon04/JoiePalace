"use client";

const InputIndex = (props) => {
  return (
    <div className="w-full h-auto gap-1 flex flex-col">
      <input
        className={`w-full py-3 font-normal border border-b-white border-t-0 border-l-0 border-r-0 focus:border-b-gold placeholder-white ${props.styles}`}
        {...props}
      />
      <span className="text-xs text-red-600"></span>
    </div>
  );
};
export default InputIndex;
