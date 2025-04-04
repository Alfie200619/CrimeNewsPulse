import { formatDistanceToNow } from "date-fns";
import { ArrowRight, ThumbsDown, ThumbsUp, Minus } from "lucide-react";
import { useLocation } from "wouter";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [_, navigate] = useLocation();

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
          icon: <ThumbsUp className="h-3 w-3 mr-1" />,
          bgColor: "bg-green-100 dark:bg-green-900",
          textColor: "text-green-800 dark:text-green-100"
        };
      case "negative":
        return {
          icon: <ThumbsDown className="h-3 w-3 mr-1" />,
          bgColor: "bg-red-100 dark:bg-red-900",
          textColor: "text-red-800 dark:text-red-100"
        };
      default:
        return {
          icon: <Minus className="h-3 w-3 mr-1" />,
          bgColor: "bg-neutral-100 dark:bg-neutral-700",
          textColor: "text-neutral-800 dark:text-neutral-200"
        };
    }
  };

  const sentimentInfo = getSentimentInfo();
  
  // Get category color
  const getCategoryColor = () => {
    if (!article.category) return "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
    
    const color = article.category.color;
    return `bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-100`;
  };

  const handleReadMore = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md mb-4 overflow-hidden border border-neutral-200 dark:border-neutral-700">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="bg-danger-100 text-danger-800 text-xs px-2 py-1 rounded-full dark:bg-danger-900 dark:text-danger-100">
              {article.category?.name || "Uncategorized"}
            </span>
            <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
              {getFormattedDate()}
            </span>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sentimentInfo.bgColor} ${sentimentInfo.textColor}`}>
              {sentimentInfo.icon}
              {article.sentiment ? article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1) : "Neutral"}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          {article.title}
        </h3>
        
        <p className="text-neutral-600 dark:text-neutral-300 mb-3 font-serif line-clamp-3">
          {article.content.length > 250 
            ? article.content.substring(0, 250) + "..."
            : article.content}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {article.source.logo ? (
              <img 
                src={article.source.logo} 
                alt={article.source.name} 
                className="h-5 w-5 rounded-full mr-2" 
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {article.source.name}
            </span>
          </div>
          
          <button 
            onClick={handleReadMore}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
          >
            Read Full Article <ArrowRight className="inline h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
