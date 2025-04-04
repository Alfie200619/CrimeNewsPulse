import { useArticleStats, useTopArticles } from "@/hooks/useArticles";
import { InfoIcon, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export function RightSidebar() {
  const { data: stats, isLoading: statsLoading } = useArticleStats();
  const { data: topArticles, isLoading: articlesLoading } = useTopArticles(3);
  
  // Calculate the percentages for the chart
  const calculatePercentages = () => {
    if (!stats || statsLoading) return {};
    
    const sourceCounts = stats.sourceCounts;
    const total = sourceCounts.reduce((sum, item) => sum + item.count, 0);
    
    const nigerianPercentage = total > 0 
      ? Math.round((sourceCounts.find(s => s.isNigerian)?.count || 0) / total * 100) 
      : 0;
    
    const internationalPercentage = total > 0
      ? Math.round((sourceCounts.find(s => !s.isNigerian)?.count || 0) / total * 100)
      : 0;
    
    return {
      nigerian: nigerianPercentage,
      international: internationalPercentage
    };
  };
  
  const percentages = calculatePercentages();
  
  // Format updated time
  const getLastUpdatedTime = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(now);
  };
  
  return (
    <aside className="lg:w-80 p-4 lg:border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 overflow-y-auto order-3">
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Analytics Overview</h2>
        
        <div className="space-y-4">
          {/* Crime Type Distribution Chart */}
          <div className="bg-neutral-50 p-3 rounded-lg dark:bg-neutral-700">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Crime Type Distribution</h3>
            <div className="h-48 relative">
              {statsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {stats?.categoryCounts && stats.categoryCounts.length > 0 ? (
                    <>
                      <div className="w-32 h-32 rounded-full border-8 border-primary-500 relative">
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-danger-500 border-l-transparent border-r-transparent border-b-transparent transform -rotate-45"></div>
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-warning-500 border-l-transparent border-t-transparent border-b-transparent transform rotate-45"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4 text-xs">
                        {stats.categoryCounts.slice(0, 3).map((category, index) => {
                          const colors = ["primary", "danger", "warning"];
                          return (
                            <div key={category.categoryId} className="flex items-center">
                              <div className={`w-3 h-3 bg-${colors[index]}-500 rounded-full mr-1`}></div>
                              <span className="text-neutral-600 dark:text-neutral-400">
                                {category.categoryName} ({Math.round((category.count / stats.total) * 100)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sentiment Analysis Trends Chart */}
          <div className="bg-neutral-50 p-3 rounded-lg dark:bg-neutral-700">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Sentiment Analysis Trends</h3>
            <div className="h-48 relative">
              {statsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 flex items-end">
                      {/* Simplified bar chart - in a real app would use a charting library */}
                      <div className="flex-1 mx-1">
                        <div className="bg-red-500 h-3/4 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Mon</div>
                      </div>
                      <div className="flex-1 mx-1">
                        <div className="bg-red-500 h-2/3 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Tue</div>
                      </div>
                      <div className="flex-1 mx-1">
                        <div className="bg-neutral-500 h-1/2 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Wed</div>
                      </div>
                      <div className="flex-1 mx-1">
                        <div className="bg-red-500 h-4/5 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Thu</div>
                      </div>
                      <div className="flex-1 mx-1">
                        <div className="bg-neutral-500 h-3/5 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Fri</div>
                      </div>
                      <div className="flex-1 mx-1">
                        <div className="bg-green-500 h-1/4 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Sat</div>
                      </div>
                      <div className="flex-1 mx-1">
                        <div className="bg-red-500 h-3/4 rounded-t"></div>
                        <div className="text-center text-xs mt-1 text-neutral-600 dark:text-neutral-400">Sun</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">Negative</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-neutral-500 rounded-full mr-1"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">Neutral</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">Positive</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-neutral-900 dark:text-white">Top Stories</h2>
          <div
            className="text-primary-600 text-sm hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer"
            onClick={() => window.location.href = '/latest'}
          >
            View All
          </div>
        </div>
        
        {articlesLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {topArticles && topArticles.length > 0 ? (
              topArticles.map((article) => (
                <div key={article.id} className="flex items-start py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-danger-500 mt-2 mr-2"></div>
                  <div>
                    <div
                      className="text-sm font-medium text-neutral-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                      onClick={() => window.location.href = `/article/${article.id}`}
                    >
                      {article.title}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{article.source.name}</span>
                      <span className="mx-1 text-neutral-300 dark:text-neutral-600">•</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {article.publishedAt 
                          ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                          : "Unknown time"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400 text-sm py-2">No stories available</p>
            )}
          </>
        )}
      </div>
      
      <div className="pb-4">
        <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Source Distribution</h2>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-32 text-sm text-neutral-600 dark:text-neutral-400">Nigerian</div>
            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700">
              <div className="bg-primary-500 h-full rounded-full" style={{ width: `${percentages.nigerian || 0}%` }}></div>
            </div>
            <div className="w-10 text-right text-sm text-neutral-600 dark:text-neutral-400">{percentages.nigerian || 0}%</div>
          </div>
          
          <div className="flex items-center">
            <div className="w-32 text-sm text-neutral-600 dark:text-neutral-400">International</div>
            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700">
              <div className="bg-primary-500 h-full rounded-full" style={{ width: `${percentages.international || 0}%` }}></div>
            </div>
            <div className="w-10 text-right text-sm text-neutral-600 dark:text-neutral-400">{percentages.international || 0}%</div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-primary-50 rounded-lg dark:bg-neutral-700">
          <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">
            <InfoIcon className="h-4 w-4 inline mr-1" /> Data Collection Status
          </h3>
          <p className="text-xs text-primary-700 dark:text-primary-200">
            Last synchronized: <span className="font-medium">{getLastUpdatedTime()}</span>
          </p>
          <div className="mt-1 flex justify-between items-center">
            <span className="text-xs text-primary-700 dark:text-primary-200">
              Crawled {stats?.total || 0} articles from sources
            </span>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-100">
              <Circle className="h-3 w-3 fill-current mr-1 inline" /> Updated
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
