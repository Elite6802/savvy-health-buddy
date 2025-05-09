
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-healthmate-800 pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-healthmate-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-heading font-bold text-xl text-healthmate-700 dark:text-white">
                HealthMate AI
              </span>
            </Link>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
              Your AI-powered health assistant, providing reliable information and guidance for your well-being.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-heading font-semibold text-healthmate-700 dark:text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-heading font-semibold text-healthmate-700 dark:text-white text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-500 dark:text-gray-400 hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-heading font-semibold text-healthmate-700 dark:text-white text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500 dark:text-gray-400">
                <span className="block">Email:</span>
                <a href="mailto:support@healthmateai.com" className="hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  support@healthmateai.com
                </a>
              </li>
              <li className="text-gray-500 dark:text-gray-400">
                <span className="block">Phone:</span>
                <a href="tel:+18005551234" className="hover:text-healthmate-400 dark:hover:text-healthmate-400">
                  +1 (800) 555-1234
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-healthmate-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} HealthMate AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
