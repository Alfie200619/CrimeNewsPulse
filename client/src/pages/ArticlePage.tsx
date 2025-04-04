import { useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleViewer from "@/components/ArticleViewer";
import { useFilters } from "@/hooks/useFilters";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { updateSearchTerm } = useFilters();
  
  const articleId = id ? parseInt(id) : 0;
  
  // Handle search from header (will redirect to home)
  const handleSearch = (term: string) => {
    updateSearchTerm(term);
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow w-full bg-white dark:bg-neutral-800 shadow-md">
        <ArticleViewer id={articleId} />
      </main>
      
      <Footer />
    </div>
  );
}
