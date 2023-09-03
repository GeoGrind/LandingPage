import Image from 'next/image';
import geoGrindLogo from '../assets/GeoGrindDark.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="bg-gray-300 p-6 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image src={geoGrindLogo} alt="GeoGrind Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold text-gray-800">GeoGrind</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="text-lg text-gray-800 hover:text-gray-600">About</a>
          <a href="#" className="text-lg text-gray-800 hover:text-gray-600">Features</a>
          <a href="#" className="text-lg text-gray-800 hover:text-gray-600">Team</a>
          <a href="#" className="text-lg text-gray-800 hover:text-gray-600">Contact</a>
        </nav>
        
        <div className="md:hidden">
          <FontAwesomeIcon icon={faBars} className="text-xl text-gray-800" />
        </div>
      </div>
    </header>
  )
}

export { Header }
