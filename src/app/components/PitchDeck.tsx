import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faChalkboard, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons';

const PitchDeck = () => (
  <section className="px-6 py-20 bg-gradient-to-r">
    <div className="container mx-auto space-y-14">

      <h2 className="text-5xl font-bold text-19baa3 tracking-tighter leading-none mb-6">Why GeoGrind?</h2>

      {/* Session Feature */}
      <div className="flex flex-wrap md:flex-nowrap gap-10 items-center">
        <div className="w-48 h-48 bg-80cdbf flex items-center justify-center text-6xl rounded-full">
          <FontAwesomeIcon icon={faLocationDot} style={{color: "#a0d9da"}} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-80cdbf mb-4">Geo-Located Study Sessions</h3>
          <p className="text-xl leading-relaxed">
            Locate and join study sessions near you. Dive into a beacon of knowledge with every click. Boundaries? What are those?
          </p>
        </div>
      </div>

      {/* Filter Feature */}
      <div className="flex flex-wrap md:flex-nowrap gap-10 items-center">
        <div>
          <h3 className="text-3xl font-bold text-14a768 mb-4">Course-Specific Filtering</h3>
          <p className="text-xl leading-relaxed">
            Tailor your map. Use our course-specific filters. A world of study sessions, all relevant, all in real-time.
          </p>
        </div>
        <div className="w-48 h-48 bg-19baa3 flex items-center justify-center text-6xl rounded-full">
          <FontAwesomeIcon icon={faChalkboard} style={{color: "#19baa3"}} />
        </div>
      </div>

      {/* Real-Time Notification Feature */}
      <div className="flex flex-wrap md:flex-nowrap gap-10 items-center">
        <div className="w-48 h-48 bg-a0d9da flex items-center justify-center text-6xl rounded-full">
          <FontAwesomeIcon icon={faBell} style={{color: "#80cdbf"}} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-a0d9da mb-4">Real-time Notifications</h3>
          <p className="text-xl leading-relaxed">
            Never miss a beat. Stay informed, stay ahead, and most importantly, stay connected.
          </p>
        </div>
      </div>

      {/* Profile Customization Feature */}
      <div className="flex flex-wrap md:flex-nowrap gap-10 items-center">
        <div>
          <h3 className="text-3xl font-bold text-19baa3 mb-4">Customizable Profiles</h3>
          <p className="text-xl leading-relaxed">
            Showcase your academic journey. Let your profile be a testament to your passion for learning.
          </p>
        </div>
        <div className="w-48 h-48 bg-14a768 flex items-center justify-center text-6xl rounded-full">
          <FontAwesomeIcon icon={faCircleUser} style={{color: "#14a768"}} />
        </div>
      </div>

    </div>
  </section>
);

export { PitchDeck };
