import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shirt, Award, Users, Globe, Menu, Bookmark } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';

export const categories = [
  { id: 'all', name: 'All', icon: Globe, color: 'from-indigo-500 to-purple-500', section: '' },
  { id: 'saved', name: 'Saved', icon: Bookmark, color: 'from-rose-500 to-pink-500', section: 'Saved' },
  { id: 'fashion', name: 'Fashion', icon: Sparkles, color: 'from-purple-500 to-pink-500', section: 'Fashion & Style' },
  { id: 'style', name: 'Style', icon: Shirt, color: 'from-blue-500 to-cyan-500', section: 'Style' },
  { id: 'arts', name: 'Arts', icon: Award, color: 'from-yellow-500 to-orange-500', section: 'Arts' },
  { id: 'culture', name: 'Culture', icon: Users, color: 'from-green-500 to-emerald-500', section: 'Culture' },
];

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide/show if scrolled past 100px
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-[73px] z-40 shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden py-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-zinc-200 dark:border-zinc-700"
              >
                <Menu className="w-4 h-4" />
                <span>Categories</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Categories
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Browse articles by category
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-3">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;

                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/25'
                          : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                          isActive ? 'bg-white/20' : `bg-gradient-to-r ${category.color}`
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`font-medium ${isActive ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {category.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop/Tablet Horizontal Navigation */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap group border ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-transparent shadow-lg shadow-rose-500/25'
                    : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-transparent hover:border-zinc-200 dark:hover:border-zinc-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isActive ? 'bg-white/20' : `bg-gradient-to-r ${category.color}`
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-white'}`} />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {category.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
