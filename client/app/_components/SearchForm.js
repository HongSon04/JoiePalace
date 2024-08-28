// import icons
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm() {
  return (
    <form action="#" className="glass px-3 py-3 rounded-full flex items-center">
      <input type="text" placeholder="Search..." className="outline-none" />
      <button
        type="submit"
        className="text-md w-5 h-5 rounded-full flex-center"
      >
        <MagnifyingGlassIcon />
      </button>
    </form>
  );
}

export default SearchForm;
