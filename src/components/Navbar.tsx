import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="h-20 grid grid-cols-3 items-center outline-1 outline-white">
      <div className="flex justify-start ml-5">
      </div>
      <div className="flex justify-center space-x-8 text-white text-[20px] m-4">
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
        <Link to="/" className="hover:text-[#854CE6] transition-colors duration-200">placeholder</Link>
      </div>
    </div>
  )
}