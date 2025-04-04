import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  X
} from "lucide-react";


interface HeaderProps {
  onSearch: (term: string) => void;
  searchTerm?: string;
}

export function Header({ onSearch, searchTerm = "" }: HeaderProps) {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm);
  const [language, setLanguage] = useState<"EN" | "NG">("EN");

  // Check for dark mode preference
  useEffect(() => {
    const prefersDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newState = !prev;
      if (newState) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      }
      return newState;
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(currentSearchTerm);
  };

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-primary-800 dark:text-primary-500">
              <Newspaper className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800 dark:text-white">
                CrimeWatch <span className="text-primary-700 dark:text-primary-500">News</span>
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Global Crime News Aggregator</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                value={currentSearchTerm}
                onChange={(e) => setCurrentSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
            </form>
            
            <Button
              variant="ghost"
              size="icon"
              className="bg-neutral-200 p-2 rounded-full dark:bg-neutral-700"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-neutral-500" />}
            </Button>
            
            <div className="flex space-x-1">
              <span className={`px-3 py-1 rounded-md text-sm font-medium ${language === "EN" ? "bg-primary-700 text-white" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"}`}>
                EN
              </span>
              <Button
                variant="ghost"
                className={`px-3 py-1 rounded-md text-sm font-medium ${language === "NG" ? "bg-primary-700 text-white" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"}`}
                onClick={() => setLanguage(language === "EN" ? "NG" : "EN")}
              >
                NG
              </Button>
            </div>
          </div>
          
          <button 
            type="button" 
            className="md:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-800 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  value={currentSearchTerm}
                  onChange={(e) => setCurrentSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
              </form>
            </div>
            <div className="flex justify-between px-3 py-2">
              <div className="flex space-x-1">
                <span className={`px-3 py-1 rounded-md text-sm font-medium ${language === "EN" ? "bg-primary-700 text-white" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"}`}>
                  EN
                </span>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 rounded-md text-sm font-medium ${language === "NG" ? "bg-primary-700 text-white" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"}`}
                  onClick={() => setLanguage(language === "EN" ? "NG" : "EN")}
                >
                  NG
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-neutral-200 p-2 rounded-full dark:bg-neutral-700"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-yellow-300" /> : <Moon className="h-4 w-4 text-neutral-500" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
