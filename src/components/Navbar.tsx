import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-zinc-950/80 to-transparent">
    <Link to="/" className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-red-600 tracking-tight">NETFLIX</span>
      <span className="text-xs text-zinc-400 font-bold">CLONE</span>
    </Link>
    {/* Future nav links go here */}
  </nav>
);

export default Navbar; 