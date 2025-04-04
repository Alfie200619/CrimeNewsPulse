// Types for client-side use

export interface Category {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  logo: string | null;
  country: string;
  isNigerian: boolean;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  publishedAt: string | null;
  scrapedAt: string;
  sentiment: string | null;
  sentimentScore: number | null;
  metadata: any;
  source: Source;
  category: {
    id: number;
    name: string;
    color: string;
  } | null;
}

export interface ArticleResponse {
  articles: Article[];
  total: number;
}

export interface ArticleFilter {
  categoryIds?: number[];
  sourceIds?: number[];
  sentiments?: string[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'publishedAt' | 'sentiment' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticleStats {
  categoryCounts: {
    categoryId: number;
    categoryName: string;
    count: number;
  }[];
  sourceCounts: {
    isNigerian: boolean;
    count: number;
  }[];
  sentimentCounts: {
    sentiment: string;
    count: number;
  }[];
  total: number;
}
