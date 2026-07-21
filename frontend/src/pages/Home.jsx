import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[100vh] flex items-center justify-center"
      style={{
        backgroundImage: "url('Images/Bg turg.jpg')",
        backgroundAttachment: "fixed", // Parallax effect
      }}
    >
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Book Your Turf, Anytime, Anywhere 🏏⚽
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Find and book the best turfs for various{" "}
          <span className="font-semibold text-yellow-400">Sports</span> across
          <span className="font-semibold text-yellow-400">
            {" "}
            Metropolitan Cities.
          </span>
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Book Now Button */}
          <Link
            to="/bookings"
            className="bg-yellow-400 text-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Book Now
          </Link>

          {/* Optional: Button */}
          <Link
            to="/my-bookings"
            className="bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            View Bookings
          </Link>
        </div>
      </div>
    </section>
  );
}
