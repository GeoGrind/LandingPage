import Image from "next/image";
import teamMembers from "./teamMembers";
import styles from "./Team.module.scss";
const Team = () => (
  // <section className="mx-6 py-20">
  <section className={styles.Team}>
    <h2 className="text-4xl font-semibold mb-6 text-center">Meet the Team</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
      {teamMembers.map((member) => (
        // <div key={member.name} className="flex flex-row items-center space-y-2">
        <div key={member.name} className="flex flex-row items-center space-y-2">
          <Image
            src={member.img}
            alt={member.name}
            className="rounded-full"
            width={200}
            height={200}
          />
          <div className="text-left">
            <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
            <p>{member.headline}</p>
            <p>{member.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export { Team };
