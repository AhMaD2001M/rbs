'use client';
import React, { useEffect, useState } from 'react';

const CountdownTimer: React.FC = () => {
  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  // Calculate the target date dynamically (30 days from now)
  const calculateTargetDate = (): Date => {
    const now = new Date();
    now.setDate(now.getDate() + 30); // Add 30 days to the current date
    return now;
  };

  const [targetDate, setTargetDate] = useState(calculateTargetDate());

  const calculateTimeLeft = React.useCallback((): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // Reset the target date when the countdown reaches zero
      setTargetDate(calculateTargetDate());
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, targetDate, calculateTimeLeft]);

  return (
    <div className="text-4xl font-mono text-white tracking-widest mb-4">
      {`${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
    </div>
  );
};

const SignupSection = () => {
  return (
    <div
      className="relative w-full bg-cover bg-center text-white px-4 py-12 md:py-20"
      style={{
        backgroundImage: `url('/images/hero1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-cursive mb-4">Time to sign up</h2>
        <p className="max-w-xl mx-auto mb-6 text-gray-300">
          Podcasting operational change management inside of workflows to establish a framework. Taking seamless key performance indicators offline to maximise the long tail.
        </p>
        <CountdownTimer />

        <div className="grid md:grid-cols-3 gap-8 mt-10 border-t border-gray-500 pt-10">
          <div>
            <h3 className="text-purple-300 font-cursive text-2xl mb-2">Signing up</h3>
            <p className="text-gray-300 mb-4">
              Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas.
            </p>
            <a href="/signup" className="inline-block px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 transition">Sign up now</a>
          </div>

          <div>
            <h3 className="text-pink-400 font-cursive text-2xl mb-2">Check the programme</h3>
            <p className="text-gray-300 mb-4">
              Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved.
            </p>
            <a href="/programme" className="inline-block px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition">View programme</a>
          </div>

          <div>
            <h3 className="text-cyan-300 font-cursive text-2xl mb-2">Which classes?</h3>
            <p className="text-gray-300 mb-4">
              Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits.
            </p>
            <a href="/classes" className="inline-block px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 transition">Our classes</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSection;
