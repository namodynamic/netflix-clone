"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, User, ChevronDown } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("/search")
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center space-x-8">
           <Link to="/" className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-red-600 tracking-tight">NETFLIX</span>
      <span className="text-xs text-zinc-800 font-bold">CLONE</span>
    </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/tv-shows" className="hover:text-gray-300 transition-colors">
              TV Shows
            </Link>
            <Link to="/movies" className="hover:text-gray-300 transition-colors">
              Movies
            </Link>
            <Link to="/my-list" className="hover:text-gray-300 transition-colors">
              My List
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows..."
                  className="bg-black/70 border border-white/30 rounded px-3 py-1 text-sm w-64"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:text-gray-300 transition-colors">
                <Search size={20} />
              </button>
            )}
          </div>

          <button className="p-2 hover:text-gray-300 transition-colors">
            <Bell size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
            >
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <User size={16} />
              </div>
              <ChevronDown size={16} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-700 rounded shadow-lg">
                <div className="py-2">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-800">Account</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-800">Settings</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-800">Sign out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
