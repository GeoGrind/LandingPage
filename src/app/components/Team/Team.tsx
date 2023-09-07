import Image from "next/image";
import teamMembers from "./teamMembers";
import styles from "./Team.module.scss";
const Team = () => {
  return (
    <section className={styles.Team}>
      <h2 className="text-4xl font-semibold mb-6 text-center">Meet the Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
        {teamMembers.map((member) => (
          <div key={member.name} className={styles.Team__member}>
            <Image
              src={member.image}
              alt={member.name}
              className={styles.Team__member__image}
            />
            <div className={styles.Team__member__content}>
              <div className={styles.Team__member__content__name}>
                {member.name}
              </div>
              <div className={styles.Team__member__content__headline}>
                {member.headline}
              </div>
              <div className={styles.Team__member__content__links}>
                {Object.entries(member.links).map((link) => {
                  return (
                    <a
                      key={link[0]}
                      href={link[1]}
                      target="_blank"
                      rel="noopener no referrer"
                      className={styles.Team__member__content__links__link}
                    >
                      {link[0]}
                    </a>
                  );
                })}
              </div>
              <div className={styles.Team__member__content__description}>
                {member.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Team };
