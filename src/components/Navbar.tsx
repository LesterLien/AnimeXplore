import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="h-20 grid grid-cols-3 items-center bg-[#242424] text-[20px] outline-1">
      <div className="flex justify-start ml-5 space-x-8">
        <span>AnimeXplore</span>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
      </div>
      <div className="flex justify-end mr-0">
        Search bar
      </div>
    </div>
  )
}