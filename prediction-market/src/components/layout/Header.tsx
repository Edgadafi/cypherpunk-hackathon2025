'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import { clsx } from 'clsx'
import WalletButton from './WalletButton'
import { ThemeToggle } from '../common/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

const Header = () => {
  const { theme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { name: 'Markets', href: '/markets' },
    { name: 'Create Market', href: '/create-market' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Activity', href: '/activity' },
  ]

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        theme === 'dark'
          ? isScrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-gray-800'
            : 'bg-black/60 backdrop-blur-sm'
          : isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-200'
            : 'bg-white/60 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src="/images/prismafi-logo.svg"
                alt="PrismaFi"
                className="h-10 w-auto brightness-100 hover:brightness-110 transition-all"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'transition-colors duration-200 font-medium',
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={clsx(
                  'h-4 w-4',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )} />
              </div>
              <input
                type="text"
                placeholder="Search markets..."
                className={clsx(
                  'block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200',
                  theme === 'dark'
                    ? 'bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500'
                )}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={clsx(
                'transition-colors duration-200',
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={clsx(
              'px-2 pt-2 pb-3 space-y-1 backdrop-blur-md rounded-lg mt-2',
              theme === 'dark'
                ? 'bg-gray-900/95 border border-gray-800'
                : 'bg-white/95 border border-gray-200'
            )}>
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={clsx(
                      'h-4 w-4',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search markets..."
                    className={clsx(
                      'block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                      theme === 'dark'
                        ? 'bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500'
                    )}
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'block px-3 py-2 rounded-lg transition-colors duration-200',
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="px-3 py-2 flex items-center gap-3">
                <ThemeToggle />
                <div className="flex-1">
                  <WalletButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
