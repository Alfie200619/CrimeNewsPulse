import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ArticleFilter } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface LeftSidebarProps {
  filters: ArticleFilter;
  onToggleCategory: (categoryId: number) => void;
  onToggleSource: (sourceId: number) => void;
  onToggleSentiment: (sentiment: string) => void;
  onApplyDateRange: (from?: string, to?: string) => void;
  onApplyFilters: () => void;
}

export function LeftSidebar({
  filters,
  onToggleCategory,
  onToggleSource,
  onToggleSentiment,
  onApplyDateRange,
  onApplyFilters
}: LeftSidebarProps) {
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch sources
  const { data: sources = [] } = useQuery({
    queryKey: ['/api/sources'],
  });

  // Handle date range
  const handleDateRangeChange = () => {
    onApplyDateRange(dateFrom || undefined, dateTo || undefined);
  };

  return (
    <aside className="lg:w-64 p-4 lg:border-r border-neutral-200 dark:border-neutral-700 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 bg-white dark:bg-neutral-800 overflow-y-auto order-2 lg:order-1">
      {/* Categories Section */}
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Categories</h2>
        <div className="space-y-2">
          {categories.slice(0, showAllCategories ? categories.length : 5).map((category) => (
            <div key={category.id} className="flex items-center mb-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categoryIds?.includes(category.id)}
                onCheckedChange={() => onToggleCategory(category.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded dark:border-neutral-600 dark:bg-neutral-700"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                {category.name} <span className="text-xs text-neutral-500 dark:text-neutral-400">({category.count || 0})</span>
              </Label>
            </div>
          ))}
        </div>
        {categories.length > 5 && (
          <Button
            variant="link"
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-primary-600 text-sm hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mt-2 p-0"
          >
            {showAllCategories ? "Show less..." : "Show more..."}
          </Button>
        )}
      </div>
      
      {/* Sources Section */}
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Sources</h2>
        <div className="space-y-2">
          {sources.slice(0, showAllSources ? sources.length : 5).map((source) => (
            <div key={source.id} className="flex items-center mb-2">
              <Checkbox
                id={`source-${source.id}`}
                checked={filters.sourceIds?.includes(source.id)}
                onCheckedChange={() => onToggleSource(source.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded dark:border-neutral-600 dark:bg-neutral-700"
              />
              <Label
                htmlFor={`source-${source.id}`}
                className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                {source.name}
              </Label>
            </div>
          ))}
        </div>
        {sources.length > 5 && (
          <Button
            variant="link"
            onClick={() => setShowAllSources(!showAllSources)}
            className="text-primary-600 text-sm hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mt-2 p-0"
          >
            {showAllSources ? "Show less..." : "Show all 50 sources..."}
          </Button>
        )}
      </div>
      
      {/* Date Range Section */}
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Date Range</h2>
        <div className="space-y-3">
          <Label className="text-sm text-neutral-700 dark:text-neutral-300 block">From</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm"
          />
          
          <Label className="text-sm text-neutral-700 dark:text-neutral-300 block">To</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm"
          />
        </div>
        
        <div className="mt-3">
          <Button
            variant="default"
            className="bg-primary-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full"
            onClick={onApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
      
      {/* Sentiment Analysis Section */}
      <div className="pb-4">
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Sentiment Analysis</h2>
        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <Checkbox
              id="sentiment-negative"
              checked={filters.sentiments?.includes("negative")}
              onCheckedChange={() => onToggleSentiment("negative")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded dark:border-neutral-600 dark:bg-neutral-700"
            />
            <Label
              htmlFor="sentiment-negative"
              className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
            >
              Negative <span className="text-xs text-neutral-500 dark:text-neutral-400">(42)</span>
            </Label>
          </div>
          
          <div className="flex items-center mb-2">
            <Checkbox
              id="sentiment-neutral"
              checked={filters.sentiments?.includes("neutral")}
              onCheckedChange={() => onToggleSentiment("neutral")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded dark:border-neutral-600 dark:bg-neutral-700"
            />
            <Label
              htmlFor="sentiment-neutral"
              className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
            >
              Neutral <span className="text-xs text-neutral-500 dark:text-neutral-400">(28)</span>
            </Label>
          </div>
          
          <div className="flex items-center mb-2">
            <Checkbox
              id="sentiment-positive"
              checked={filters.sentiments?.includes("positive")}
              onCheckedChange={() => onToggleSentiment("positive")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded dark:border-neutral-600 dark:bg-neutral-700"
            />
            <Label
              htmlFor="sentiment-positive"
              className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
            >
              Positive <span className="text-xs text-neutral-500 dark:text-neutral-400">(8)</span>
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
