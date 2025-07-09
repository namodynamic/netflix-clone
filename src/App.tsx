"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import TVShows from "./pages/TVShows";
import Movies from "./pages/Movies";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import Header from "./components/Header";
import TVShowDetail from "./pages/TVShowDetail";
import { MyListProvider } from "./contexts/MyListContext";
import Footer from "./components/Footer";
import { useLayoutEffect, useState } from "react";
import ProfileSelection from "./components/ProfileSelection";
import NetflixLogoAnimation from "./components/NetflixLogoAnimation";

type AppState = "loading" | "profile-selection" | "main-app";

function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  useLayoutEffect(() => {
    const savedProfile = localStorage.getItem("netflix-selected-profile");

    if (savedProfile) {
      setSelectedProfile(savedProfile);
      setAppState("main-app");
    } else {
      setAppState("loading");
    }
  }, []);

  const handleLogoAnimationComplete = () => {
    setAppState("profile-selection");
  };

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    localStorage.setItem("netflix-selected-profile", profileId);
    setAppState("main-app");
  };

  const handleProfileSwitch = () => {
    setAppState("profile-selection");
    setSelectedProfile(null);
    localStorage.removeItem("netflix-selected-profile");
  };

  if (appState === "loading") {
    return (
      <NetflixLogoAnimation onAnimationComplete={handleLogoAnimationComplete} />
    );
  }

  if (appState === "profile-selection") {
    return <ProfileSelection onProfileSelect={handleProfileSelect} />;
  }

  return (
    <MyListProvider>
      <Router>
        <div className="min-h-screen">
          <Header
            selectedProfile={selectedProfile}
            onProfileSwitch={handleProfileSwitch}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVShowDetail />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/search" element={<Search />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </MyListProvider>
  );
}

export default App;
