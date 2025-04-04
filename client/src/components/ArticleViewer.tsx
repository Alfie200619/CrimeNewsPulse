import { useEffect } from "react";
import { useArticle } from "@/hooks/useArticles";
import { ArrowLeft, Calendar, Link as LinkIcon, ThumbsDown, ThumbsUp, Minus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ArticleViewerProps {
  id: number;
}

export function ArticleViewer({ id }: ArticleViewerProps) {
  const { data: article, isLoading, isError } = useArticle(id);
  const [_, navigate] = useLocation();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p className="text-danger-500 dark:text-danger-400">Error loading article. The article may not exist or there was a problem fetching it.</p>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to articles
          </Button>
        </div>
      </div>
    );
  }

  // Format the date
  const getFormattedDate = () => {
    if (!article.publishedAt) return "Unknown date";
    
    try {
      const date = new Date(article.publishedAt);
      if (isNaN(date.getTime())) return "Unknown date";
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return "Unknown date";
    }
  };

  // Get the appropriate sentiment icon and styling
  const getSentimentInfo = () => {
    switch (article.sentiment?.toLowerCase()) {
      case "positive":
        return {
          icon: <ThumbsUp className="h-4 w-4 mr-1" />,
          bgColor: "bg-green-100 dark:bg-green-900",
          textColor: "text-green-800 dark:text-green-100"
        };
      case "negative":
        return {
          icon: <ThumbsDown className="h-4 w-4 mr-1" />,
          bgColor: "bg-red-100 dark:bg-red-900",
          textColor: "text-red-800 dark:text-red-100"
        };
      default:
        return {
          icon: <Minus className="h-4 w-4 mr-1" />,
          bgColor: "bg-neutral-100 dark:bg-neutral-700",
          textColor: "text-neutral-800 dark:text-neutral-200"
        };
    }
  };

  const sentimentInfo = getSentimentInfo();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="text-neutral-600 dark:text-neutral-400 mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to articles
        </Button>
        
        <div className="flex items-center mb-4 space-x-3">
          {article.category && (
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-100"
            >
              {article.category.name}
            </span>
          )}
          
          <span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sentimentInfo.bgColor} ${sentimentInfo.textColor}`}
          >
            {sentimentInfo.icon}
            {article.sentiment ? article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1) : "Neutral"}
          </span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-sm text-neutral-500 dark:text-neutral-400 mb-6 space-x-4">
          <div className="flex items-center">
            {article.source.logo && (
              <img 
                src={article.source.logo}
                alt={article.source.name}
                className="h-5 w-5 rounded-full mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span>{article.source.name}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{getFormattedDate()}</span>
          </div>
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <LinkIcon className="h-4 w-4 mr-1" />
            <span>Original Article</span>
          </a>
        </div>
      </div>
      
      <div className="prose prose-neutral max-w-none dark:prose-invert prose-p:text-neutral-600 dark:prose-p:text-neutral-300 mb-8">
        {article.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Scraped {formatDistanceToNow(new Date(article.scrapedAt), { addSuffix: true })}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={() => window.open(article.url, '_blank')}
              className="text-sm"
            >
              Visit Source Website
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Browse More Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleViewer;
