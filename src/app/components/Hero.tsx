import Image from 'next/image';
import geoGrindLogo from '../assets/GeoGrindDark.png';

const Hero = () => (
    <section className="bg-gradient-to-r text-center pt-32 px-6 md:px-20 lg:px-40">
        <div className="container mx-auto">
            <h1 className="text-9xl font-bold mb-3 tracking-tighter leading-none">GeoGrind</h1>
            <p className="text-2xl mb-5 leading-relaxed max-w-2xl mx-auto">Discover study partners near you, connect over courses, and redefine the boundaries of collaborative learning.</p>

            <Image
                src={geoGrindLogo}
                alt="GeoGrind Logo"
                className="mx-auto mb-10"
            />

            <div className="grid grid-cols-2 gap-4">
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                    <button className="relative inline-flex items-center justify-center p-2 mb-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                        <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Download for Windows
                        </span>
                    </button>
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                    <button className="relative inline-flex items-center justify-center p-2 mb-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                        <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Download on the App Store
                        </span>
                    </button>
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                    <button className="relative inline-flex items-center justify-center p-2 mb-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                        <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Get it on Google Play
                        </span>
                    </button>
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                    <button className="relative inline-flex items-center justify-center p-2 mb-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                        <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Open GeoGrind in your browser
                        </span>
                    </button>
                </a>
            </div>
        </div>
    </section>
)

export { Hero }
