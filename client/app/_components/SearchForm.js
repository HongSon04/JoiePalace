// import icons
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm() {
  return (
    <form
      action="#"
      className="bg-white px-3 py-3 rounded-full flex items-center"
    >
      <input
        type="text"
        placeholder="Search..."
        className="outline-none placeholder-gray-400"
      />
      <button
        type="submit"
        className="text-md w-5 h-5 rounded-full flex-center"
      >
        <MagnifyingGlassIcon className="text-gray-600" />
      </button>
    </form>
  );
}

export default SearchForm;
