'use client'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import TVShows from "./pages/TVShows";
import Movies from "./pages/Movies";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import Header from "./components/Header";
import { useState } from "react";
import TVShowDetail from "./pages/TVShowDetail";


function App() {
 const [searchQuery, setSearchQuery] = useState("")

  return (
    <Router>
      <div className="bg-zinc-900 min-h-screen">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<TVShowDetail />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/search" element={<Search searchQuery={searchQuery} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 