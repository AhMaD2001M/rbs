import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';


export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center px-10 py-2 text-sm bg-white border-b">
        <div className="flex gap-6 text-gray-700">
          <div className="flex items-center gap-8">
            <span className="font-bold">EMAIL US:</span>
            <a href="ahmadaslam2001m@gmail.com" className="hover:underline">RBSoffice@edu.pk</a>
          </div>
          <div className="flex ml-20px mr-20px items-center gap-2">
            <span className="font-bold">CALL US:</span>
            <span>0343 0480297</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <span>Visit us on social networks</span>
          <FaFacebookF className="text-blue-600 cursor-pointer" />
          <FaInstagram className="text-pink-500 cursor-pointer" />
          <FaTwitter className="text-purple-500 cursor-pointer" />
          <FaPinterestP className="text-blue-700 cursor-pointer" />
        </div>
      </div>

      {/* Logo and Nav */}
      <div className="flex items-center  justify-between px-10 py-4 shadow-sm">
        <div className="text-4xl font-bold">
          <span className="text-[#d43790]">R</span>
          <span className="text-[#4a90e2]">B</span>
          <span className="text-[#8dc63f]">S</span>
          <span className="ml-2 text-gray-700 font-normal">Preschool</span>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-800">
          <span className="text-[#00bff3] border-b-2 border-[#00bff3] pb-1">HOME</span>
          <span>ABOUT US</span>
          <span>SPORTS</span>
          <span>COACHES</span>
          <span>EVENTS</span>
          <span>PROJECTS</span>
          <span>NEWS</span>
          <span>SHOP</span>
        </div>
      </div>
      </div>    
  )
}