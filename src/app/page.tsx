import Navbar from "./Navbar/page";
import "./globals.css";
import Hero from "./hero/page";
import Info from "./info/page";

export default function Home() {
  return (
    <>
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Info />
      {/* Rest of the page content */}
    </div>
    </>
  );
}