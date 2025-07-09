"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, User, ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
  selectedProfile?: string | null;
  onProfileSwitch?: () => void;
}

const profileMap = {
  profile1: { name: "Profile 1", color: "bg-blue-500" },
  family: { name: "Family", color: "bg-red-500" },
  profile3: { name: "Profile 3", color: "bg-teal-600" },
  profile4: { name: "Profile 4", color: "bg-yellow-500" },
  profile5: { name: "Profile 5", color: "bg-pink-500" },
} as const;

type ProfileKey = keyof typeof profileMap;

const Header = ({ selectedProfile, onProfileSwitch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const queryParam = params.get("q") || "";
      setSearchQuery(queryParam);
      if (queryParam || location.pathname === "/search") {
        setIsSearchOpen(true);
      }
    } else {
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  }, [location]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
      if (
        !target.closest(".search-container") &&
        !target.closest(".search-button")
      ) {
        if (location.pathname !== "/search") {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [location.pathname]);

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && location.pathname !== "/search") {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else if (value.trim() && location.pathname === "/search") {
      navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
    } else if (!value.trim() && location.pathname === "/search") {
      navigate("/search", { replace: true });
    }
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tv-shows", label: "TV Shows" },
    { path: "/movies", label: "Movies" },
    { path: "/my-list", label: "My List" },
  ];

  const profile = selectedProfile
    ? profileMap[selectedProfile as ProfileKey]
    : null;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-black/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 min-w-0">
          <div className="flex items-center space-x-4 min-w-0 flex-shrink">
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsSearchOpen(false);
                setIsProfileOpen(false);
              }}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transition-all duration-200 ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transition-all duration-200 ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl lg:text-3xl font-black text-red-600 tracking-tight group-hover:text-red-500 transition-colors">
                NETFLIX
              </span>
              <span className="text-xs text-zinc-400 hidden sm:block font-bold opacity-60">
                CLONE
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1 ml-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? "text-white bg-red-600/20 border border-red-600/30"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2 min-w-0 flex-wrap flex-shrink-0">
            <div className="relative search-container">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      placeholder="Search movies, TV shows..."
                      className="bg-zinc-900 border border-white/30 rounded-lg px-3 py-2 pr-8 text-sm w-52 sm:w-64 lg:w-80 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-all duration-200"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="search-button p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-black"></span>
            </button>

            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                  <User size={16} className="text-white" />
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden sm:block transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl transition-all duration-200 ${
                  isProfileOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-700/50">
                    {selectedProfile && profile && (
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-10 h-10 ${profile.color} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {profile.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Active Profile
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onProfileSwitch}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Switch Profiles
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    Manage Profiles
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    Account Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    Help Center
                  </button>
                  <div className="border-t border-gray-700/50 mt-2 pt-2">
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                      Sign out of Netflix
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-md border-t border-gray-800/50">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? "text-white bg-red-600 shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
