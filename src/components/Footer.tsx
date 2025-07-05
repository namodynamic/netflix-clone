import { footerLinks } from "../data/mockData"
import { FaXTwitter, FaYoutube, FaSquareInstagram, FaFacebookF  } from "react-icons/fa6";

const Footer = () => {

  return (
    <footer className="bg-zinc-950 text-gray-400 py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 mb-8">
          <a href="#" className="text-white transition-colors" aria-label="Facebook">
            <FaFacebookF size={24} />
          </a>
          <a href="#" className="text-white transition-colors" aria-label="Instagram">
            <FaSquareInstagram size={24} />
          </a>
          <a href="#" className="text-white transition-colors" aria-label="Twitter">
            <FaXTwitter size={24} />
          </a>
          <a href="#" className="text-white transition-colors" aria-label="YouTube">
            <FaYoutube size={24} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerLinks.map((section) => (
            <div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm hover:text-white hover:underline transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <button className="border border-gray-600 px-4 py-2 text-sm hover:border-white transition-colors">
            Service Code
          </button>
        </div>

        <div className="text-sm text-gray-500">
          <p>&copy; 1997-{new Date().getFullYear()} Netflix, Inc.</p>
          <p className="mt-2">
            This is a clone project for educational purposes only. Not affiliated with Netflix, Inc.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
