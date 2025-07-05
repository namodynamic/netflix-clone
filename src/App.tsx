'use client'

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


function App() {
  return (
    <MyListProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
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