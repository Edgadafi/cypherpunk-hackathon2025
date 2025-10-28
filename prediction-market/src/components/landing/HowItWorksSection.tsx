'use client';

import { Wallet, Search, TrendingUp, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Connect your Wallet',
    description: 'Phantom, Solflare or any Solana wallet',
    time: '10 seconds',
    action: 'One click. No registration. No KYC.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    number: '02',
    icon: Search,
    title: 'Predict or Create',
    description: 'Find existing markets or create your own',
    time: '2 minutes',
    action: 'Thousands of markets on politics, crypto, sports, economy.',
    color: 'from-pink-500 to-purple-500'
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Win and Withdraw',
    description: 'Automatic on-chain resolution, withdraw instantly',
    time: '24 hours',
    action: 'No waits. No verifications. Your funds, always available.',
    color: 'from-purple-500 to-blue-500'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="text-sm text-purple-300 font-medium">Simple and Fast</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              From Zero to Predicting in 3 Steps
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            You don&apos;t need to be an expert. Start predicting and earning in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform -translate-y-1/2 opacity-20"></div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-2xl p-8 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                    {/* Number Badge */}
                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>

                      {/* Icon */}
                      <div className="absolute -top-2 -right-2 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 mb-4">
                      {step.description}
                    </p>

                    {/* Time Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">{step.time}</span>
                    </div>

                    {/* Action */}
                    <p className="text-gray-300 text-sm">
                      {step.action}
                    </p>

                    {/* Hover Border Gradient */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20`}></div>
                    </div>
                  </div>

                  {/* Arrow (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-gray-900 border-2 border-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="text-3xl font-bold text-white mb-2">10s</div>
            <div className="text-sm text-gray-400">Setup Time</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="text-3xl font-bold text-white mb-2">$5</div>
            <div className="text-sm text-gray-400">Minimum to Start</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="text-3xl font-bold text-white mb-2">24h</div>
            <div className="text-sm text-gray-400">Average Resolution</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-sm text-gray-400">Withdrawal Fees</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => window.location.href = '/markets'}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 cursor-pointer"
          >
            Start Now - It&apos;s Free →
          </button>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required. Just your wallet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
