import Navbar from "./Navbar/page";
import "./globals.css";
import Hero from "./hero/page";
import Info from "./info/page";
import Join from "./timeToJoin/page";
import PreProgram from "./preProgram/page";

export default function Home() {
  return (
    <>
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Info />
      <Join />
      <PreProgram />
      {/* Add more sections as needed */}
      {/* Rest of the page content */}
      {/* Add more sections as needed */}
      {/* Rest of the page content */}
    </div>
    </>
  );
}