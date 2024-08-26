// import icons
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchForm() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <button type="submit">
        <MagnifyingGlassIcon></MagnifyingGlassIcon>
      </button>
    </form>
  );
}

export default SearchForm;
