import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Clock } from 'lucide-react';

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

interface HeroSectionProps {
  featuredArticle?: NewsArticle;
}

export function HeroSection({ featuredArticle }: HeroSectionProps) {
  // Default fallback content
  const defaultContent = {
    title: 'The New Era of',
    highlight: 'Conscious Fashion',
    abstract: "Explore how the world's leading designers are redefining luxury through sustainability, ethical production, and innovative materials that don't compromise on style.",
    byline: 'Emma Richardson',
    imageUrl: 'https://images.unsplash.com/photo-1670132718453-70321d9ecf20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzYyMjE5MTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    url: '#',
  };

  const content = featuredArticle || defaultContent;
  
  // Extract first name and last name initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <Badge className="mb-4 bg-rose-500/20 text-rose-300 border-rose-400/30 hover:bg-rose-500/30">
              Featured Story
            </Badge>
            
            {featuredArticle ? (
              <>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">{featuredArticle.title.split(' ').slice(0, 3).join(' ')}</span>
                  <span className="block bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {featuredArticle.title.split(' ').slice(3).join(' ')}
                  </span>
                </h2>
                <p className="text-lg text-zinc-300 mb-8 leading-relaxed max-w-xl">
                  {featuredArticle.abstract}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {defaultContent.title}
                  <span className="block bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {defaultContent.highlight}
                  </span>
                </h2>
                <p className="text-lg text-zinc-300 mb-8 leading-relaxed max-w-xl">
                  {defaultContent.abstract}
                </p>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-white text-zinc-900 hover:bg-zinc-100 shadow-xl shadow-white/10 group"
                onClick={() => featuredArticle && window.open(featuredArticle.url, '_blank')}
              >
                Read Full Article
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                View Collection
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                {featuredArticle?.authorImageUrl ? (
                  <img 
                    src={featuredArticle.authorImageUrl} 
                    alt={content.byline || defaultContent.byline}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {getInitials(content.byline || defaultContent.byline)}
                  </div>
                )}
                <span>{content.byline || defaultContent.byline}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <ImageWithFallback
                  src={content.imageUrl || defaultContent.imageUrl}
                  alt={featuredArticle?.title || 'Fashion editorial'}
                  className="w-full h-[400px] md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
