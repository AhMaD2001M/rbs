import React from 'react';
import { Calculator, Dumbbell, Palette, MonitorSmartphone } from 'lucide-react';

const programs = [
  {
    icon: <Calculator size={48} className="text-sky-500" />,
    title: 'Maths',
    description: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps.',
    link: ''
  },
  {
    icon: <Dumbbell size={48} className="text-pink-600" />,
    title: 'Sports',
    description: 'Podcasting operational change management inside of workflows to establish a framework. Taking seamless key performance indicators offline to maximise tail.',
    link: 'auth/signup'
  },
  {
    icon: <Palette size={48} className="text-purple-600" />,
    title: 'Arts',
    description: 'Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits.',
    link: '#'
  },
  {
    icon: <MonitorSmartphone size={48} className="text-blue-700" />,
    title: 'Computers',
    description: 'Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas.',
    link: '#computers'
  }
];

const PreschoolPrograms = () => {
  return (
    <section
      className="w-full px-4 py-16 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/geometric-bg.png')",
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 font-[Pacifico]">Preschool Programs</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-12">
          Podcasting operational change management inside of workflows to establish a framework. Taking seamless key performance indicators offline to maximise the long tail.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-white bg-opacity-70 p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
              <div className="mb-4">{program.icon}</div>
              <h3 className={`text-2xl font-bold mb-2 ${
                program.title === 'Maths' ? 'text-sky-500' :
                program.title === 'Sports' ? 'text-pink-600' :
                program.title === 'Arts' ? 'text-purple-600' :
                'text-blue-700'}`
              }>{program.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{program.description}</p>
              <a
                href={program.link}
                className={`px-5 py-2 rounded-full border transition-colors duration-300 font-semibold text-sm ${
                  program.title === 'Maths' ? 'border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white' :
                  program.title === 'Sports' ? 'border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white' :
                  program.title === 'Arts' ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white' :
                  'border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white'}
              `}
              >
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreschoolPrograms;
