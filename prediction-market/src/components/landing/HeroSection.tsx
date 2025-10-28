'use client';

import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background - Updated with Official Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-[#8B5CF6]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Floating Elements - Updated with Official Colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00F0FF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF0080]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#FF7A2F]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge - Updated with Official Colors */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7A2F]/10 border border-[#FF7A2F]/30 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-[#FF7A2F]" />
            <span className="text-sm text-[#FF7A2F] font-semibold tracking-wide">
              CYPHERPUNK HACKATHON • SOLANA
            </span>
          </div>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/images/prismafi-logo.png" 
              alt="PrismaFi" 
              className="h-72 w-auto"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Building Transparent Prediction Markets for Social Impact Across LATAM.
            </span>
            <br />
            <span className="text-gray-400 text-2xl sm:text-3xl lg:text-4xl">
              Turn accountability into a public good. Let on-chain truth decide.
            </span>
          </h1>

          {/* Problem Statement */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
            Political promises, public projects, and institutional commitments{' '}
            <span className="text-[#FF0080] font-bold">lack transparent tracking</span>.
          </p>

          {/* Solution Statement */}
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Create <span className="font-bold text-[#00F0FF]">YES/NO markets</span> on promises and outcomes.
            {' '}Community bets → Evidence decides → Accountability enforced.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">$2.4M</div>
              <div className="text-sm text-gray-400">Verified Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">4,237</div>
              <div className="text-sm text-gray-400">Predictions Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">99.8%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* CTAs - Updated with Official Gradient */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/create-market"
              className="group px-8 py-4 bg-gradient-to-r from-[#00F0FF] via-[#FF0080] to-[#FF7A2F] hover:opacity-90 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#00F0FF]/50 flex items-center gap-2"
            >
              <span>Create Market</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/markets"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-[#00F0FF]/30 hover:border-[#00F0FF]/50 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Browse Markets</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Audited by Certora</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Powered by Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">$2.4M+ in volume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default HeroSection;
