import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";

export default function Navbar() {
  return (
    <div className="h-20 flex items-center justify-between bg-[#242424] text-[20px] px-5">
      <div className="flex items-center gap-8">
        <span className="font-bold text-lg">AnimeXplore</span>

        <Link 
          to="/" 
          className="hover:text-[#854CE6] transition-colors duration-200 hidden sm:inline"
        >
          placeholder 1
        </Link>
        <Link 
          to="/" 
          className="hover:text-[#854CE6] transition-colors duration-200 hidden md:inline"
        >
          placeholder 2
        </Link>
        <Link 
          to="/" 
          className="hover:text-[#854CE6] transition-colors duration-200 hidden lg:inline"
        >
          placeholder 3
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-[#6f7070] px-3 py-1 rounded-lg text-sm min-w-[150px] max-w-[250px] flex-shrink">
        <IoIosSearch className="text-[22px]" />
        <span className="truncate">Search here...</span>
      </div>
    </div>
  );
}
