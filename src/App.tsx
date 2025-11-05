import { useEffect, useState } from "react";
import { NewsCard } from "./components/NewsCard";
import { HeroSection } from "./components/HeroSection";
import {
  CategoryNav,
  categories,
} from "./components/CategoryNav";
import { SearchBar } from "./components/SearchBar";
import { ThemeToggle } from "./components/ThemeToggle";
import { ScrollToTop } from "./components/ScrollToTop";
import {
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "./components/ui/skeleton";
import { Separator } from "./components/ui/separator";
import { Alert, AlertDescription } from "./components/ui/alert";
import logoImage from 'figma:asset/bd4ee887ba784e9a703c968bb5d6fee9d02e0f06.png';

interface NewsArticle {
  id: string;
  title: string;
  abstract: string;
  byline: string;
  section: string;
  publishedDate: string;
  url: string;
  imageUrl: string;
  authorImageUrl?: string;
}

// Replace this with your actual NY Times API key
const NY_TIMES_API_KEY = "f5O2MGEPOUxADHEVPtQsAb8fCMnGwMCu";

export default function App() {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<
    NewsArticle[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);

  // Initialize theme and saved articles from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // Load saved articles from localStorage
    const savedArticlesData = localStorage.getItem('savedArticles');
    if (savedArticlesData) {
      try {
        const parsed = JSON.parse(savedArticlesData);
        setSavedArticles(parsed);
      } catch (error) {
        console.error('Error loading saved articles:', error);
      }
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Fetch articles from NY Times API
  const fetchArticles = async (
    category: string,
    search: string = "",
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Check if API key is set
      if (NY_TIMES_API_KEY === "YOUR_API_KEY_HERE") {
        // Use mock data if API key is not set
        await loadMockData();
        return;
      }

      // Map category to NY Times Top Stories section
      let section = "fashion";
      const selectedCat = categories.find(
        (cat) => cat.id === category,
      );
      
      if (category !== "all" && selectedCat) {
        // Map our categories to NY Times sections
        const sectionMap: { [key: string]: string } = {
          fashion: "fashion",
          style: "fashion",
          arts: "arts",
          trending: "fashion",
          culture: "arts",
        };
        section = sectionMap[category] || "fashion";
      }

      // Use Top Stories API (simpler and more reliable)
      const url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NY_TIMES_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Transform NY Times API response to our NewsArticle format
      const articles: NewsArticle[] = data.results
        .filter((article: any) => article.title && article.abstract)
        .map((article: any, index: number) => {
          // Get image URL from multimedia if available
          let imageUrl = "fashion sustainable luxury";
          let authorImageUrl = undefined;
          
          if (article.multimedia && article.multimedia.length > 0) {
            const image = article.multimedia.find(
              (media: any) => 
                media.format === "threeByTwoSmallAt2X" || 
                media.format === "superJumbo"
            ) || article.multimedia[0];
            
            if (image && image.url) {
              imageUrl = image.url;
            }
            
            // Try to get a thumbnail image for author avatar
            const thumbnail = article.multimedia.find(
              (media: any) => 
                media.format === "thumbLarge" || 
                media.format === "mediumThreeByTwo210"
            );
            
            if (thumbnail && thumbnail.url) {
              authorImageUrl = thumbnail.url;
            }
          }

          return {
            id: article.uri || `article-${index}`,
            title: article.title || "Untitled",
            abstract: article.abstract || "No description available",
            byline: article.byline || "NY Times Staff",
            section: article.section || "Fashion",
            publishedDate:
              article.published_date?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
            url: article.url || "#",
            imageUrl: imageUrl,
            authorImageUrl: authorImageUrl,
          };
        });

      setAllNews(articles);
      setFilteredNews(articles);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch articles",
      );
      // Fallback to mock data on error
      await loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Load mock data (fallback)
  const loadMockData = async () => {
    const mockFashionNews: NewsArticle[] = [
      {
        id: "1",
        title:
          "Sustainable Fashion: The Future of Luxury Design",
        abstract:
          "Leading designers are revolutionizing the fashion industry with eco-friendly materials and ethical production methods. This shift represents a fundamental change in how luxury brands approach sustainability.",
        byline: "Emma Richardson",
        section: "Fashion",
        publishedDate: "2025-11-03",
        url: "#",
        imageUrl: "fashion sustainable luxury",
      },
      {
        id: "2",
        title:
          "Paris Fashion Week 2025: Bold Colors and Minimalist Silhouettes",
        abstract:
          "The latest collections from Paris Fashion Week showcase a striking contrast between vibrant color palettes and clean, minimalist designs. Designers are pushing boundaries while maintaining classic elegance.",
        byline: "Marcus Chen",
        section: "Fashion",
        publishedDate: "2025-11-02",
        url: "#",
        imageUrl: "paris fashion runway",
      },
      {
        id: "3",
        title:
          "The Renaissance of Vintage Streetwear in Modern Culture",
        abstract:
          "Vintage streetwear is experiencing an unprecedented resurgence as Gen Z embraces nostalgia and sustainability. Limited edition pieces from the 90s and early 2000s are commanding premium prices.",
        byline: "Sofia Martinez",
        section: "Fashion",
        publishedDate: "2025-11-01",
        url: "#",
        imageUrl: "vintage streetwear style",
      },
      {
        id: "4",
        title:
          "Milan Fashion Week: Italian Craftsmanship Meets Modern Innovation",
        abstract:
          "Italian designers showcase their mastery of traditional techniques while embracing cutting-edge technology and sustainable practices.",
        byline: "Alessandro Rossi",
        section: "Fashion",
        publishedDate: "2025-10-31",
        url: "#",
        imageUrl: "fashion sustainable luxury",
      },
      {
        id: "5",
        title: "The Art of Slow Fashion: Quality Over Quantity",
        abstract:
          "A growing movement embraces timeless pieces and mindful consumption, challenging fast fashion culture and promoting sustainable wardrobes.",
        byline: "Claire Bennett",
        section: "Style",
        publishedDate: "2025-10-30",
        url: "#",
        imageUrl: "vintage streetwear style",
      },
      {
        id: "6",
        title:
          "Digital Fashion: NFTs and Virtual Runways Transform the Industry",
        abstract:
          "Technology is reshaping fashion with virtual collections, digital fashion shows, and NFT wearables creating new opportunities for designers and consumers.",
        byline: "Jordan Kim",
        section: "Arts",
        publishedDate: "2025-10-29",
        url: "#",
        imageUrl: "paris fashion runway",
      },
    ];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setAllNews(mockFashionNews);
    setFilteredNews(mockFashionNews);
  };

  // Initial fetch
  useEffect(() => {
    fetchArticles(selectedCategory, searchQuery);
  }, []);

  // Filter articles when category or search changes
  useEffect(() => {
    // Show saved articles when "saved" category is selected
    if (selectedCategory === "saved") {
      setFilteredNews(savedArticles);
      return;
    }

    if (selectedCategory === "all" && !searchQuery) {
      setFilteredNews(allNews);
      return;
    }

    let filtered = [...allNews];

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.abstract.toLowerCase().includes(lowerQuery) ||
          article.section.toLowerCase().includes(lowerQuery),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      const selectedCat = categories.find(
        (cat) => cat.id === selectedCategory,
      );
      if (selectedCat && selectedCat.section) {
        filtered = filtered.filter(
          (article) =>
            article.section
              .toLowerCase()
              .includes(selectedCat.section.toLowerCase()) ||
            selectedCat.section
              .toLowerCase()
              .includes(article.section.toLowerCase()),
        );
      }
    }

    setFilteredNews(filtered);
  }, [selectedCategory, searchQuery, allNews, savedArticles]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Optionally refetch with new category
    // fetchArticles(categoryId, searchQuery);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Optionally refetch with new search query
    // fetchArticles(selectedCategory, query);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Toggle save article
  const toggleSaveArticle = (article: NewsArticle) => {
    setSavedArticles((prev) => {
      const isAlreadySaved = prev.some((saved) => saved.id === article.id);
      let newSavedArticles: NewsArticle[];

      if (isAlreadySaved) {
        // Remove from saved
        newSavedArticles = prev.filter((saved) => saved.id !== article.id);
      } else {
        // Add to saved
        newSavedArticles = [...prev, article];
      }

      // Save to localStorage
      localStorage.setItem('savedArticles', JSON.stringify(newSavedArticles));
      return newSavedArticles;
    });
  };

  // Check if an article is saved
  const isArticleSaved = (articleId: string) => {
    return savedArticles.some((saved) => saved.id === articleId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer" onClick={scrollToTop}>
                <img 
                  src={logoImage} 
                  alt="Qazaq News Logo" 
                  className="w-14 h-14 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:block cursor-pointer" onClick={scrollToTop}>
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  QAZAQ NEWS
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
                  Fashion • Style • Culture
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Hero Section */}
      {!loading && filteredNews.length > 0 && (
        <HeroSection featuredArticle={filteredNews[0]} />
      )}

      {/* API Key Warning */}
      {NY_TIMES_API_KEY === "YOUR_API_KEY_HERE" && !loading && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Demo Mode:</strong> Add your NY Times API
              key to{" "}
              <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">
                App.tsx
              </code>{" "}
              (line 25) to fetch live articles. Get your free
              API key at{" "}
              <a
                href="https://developer.nytimes.com/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-900 dark:hover:text-amber-100"
              >
                developer.nytimes.com
              </a>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error}. Showing cached
              results.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-rose-400 to-transparent"></div>
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {selectedCategory === "saved"
                ? "Saved Articles"
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Latest Stories"}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-rose-400/30 to-transparent"></div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 pl-[60px]">
            {filteredNews.length}{" "}
            {filteredNews.length === 1 ? "article" : "articles"}{" "}
            {selectedCategory === "saved" ? "saved" : "found"}
          </p>
        </div>

        {filteredNews.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-purple-100 dark:from-rose-950 dark:to-purple-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {selectedCategory === "saved" ? "No saved articles yet" : "No articles found"}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              {selectedCategory === "saved" 
                ? "Start saving articles by clicking the bookmark icon" 
                : "Try adjusting your search or category filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* First article as featured */}
                {filteredNews.length > 0 && (
                  <>
                    <NewsCard 
                      article={filteredNews[0]} 
                      variant="featured" 
                      index={0} 
                      isSaved={isArticleSaved(filteredNews[0].id)}
                      onToggleSave={toggleSaveArticle}
                    />
                    {filteredNews.length > 1 && (
                      <Separator className="my-12 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
                    )}
                  </>
                )}
                
                {/* Rest of articles with alternating layouts */}
                {filteredNews.slice(1).map((article, idx) => (
                  <div key={article.id}>
                    <NewsCard 
                      article={article} 
                      variant="default" 
                      index={idx + 1} 
                      isSaved={isArticleSaved(article.id)}
                      onToggleSave={toggleSaveArticle}
                    />
                    
                    {idx < filteredNews.length - 2 && (
                      <Separator className="my-8 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                QAZAQ NEWS
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Your premier destination for fashion news,
                trends, and cultural insights.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">
                Categories
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                {categories.slice(1, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() =>
                        handleCategoryChange(cat.id)
                      }
                      className="hover:text-rose-600 transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">
                About
              </h4>
              <p className="text-sm text-zinc-600 mb-4">
                Powered by{" "}
                <a
                  href="https://developer.nytimes.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-700 transition-colors"
                >
                  NY Times API
                </a>
              </p>
            </div>
          </div>
          <Separator className="mb-8 bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <p>© 2025 Qazaq News. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Photos from{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:text-rose-700 transition-colors"
              >
                Unsplash
              </a>
              {" • "}Icons from{" "}
              <a
                href="https://lucide.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:text-rose-700 transition-colors"
              >
                Lucide
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}