import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Article, ArticleFilter } from "@/lib/types";
import { useArticles } from "@/hooks/useArticles";
import { ArticleCard } from "@/components/ArticleCard";

interface MainContentProps {
  filters: ArticleFilter;
  onChangeSortBy: (value: string) => void;
  onPageChange: (page: number) => void;
}

export function MainContent({ 
  filters,
  onChangeSortBy,
  onPageChange
}: MainContentProps) {
  const { data, isLoading, isError } = useArticles(filters);
  const articles = data?.articles || [];
  const totalArticles = data?.total || 0;
  
  // Calculate pagination
  const totalPages = Math.ceil(totalArticles / (filters.pageSize || 10));
  const currentPage = filters.page || 1;
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are only a few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show some pages with ellipsis
      if (currentPage <= 3) {
        // Current page is near the start
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Current page is in the middle
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="lg:flex-1 order-1 lg:order-2">
      <div className="p-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-16 z-40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white">
            Latest Crime News <span className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">({totalArticles} articles)</span>
          </h2>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <label htmlFor="sort-by" className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</label>
            <Select
              value={filters.sortBy}
              onValueChange={onChangeSortBy}
            >
              <SelectTrigger id="sort-by" className="text-sm border-neutral-300 rounded-md shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedAt">Most Recent</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="sentiment">Sentiment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading articles...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-danger-500 dark:text-danger-400">Error loading articles. Please try again.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-600 dark:text-neutral-400">No articles found matching your filters.</p>
          </div>
        ) : (
          <>
            {/* Articles */}
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span 
                        key={`ellipsis-${index}`} 
                        className="inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-300"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => onPageChange(Number(page))}
                        className={`inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium
                          ${Number(page) === currentPage
                            ? 'text-primary-700 dark:text-primary-400'
                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }
                          dark:bg-neutral-800 dark:border-neutral-600
                        `}
                      >
                        {page}
                      </button>
                    )
                  ))}
                  
                  <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MainContent;
