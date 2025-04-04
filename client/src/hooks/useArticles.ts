import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Article, ArticleFilter, ArticleResponse, ArticleStats } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

// Fetch articles with filters
export function useArticles(filters: ArticleFilter) {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    queryParams.set('categoryIds', filters.categoryIds.join(','));
  }
  
  if (filters.sourceIds && filters.sourceIds.length > 0) {
    queryParams.set('sourceIds', filters.sourceIds.join(','));
  }
  
  if (filters.sentiments && filters.sentiments.length > 0) {
    queryParams.set('sentiments', filters.sentiments.join(','));
  }
  
  if (filters.dateFrom) {
    queryParams.set('dateFrom', filters.dateFrom);
  }
  
  if (filters.dateTo) {
    queryParams.set('dateTo', filters.dateTo);
  }
  
  if (filters.searchTerm) {
    queryParams.set('searchTerm', filters.searchTerm);
  }
  
  if (filters.page) {
    queryParams.set('page', String(filters.page));
  }
  
  if (filters.pageSize) {
    queryParams.set('pageSize', String(filters.pageSize));
  }
  
  if (filters.sortBy) {
    queryParams.set('sortBy', filters.sortBy);
  }
  
  if (filters.sortOrder) {
    queryParams.set('sortOrder', filters.sortOrder);
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/api/articles${queryString ? `?${queryString}` : ''}`;

  return useQuery<ArticleResponse>({
    queryKey: [endpoint],
  });
}

// Fetch a single article by ID
export function useArticle(id: number | null) {
  return useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
    enabled: id !== null,
  });
}

// Fetch top/latest articles
export function useTopArticles(limit: number = 5) {
  return useQuery<Article[]>({
    queryKey: [`/api/articles/top/${limit}`],
  });
}

// Fetch article statistics
export function useArticleStats() {
  return useQuery<ArticleStats>({
    queryKey: ['/api/stats'],
  });
}

// Trigger scraping manually
export function useTriggerScrape() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/scrape', {});
      return true;
    },
    onSuccess: () => {
      // Invalidate all article-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    }
  });
}
