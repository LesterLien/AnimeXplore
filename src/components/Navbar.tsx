import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";

export default function Navbar() {
  return (
    <div className="h-20 flex items-center justify-between bg-[#242424] text-[20px] outline-1">
      <div className="ml-5 space-x-8">
        <span>AnimeXplore</span>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
      </div>
      <div className='mr-5 w-50 bg-[#6f7070] p-1 flex flex-row items-center gap-2 rounded-lg'>
        <IoIosSearch className='text-[22px]'/>
        <span className='text-[13px]'>Search here...</span>
      </div>
    </div>
  )
}