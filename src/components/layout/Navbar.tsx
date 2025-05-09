
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // For demo purposes only, would be replaced with actual auth state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("healthmate-token");
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("healthmate-token");
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    // Would be replaced with actual auth logout
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? "bg-white dark:bg-healthmate-700 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-healthmate-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-heading font-bold text-xl text-healthmate-700 dark:text-white">
              HealthMate AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === "/"
                  ? "text-healthmate-400"
                  : "text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
              }`}
            >
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/services"
                  className={`text-sm font-medium ${
                    location.pathname === "/services"
                      ? "text-healthmate-400"
                      : "text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/chat"
                  className={`text-sm font-medium ${
                    location.pathname === "/chat"
                      ? "text-healthmate-400"
                      : "text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
                  }`}
                >
                  Chat
                </Link>
              </>
            )}
            <Link
              to="/help"
              className={`text-sm font-medium ${
                location.pathname === "/help"
                  ? "text-healthmate-400"
                  : "text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
              }`}
            >
              Help
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    My Profile
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 dark:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isOpen ? "block" : "hidden"
          } pt-4 pb-2 space-y-4`}
        >
          <Link
            to="/"
            className="block text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
            onClick={toggleMenu}
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/services"
                className="block text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                to="/chat"
                className="block text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
                onClick={toggleMenu}
              >
                Chat
              </Link>
            </>
          )}
          <Link
            to="/help"
            className="block text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-healthmate-400 dark:hover:text-healthmate-400"
            onClick={toggleMenu}
          >
            Help
          </Link>
          <div className="pt-2 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="block"
                  onClick={toggleMenu}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    My Profile
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block"
                  onClick={toggleMenu}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="block"
                  onClick={toggleMenu}
                >
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
