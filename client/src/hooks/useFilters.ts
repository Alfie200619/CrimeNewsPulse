import { useState, useCallback } from "react";
import { ArticleFilter } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

// Initial filter state
const defaultFilters: ArticleFilter = {
  categoryIds: [],
  sourceIds: [],
  sentiments: [],
  dateFrom: undefined,
  dateTo: undefined,
  searchTerm: undefined,
  page: 1,
  pageSize: 10,
  sortBy: 'publishedAt',
  sortOrder: 'desc'
};

export function useFilters() {
  const [filters, setFilters] = useState<ArticleFilter>(defaultFilters);
  const queryClient = useQueryClient();
  
  // Update a specific filter field
  const updateFilter = useCallback(<K extends keyof ArticleFilter>(
    key: K, 
    value: ArticleFilter[K]
  ) => {
    setFilters(prev => {
      // When updating anything other than page, reset to page 1
      if (key !== 'page') {
        return { ...prev, [key]: value, page: 1 };
      }
      return { ...prev, [key]: value };
    });
  }, []);
  
  // Toggle a value in an array filter (categories, sources, sentiments)
  const toggleArrayFilter = useCallback(<K extends 'categoryIds' | 'sourceIds' | 'sentiments'>(
    key: K,
    value: ArticleFilter[K] extends (infer U)[] ? U : never
  ) => {
    setFilters(prev => {
      const currentArray = prev[key] || [];
      const isValuePresent = currentArray.includes(value);
      
      const newArray = isValuePresent
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [key]: newArray, page: 1 };
    });
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
  
  // Apply current date range
  const applyDateRange = useCallback((from?: string, to?: string) => {
    setFilters(prev => ({
      ...prev,
      dateFrom: from,
      dateTo: to,
      page: 1
    }));
  }, []);
  
  // Update the search term
  const updateSearchTerm = useCallback((term?: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term,
      page: 1
    }));
  }, []);
  
  // Handle pagination
  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  }, []);
  
  return {
    filters,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    applyDateRange,
    updateSearchTerm,
    goToPage
  };
}
