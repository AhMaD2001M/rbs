import Image from 'next/image';
import Link from 'next/link'; 


export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-[600px]">
        <Image
          src="/images/hero2.png" // Replace with actual path or static asset
          alt="child learning"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-20">
          <h1 className="text-white text-5xl font-[Pacifico] leading-tight">
          R.B.S SCHOOL SYSTEM  <br /> Knowledge with Character
          </h1>
          <p className="text-white mt-4 max-w-xl text-sm">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before process-centric communities.
          </p>
          <div className="flex gap-96 mt-24" w-ml >
          <Link href="/auth/login">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-4 rounded-full text-sm font-semibold">
                Sign up now
              </button>
          </Link>
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full text-sm font-semibold">Our Programmes</button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-full text-sm font-semibold">Our Classes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
