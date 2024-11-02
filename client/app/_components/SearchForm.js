// import icons
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm({
  classNames = {
    form: "",
    input: "",
    button: "",
  },
  value,
  onChange,
  placeholder,
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      action="#"
      className={`bg-whiteAlpha-100 px-3 py-2 rounded-full flex items-center ${classNames.form}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`outline-none placeholder-gray-200 ${classNames.input}`}
      />
      <button
        type="submit"
        className={`text-md w-5 h-5 rounded-full flex-center text-white ${classNames.button}`}
      >
        <MagnifyingGlassIcon className="text-white" />
      </button>
    </form>
  );
}

export default SearchForm;
