import Image from 'next/image';
import teamMembers from './teamMembers';

const Team = () => (
    <section className="mx-6 py-20">
        <h2 className="text-4xl font-semibold mb-6 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
                <div key={member.name} className="flex flex-col items-center space-y-2">
                  <Image
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 rounded-full"
                  />
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                    <p>Co-founder</p>
                  </div>
                </div>
            
            ))}
        </div>
    </section>
);

export { Team };
