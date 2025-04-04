import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, Github, Database, Server, Code, Package, Heart } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

export default function AboutPage() {
  const { updateSearchTerm } = useFilters();
  
  // Handle search from header (will redirect to home)
  const handleSearch = (term: string) => {
    updateSearchTerm(term);
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow w-full bg-white dark:bg-neutral-800 shadow-md">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              About <span className="text-primary-600 dark:text-primary-500">CrimeWatch News</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-neutral-500 dark:text-neutral-400">
              An advanced crime news aggregation platform for tracking and analyzing crime reports from Nigerian and international sources.
            </p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="flex items-center">Project Overview <Server className="ml-2 h-5 w-5 text-primary-500" /></h2>
            <p>
              CrimeWatch News is a comprehensive crime news aggregation platform built as a capstone project by Chibuchi Agu and Akolo Bulus at the Nigerian University of Technology And Management (NUTM). This platform is developed to provide centralized access to crime-related news from both Nigerian and international sources, enabling users to stay informed about crime trends, analyze patterns, and understand the broader context of criminal activities.
            </p>
            
            <h2 className="flex items-center">Technical Architecture <Code className="ml-2 h-5 w-5 text-primary-500" /></h2>
            <p>
              The platform is built as a modern web application using a full-stack JavaScript/TypeScript architecture:
            </p>
            
            <h3>Frontend Technologies</h3>
            <ul>
              <li><strong>React:</strong> The user interface is built with React for component-based development</li>
              <li><strong>TypeScript:</strong> For type safety and improved developer experience</li>
              <li><strong>TanStack Query:</strong> For efficient data fetching, caching, and state management</li>
              <li><strong>Tailwind CSS:</strong> For responsive and utility-first styling</li>
              <li><strong>Shadcn UI:</strong> For accessible and customizable UI components</li>
              <li><strong>Wouter:</strong> For lightweight client-side routing</li>
            </ul>
            
            <h3>Backend Technologies</h3>
            <ul>
              <li><strong>Node.js:</strong> Server-side JavaScript runtime</li>
              <li><strong>Express:</strong> Web application framework for API development</li>
              <li><strong>Cheerio:</strong> For web scraping and HTML parsing</li>
              <li><strong>Drizzle ORM:</strong> For database operations and schema management</li>
              <li><strong>Zod:</strong> For schema validation and type generation</li>
              <li><strong>Node-cron:</strong> For scheduling periodic data collection</li>
            </ul>
            
            <h2 className="flex items-center">Key Features <Package className="ml-2 h-5 w-5 text-primary-500" /></h2>
            <ul>
              <li><strong>Multi-source News Aggregation:</strong> Collects news from 50+ Nigerian and international news sources</li>
              <li><strong>Automated Web Scraping:</strong> Regular scraping of news sources to ensure up-to-date content</li>
              <li><strong>Sentiment Analysis:</strong> Analyzes the sentiment of each article (positive, neutral, negative)</li>
              <li><strong>Content Categorization:</strong> Automatically categorizes articles into crime types</li>
              <li><strong>Advanced Filtering:</strong> Filter articles by source, category, sentiment, and date range</li>
              <li><strong>Search Functionality:</strong> Full-text search across all aggregated articles</li>
              <li><strong>Responsive Design:</strong> Optimized for desktop, tablet, and mobile devices</li>
              <li><strong>Real-time Analytics:</strong> View crime statistics and trends based on aggregated data</li>
              <li><strong>Dark Mode Support:</strong> Toggle between light and dark themes for better readability</li>
            </ul>
            
            <h2 className="flex items-center">Data Processing Pipeline <Database className="ml-2 h-5 w-5 text-primary-500" /></h2>
            <ol>
              <li><strong>Data Collection:</strong> Web scrapers collect crime news from various sources</li>
              <li><strong>Content Extraction:</strong> Article title, content, URL, and publication date are extracted</li>
              <li><strong>Natural Language Processing:</strong> NLP techniques analyze content for sentiment and categorization</li>
              <li><strong>Data Storage:</strong> Processed articles are stored in a structured database</li>
              <li><strong>API Exposure:</strong> RESTful API endpoints provide access to the processed data</li>
              <li><strong>Frontend Rendering:</strong> User interface displays the data in an accessible format</li>
            </ol>
            
            <h2 className="flex items-center">Future Enhancements <Github className="ml-2 h-5 w-5 text-primary-500" /></h2>
            <ul>
              <li>Machine learning model for improved article classification</li>
              <li>User account system for saved searches and preferences</li>
              <li>Notification system for specific crime categories or locations</li>
              <li>Crime mapping and geographical visualization</li>
              <li>Advanced analytics and trend identification</li>
              <li>Natural language generation for crime summary reports</li>
            </ul>
            
            <h2 className="flex items-center mt-8">License and Attribution <ExternalLink className="ml-2 h-5 w-5 text-primary-500" /></h2>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <p className="mb-4">
                <strong>© {new Date().getFullYear()} Nigerian University of Technology And Management (NUTM)</strong>
              </p>
              <p className="mb-4">
                This project is the intellectual property of the Nigerian University of Technology And Management (NUTM). All rights reserved.
              </p>
              <p className="mb-2">
                <strong>Developed by:</strong>
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>Chibuchi Agu</li>
                <li>Akolo Bulus</li>
              </ul>
              <p>
                Unauthorized reproduction, distribution, or modification of this software, its source code, or associated documentation is strictly prohibited without prior written permission from NUTM.
              </p>
            </div>
            
            <div className="text-center mt-10">
              <p className="flex items-center justify-center text-lg text-neutral-600 dark:text-neutral-400">
                Made with <Heart className="h-5 w-5 mx-1 text-danger-500" /> at Nigerian University of Technology And Management
              </p>
              <div
                className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-500 hover:underline cursor-pointer"
                onClick={() => window.location.href = '/'}
              >
                Return to homepage
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}