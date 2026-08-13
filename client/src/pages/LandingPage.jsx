import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPORTS_LIST } from "../constants/sports";
import ArenovaLogo from "../components/common/ArenovaLogo";
import { Trophy, Calendar, Dumbbell, ShieldCheck, ArrowRight, MapPin, Users, Star, Compass, Zap, Sparkles } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#08060d] font-sans antialiased selection:bg-[#1D9E75]/20 selection:text-[#1D9E75]">
      {/* ─── NAVBAR ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#08060d]/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => navigate("/")}>
            <ArenovaLogo theme="dark" height={46} />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#sports" className="hover:text-white transition-colors">Sports</a>
            <a href="#venues" className="hover:text-white transition-colors">Venues</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1D9E75] to-[#185FA5] hover:opacity-95 shadow-md shadow-[#1D9E75]/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              Get Started <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#08060d] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#1D9E75]/20 to-[#534AB7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#185FA5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#1D9E75] mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-[#1D9E75]" />
            <span>Next-Gen Sports Venue & Rental Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Book Sports Courts & Rent Equipment <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1D9E75] via-[#38BDF8] to-[#534AB7]">Instantly</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Discover verified sports arenas near you, reserve time slots in real-time, add equipment rentals, and pay securely via Razorpay.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-[#1D9E75] hover:bg-[#157a5a] shadow-xl shadow-[#1D9E75]/25 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>🏸 Book a Court Now</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-gray-200 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🏟️ Register Arena / Club</span>
            </button>
          </div>

          {/* Stats Banner */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">50+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Verified Arenas</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1D9E75]">1,000+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Daily Slots</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#38BDF8]">50,000+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Active Players</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B]">4.9 ★</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPORTS SHOWCASE ───────────────────────────────────────────────────── */}
      <section id="sports" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D9E75] bg-[#E1F5EE] px-3 py-1 rounded-full">
            Supported Sports
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08060d] mt-3">
            Whatever You Play, We Have Courts
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Select from high-quality wooden badminton courts, synthetic turf grounds, floodlit cricket nets, table tennis tables, and pickleball arenas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SPORTS_LIST.map((sport) => (
            <div
              key={sport.id}
              onClick={() => navigate("/login")}
              className="bg-white border border-[#f0ede6] rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{sport.icon}</div>
              <h3 className="font-bold text-base text-[#08060d] m-0">{sport.name}</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">Book & Rent</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── KEY FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-[#faf9f6] border-y border-[#f0ede6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#534AB7] bg-[#EEEDFE] px-3 py-1 rounded-full">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08060d] mt-3">
              Built for Players, Owners & Arena Managers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="text-[#1D9E75]" size={28} />}
              bg="#E1F5EE"
              title="Real-Time Slot Booking"
              description="View live 60-minute time slots across all arenas with instant status updates and zero double bookings."
            />
            <FeatureCard
              icon={<Dumbbell className="text-[#534AB7]" size={28} />}
              bg="#EEEDFE"
              title="Equipment Add-on Rentals"
              description="Add rackets, bats, shin guards, and shuttlecocks directly to your court booking with clear pricing."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-[#185FA5]" size={28} />}
              bg="#E6F1FB"
              title="Razorpay Payment & QR Pass"
              description="Secure instant checkout with Razorpay and automatic digital QR code pass generation for seamless entry."
            />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#BA7517] bg-[#FAEEDA] px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08060d] mt-3">
            How Arenova Works
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard step="1" title="Discover Arenas" desc="Search nearby clubs by location keyword or sports category." />
          <StepCard step="2" title="Select Date & Slot" desc="Pick your preferred date from the 14-day rolling calendar." />
          <StepCard step="3" title="Add Gear (Optional)" desc="Add rackets, bats, or balls needed for your match." />
          <StepCard step="4" title="Pay & Play" desc="Checkout securely via Razorpay and present your QR code pass." />
        </div>
      </section>

      {/* ─── BANNER CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#08060d] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black">
            Ready to Play Your Next Match?
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of sports enthusiasts booking courts and playing daily on Arenova.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-xl text-base font-bold text-white bg-[#1D9E75] hover:bg-[#157a5a] shadow-xl shadow-[#1D9E75]/30 transition-all cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#050409] text-gray-400 py-12 border-t border-white/10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <ArenovaLogo theme="dark" height={38} />
          </div>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#sports" className="hover:text-white">Sports</a>
            <a href="#venues" className="hover:text-white">Venues</a>
            <a href="/login" className="hover:text-white">Sign In</a>
          </div>
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} Arenova Sports Ecosystem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, bg, title, description }) {
  return (
    <div className="bg-white border border-[#f0ede6] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: bg }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#08060d] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed m-0">{description}</p>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="bg-white border border-[#f0ede6] rounded-2xl p-6 relative">
      <span className="w-8 h-8 rounded-full bg-[#1D9E75] text-white font-extrabold text-sm flex items-center justify-center mb-4">
        {step}
      </span>
      <h4 className="font-bold text-lg text-[#08060d] mb-1">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed m-0">{desc}</p>
    </div>
  );
}
