import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} CrimeWatch News Aggregator. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <div
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 text-sm cursor-pointer"
              onClick={() => window.location.href = '/privacy'}
            >
              Privacy Policy
            </div>
            <div
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 text-sm cursor-pointer"
              onClick={() => window.location.href = '/terms'}
            >
              Terms of Service
            </div>
            <div
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 text-sm cursor-pointer"
              onClick={() => window.location.href = '/about'}
            >
              About
            </div>
            <div
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 text-sm cursor-pointer"
              onClick={() => window.location.href = '/contact'}
            >
              Contact
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
