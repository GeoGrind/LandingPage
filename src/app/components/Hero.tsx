const Hero = () => (
    <div className="bg-gradient-to-r from-b0d9ac to-c5dc62 text-center py-20">
      <h1 className="text-8xl font-bold mb-6">GeoGrind</h1>
      <p className="text-xl mb-10">[Your Catchphrase Here]</p>
      <img src="../assets/geogrind_logo.png" />
      <div className="flex space-x-4">
        <button className="bg-efdace px-6 py-3 rounded-md hover:bg-ebaf86 transition">Download for Windows</button>
        <button className="bg-eebda1 px-6 py-3 rounded-md hover:bg-f3995e transition">Download on the App Store</button>
        <button className="bg-efdace px-6 py-3 rounded-md hover:bg-ebaf86 transition">Get it on Google Play</button>
        <button className="bg-eebda1 px-6 py-3 rounded-md hover:bg-f3995e transition">Open GeoGrind in your browser</button>
      </div>
    </div>
)

export { Hero }
