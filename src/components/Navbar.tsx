import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Highlights', href: '#highlights' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    
    // Close mobile menu immediately to trigger collapse transition
    setIsOpen(false);
    
    const targetId = href.substring(1);
    
    // Defer scroll animation slightly to wait for menu height collapse and prevent layout jumping
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        console.log(`[debugging] Scrolled to target id: ${targetId}`);
      }
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => item.href.substring(1));
      let currentSection = 'home';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent"
            >
              VV.DEV
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-2 text-sm font-medium font-sans rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-cyan-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-indigo-50/70 dark:bg-neutral-900/70 rounded-full -z-10 border border-indigo-100/30 dark:border-neutral-800/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* CTA & Theme toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors shadow-sm gap-1 group"
            >
              Hire Me
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/50 dark:border-neutral-800/50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    activeSection === item.href.substring(1)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-neutral-900 dark:text-cyan-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
