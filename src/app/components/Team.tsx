const Team = () => (
  <section className="px-6 py-20">
    <h2 className="text-4xl font-semibold mb-6">Meet the Team</h2>
    <div className="flex">
      <img
        src="../assets/geogrind_logo.png"
        alt="John Doe"
        className="w-32 h-32 rounded-full mr-6"
      />
      <div>
        <h3 className="text-2xl font-semibold mb-2">John Doe</h3>
        <p>Co-founder & CEO</p>
      </div>
    </div>
  </section>
);

export { Team };
