import Image from 'next/image';

export default function LatestNews() {
  return (
    <section className="px-4 md:px-20 py-16 bg-white">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-purple-700 mb-4 font-cursive">
          Latest News
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded overflow-hidden shadow-md">
          <Image 
            src="/images/craft.jpg"
            alt="Making crafts"
            width={500}
            height={300}
            className="w-full h-60 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">January 16, 2017  &nbsp;&nbsp; | &nbsp;&nbsp; BY BOLDTHEMES</p>
            <h3 className="font-cursive text-xl text-gray-800">Making your own crafts</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded overflow-hidden shadow-md">
          <Image 
            src="/images/learning.jpg"
            alt="Learning basics"
            width={500}
            height={300}
            className="w-full h-60 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">January 16, 2017  &nbsp;&nbsp; | &nbsp;&nbsp; BY BOLDTHEMES</p>
            <h3 className="font-cursive text-xl text-gray-800">Learning IT basics</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded overflow-hidden shadow-md">
          <Image 
            src="/images/friends.jpg"
            alt="Making friends"
            width={500}
            height={300}
            className="w-full h-60 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">January 16, 2017  &nbsp;&nbsp; | &nbsp;&nbsp; BY BOLDTHEMES</p>
            <h3 className="font-cursive text-xl text-gray-800">Making friends</h3>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
          Read more news
        </button>
      </div>
    </section>
  );
}