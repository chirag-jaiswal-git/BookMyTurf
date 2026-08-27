import React from "react";
import { Link } from "react-router-dom";
import { Users, Trophy, MapPin, Target, Zap, Heart, ArrowRight, PlayCircle } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 overflow-hidden bg-emerald-700">
        {/* Abstract Shapes for Sporty Feel */}
        
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 mb-8">
                <Trophy size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Our Story</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                We Are <span className="text-gray-900 bg-clip-text bg-gradient-to-r ">BookMyturf</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
                Bridging the gap between passion and the pitch. We are revolutionizing how India plays sports.
            </p>

            <div className="mt-10 flex justify-center gap-4">
                 <Link to="/bookings" className="flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold hover:bg-emerald-100 transition shadow-lg ">
                    Get Started <ArrowRight size={18}/>
                 </Link>
            </div>
        </div>
      </section>

      {/* --- MISSION SECTION (Split Layout) --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Image Composition */}
            <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                    <img 
                        src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" 
                        alt="Soccer Player" 
                        className="rounded-2xl shadow-xl transform translate-y-8 object-cover h-72 w-full border-4 border-white"
                    />
                    <img 
                        src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop" 
                        alt="Cricket Turf" 
                        className="rounded-2xl shadow-xl object-cover h-72 w-full border-4 border-white"
                    />
                </div>
                {/* Floating Stats Card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 text-center w-48 animate-bounce-slow">
                    <span className="block text-4xl font-black text-emerald-600">10k+</span>
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wide">Matches Hosted</span>
                </div>
            </div>

            {/* Typography */}
            <div>
                <h2 className="text-4xl font-extrabold mb-6 text-gray-900 leading-tight">
                    Built by Athletes, <br/>
                    <span className="relative inline-block">
                        For Athletes.
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-emerald-200 -z-10 opacity-60"></span>
                    </span>
                </h2>
                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                    <p>
                        It started with a simple frustration: calling ten different venues just to find one available slot for a Sunday match. We knew there had to be a better way.
                    </p>
                    <p>
                        <span className="font-bold text-emerald-700">BookMyturf</span> eliminates the hassle. We provide a seamless, real-time booking experience that lets you focus on what matters most—the game.
                    </p>
                </div>
                
                {/* Stats Row */}
                <div className="mt-10 grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                    <div>
                        <span className="block text-3xl font-bold text-gray-900">50+</span>
                        <span className="text-sm text-gray-500 font-bold uppercase">Venues</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-bold text-gray-900">24/7</span>
                        <span className="text-sm text-gray-500 font-bold uppercase">Support</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-bold text-gray-900">4.8</span>
                        <span className="text-sm text-gray-500 font-bold uppercase">Rating</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- VALUES SECTION (Green Background done right) --- */}
      <section className="py-24 bg-emerald-900 relative overflow-hidden">
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-white">Why Choose Us?</h2>
                <p className="text-emerald-200 mt-4 text-lg">More than just a booking platform. We are a community.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition duration-300">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-900/50">
                        <Zap size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Instant Access</h3>
                    <p className="text-emerald-100/80 leading-relaxed">
                        Real-time availability checking. No phone calls, no waiting. Secure your slot in just 3 clicks.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition duration-300">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-900/50">
                        <Target size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Premium Quality</h3>
                    <p className="text-emerald-100/80 leading-relaxed">
                        We verify every turf listed. FIFA-standard grass, proper floodlights, and clean amenities guaranteed.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition duration-300">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-900/50">
                        <Users size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Community</h3>
                    <p className="text-emerald-100/80 leading-relaxed">
                        Join tournaments, find local teams, and connect with other players in your city easily.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gray-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-gray-100 shadow-2xl">
            {/* Subtle Gradient Blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                    Ready to Play?
                </h2>
                <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto font-medium">
                    Don't let the game wait. Find the perfect turf near you and kick off your next match today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/bookings" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        Book Now <PlayCircle size={20} />
                    </Link>
                    <Link 
                        to="/contact" 
                        className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-10 rounded-xl border border-gray-200 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}