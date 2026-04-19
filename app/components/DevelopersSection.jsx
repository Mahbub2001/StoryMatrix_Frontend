const developers = [
  {
    name: "Mahbub Ahmed Turza",
    role: "Undergrad Student, Computer Science & Engineering (CSE)",
    bio: "Developer of StoryMatrix-4D. North South University (NSU). Email: mahbub.turza@northsouth.edu",
    image: "/team/dev-1.svg",
    skills: [],
  },
  {
    name: "Tonmoy Biswas",
    role: "Undergrad Student, Computer Science & Engineering (CSE)",
    bio: "Developer of StoryMatrix-4D. North South University (NSU). Email: tonmoy.biswas@northsouth.edu",
    image: "/team/dev-3.svg",
    skills: [],
  },
  {
    name: "Tanvir Ahammed Roudra",
    role: "Undergrad Student, Computer Science & Engineering (CSE)",
    bio: "Developer of StoryMatrix-4D. North South University (NSU). Email: tanvir.ahmed24@northsouth.edu",
    image: "/team/dev-2.svg",
    skills: [],
  },
];

export default function DevelopersSection() {
  return (
    <section
      id="developers"
      className="relative py-16 sm:py-20 dark:bg-dark-800 bg-gray-50 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-9 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-sm text-neon-blue font-body mb-4">
            👨‍💻 Team
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-3">
            Meet the <span className="gradient-text">Authors</span>
          </h2>
          <p className="dark:text-white/50 text-gray-600 max-w-2xl mx-auto font-body text-sm sm:text-base">
            Supervisor: Professor Dr. Shafin Rahman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {developers.map((dev, idx) => (
            <article
              key={dev.name}
              className="glass-card rounded-2xl overflow-hidden border border-neon-purple/20 hover:border-neon-blue/40 transition-all duration-300"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div className="relative">
                <img
                  src={dev.image}
                  alt={`${dev.name} placeholder photo`}
                  className="w-full h-52 sm:h-56 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-mono bg-black/30 text-white border border-white/20">
                  Author Photo
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <div>
                  <h3 className="font-display text-lg font-semibold dark:text-white text-gray-900">
                    {dev.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neon-blue font-body mt-0.5">
                    {dev.role}
                  </p>
                </div>

                <p className="dark:text-white/60 text-gray-600 text-sm font-body leading-relaxed">
                  {dev.bio}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {dev.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-full text-xs border border-neon-purple/20 bg-neon-purple/5 dark:text-white/60 text-gray-700 font-body"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
