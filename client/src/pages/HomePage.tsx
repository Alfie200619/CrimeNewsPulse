import { useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import MainContent from "@/components/MainContent";
import RightSidebar from "@/components/RightSidebar";
import Footer from "@/components/Footer";
import { useFilters } from "@/hooks/useFilters";
import { ArticleFilter } from "@/lib/types";

export default function HomePage() {
  const { 
    filters, 
    updateFilter, 
    toggleArrayFilter, 
    resetFilters, 
    applyDateRange,
    updateSearchTerm,
    goToPage
  } = useFilters();
  
  // Handle search from header
  const handleSearch = (term: string) => {
    updateSearchTerm(term);
  };
  
  // Handle category toggle
  const handleToggleCategory = (categoryId: number) => {
    toggleArrayFilter('categoryIds', categoryId);
  };
  
  // Handle source toggle
  const handleToggleSource = (sourceId: number) => {
    toggleArrayFilter('sourceIds', sourceId);
  };
  
  // Handle sentiment toggle
  const handleToggleSentiment = (sentiment: string) => {
    toggleArrayFilter('sentiments', sentiment);
  };
  
  // Handle date range application
  const handleApplyDateRange = (from?: string, to?: string) => {
    applyDateRange(from, to);
  };
  
  // Handle sort by change
  const handleSortByChange = (value: string) => {
    updateFilter('sortBy', value as ArticleFilter['sortBy']);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    goToPage(page);
  };
  
  // Handle apply filters button
  const handleApplyFilters = () => {
    // The filter state is already updated as changes happen,
    // but we could add additional logic here if needed
    console.log("Applying filters:", filters);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900">
      <Header onSearch={handleSearch} searchTerm={filters.searchTerm} />
      
      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        <LeftSidebar 
          filters={filters}
          onToggleCategory={handleToggleCategory}
          onToggleSource={handleToggleSource}
          onToggleSentiment={handleToggleSentiment}
          onApplyDateRange={handleApplyDateRange}
          onApplyFilters={handleApplyFilters}
        />
        
        <MainContent 
          filters={filters}
          onChangeSortBy={handleSortByChange}
          onPageChange={handlePageChange}
        />
        
        <RightSidebar />
      </main>
      
      <Footer />
    </div>
  );
}
