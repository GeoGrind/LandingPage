import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faXTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-300 w-full p-10 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">

        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">GeoGrind</h2>
          <p className="text-sm">
            Redefining the boundaries of collaborative learning.
          </p>
        </div>
        
        {/* Social Media Icons */}
        <div>
          <a href="https://www.facebook.com/" className="hover:text-gray-800" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="https://twitter.com/" className="hover:text-gray-800" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a href="https://instagram.com/" className="hover:text-gray-800" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.linkedin.com/" className="hover:text-gray-800" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>

      </div>

      {/* Credits */}
      <div className="mt-4 text-center text-sm">
        © {new Date().getFullYear()} GeoGrind. All rights reserved.
      </div>
    </footer>
  )
}

export { Footer }
