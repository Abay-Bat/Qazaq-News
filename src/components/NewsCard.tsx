import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Calendar, BookOpen, ArrowRight, Bookmark } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
  isSaved?: boolean;
  onToggleSave?: (article: NewsArticle) => void;
}

export function NewsCard({ article, variant = 'default', index = 0, isSaved = false, onToggleSave }: NewsCardProps) {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Alternate between image-left and image-right layouts
  const isImageLeft = index % 2 === 0;

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <Card 
          className="group overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-2xl dark:hover:shadow-purple-900/20 transition-all duration-500 hover:border-rose-200 dark:hover:border-rose-800 relative cursor-pointer"
          onClick={() => window.open(article.url, '_blank')}
        >
          {/* Gradient accent on hover */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <ImageWithFallback
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent"></div>
              
              {/* Image Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <Badge className="mb-3 bg-rose-500/90 text-white border-0 hover:bg-rose-600">
                  {article.section}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12 border-2 border-zinc-100 dark:border-zinc-700 shadow-sm">
                  {article.authorImageUrl && (
                    <AvatarImage 
                      src={article.authorImageUrl} 
                      alt={article.byline}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-purple-600 text-white font-semibold">
                    {getInitials(article.byline)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{article.byline}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(article.publishedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Title & Abstract */}
              <div className="flex-1">
                <h3 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors cursor-pointer">
                  {article.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed mb-6">
                  {article.abstract}
                </p>
              </div>

              {/* Meta Info & Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <BookOpen className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`transition-colors ${
                      isSaved 
                        ? 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300' 
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave?.(article);
                    }}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/25 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(article.url, '_blank');
                    }}
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default variant - alternating image positions
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className="group overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-500 hover:border-rose-200 dark:hover:border-rose-800 relative cursor-pointer"
        onClick={() => window.open(article.url, '_blank')}
      >
        {/* Gradient accent on hover */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-0 ${!isImageLeft ? 'md:flex md:flex-row-reverse' : ''}`}>
          {/* Image Section */}
          <div className={`relative md:col-span-2 h-[300px] md:h-auto overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${!isImageLeft ? 'md:order-2' : ''}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
            <ImageWithFallback
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
          </div>

          {/* Content Section */}
          <div className={`md:col-span-3 p-6 lg:p-8 flex flex-col justify-between ${!isImageLeft ? 'md:order-1' : ''}`}>
            {/* Author Info */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11 border-2 border-zinc-100 dark:border-zinc-700 shadow-sm">
                  {article.authorImageUrl && (
                    <AvatarImage 
                      src={article.authorImageUrl} 
                      alt={article.byline}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-purple-600 text-white text-xs font-semibold">
                    {getInitials(article.byline)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{article.byline}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>in</span>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50">
                      {article.section}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`transition-colors ${
                  isSaved 
                    ? 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300' 
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave?.(article);
                }}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer leading-tight group-hover:translate-x-1 transition-transform duration-300">
              {article.title}
            </h3>

            {/* Abstract */}
            <p className="text-zinc-600 dark:text-zinc-300 mb-6 line-clamp-3 leading-relaxed flex-1">
              {article.abstract}
            </p>

            {/* Meta Info & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-5 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <span>{formatDate(article.publishedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span>5 min read</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="group/btn self-start sm:self-auto text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(article.url, '_blank');
                }}
              >
                Read Article
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
