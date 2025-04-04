import { Source } from "@shared/schema";
import * as cheerio from "cheerio";
import { analyzeSentiment, classifyArticle } from "../services/nlpService";
import { storage } from "../storage";
import { nigerianSources } from "./nigerianSources";
import { internationalSources } from "./internationalSources";

// Generic article interface
interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  publishedAt: Date | null;
  sourceId: number;
}

// Initialize sources in database
export async function initializeSources() {
  const existingSources = await storage.getSources();
  
  if (existingSources.length === 0) {
    console.log("Initializing sources...");
    
    // Add Nigerian sources
    for (const source of nigerianSources) {
      await storage.createSource({
        name: source.name,
        url: source.url,
        logo: source.logo,
        country: "Nigeria",
        isNigerian: true,
        isActive: true
      });
    }
    
    // Add international sources
    for (const source of internationalSources) {
      await storage.createSource({
        name: source.name,
        url: source.url,
        logo: source.logo,
        country: source.country || "International",
        isNigerian: false,
        isActive: true
      });
    }
    
    console.log("Sources initialized successfully.");
  }
}

// Fetch and parse article data from a URL
export async function scrapeArticle(url: string, source: Source): Promise<ScrapedArticle | null> {
  try {
    // Fetch the HTML content
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Generic extraction - would need to be customized per site in production
    // Get the article title - common selectors for headlines
    const title = $('h1').first().text().trim() || 
      $('article h1').first().text().trim() ||
      $('.article-title').first().text().trim() ||
      $('.headline').first().text().trim();
      
    if (!title) {
      console.log(`Could not extract title from ${url}`);
      return null;
    }
    
    // Get the article content - common selectors for article content
    const contentSelectors = [
      'article p', '.article-body p', '.story-body p', 
      '.entry-content p', '.post-content p', '.story p'
    ];
    
    let content = '';
    
    // Try each selector until we find content
    for (const selector of contentSelectors) {
      const paragraphs = $(selector);
      if (paragraphs.length > 0) {
        paragraphs.each((_, el) => {
          content += $(el).text().trim() + '\n\n';
        });
        break;
      }
    }
    
    if (!content) {
      console.log(`Could not extract content from ${url}`);
      return null;
    }
    
    // Try to extract the publication date
    let publishedAt: Date | null = null;
    const dateSelectors = [
      'time', '.date', '.published-date', 
      'meta[property="article:published_time"]', 
      '.timestamp', '.article-date'
    ];
    
    for (const selector of dateSelectors) {
      const dateEl = $(selector);
      if (dateEl.length > 0) {
        const dateText = dateEl.attr('datetime') || dateEl.text();
        if (dateText) {
          try {
            publishedAt = new Date(dateText);
            if (!isNaN(publishedAt.getTime())) break;
          } catch (e) {
            // Try next selector if date parsing fails
          }
        }
      }
    }
    
    return {
      title,
      content,
      url,
      publishedAt,
      sourceId: source.id
    };
  } catch (error) {
    console.error(`Error scraping article from ${url}:`, error);
    return null;
  }
}

// Process the scraped article and save to database
export async function processArticle(scrapedArticle: ScrapedArticle) {
  try {
    // Analyze sentiment
    const sentiment = await analyzeSentiment(scrapedArticle.content);
    
    // Classify article into a crime category
    const category = await classifyArticle(scrapedArticle.title, scrapedArticle.content);
    
    // Prepare metadata
    const metadata = {
      wordCount: scrapedArticle.content.split(/\s+/).length,
      processedAt: new Date()
    };
    
    // Save to database
    await storage.createArticle({
      title: scrapedArticle.title,
      content: scrapedArticle.content,
      url: scrapedArticle.url,
      sourceId: scrapedArticle.sourceId,
      categoryId: category?.id,
      publishedAt: scrapedArticle.publishedAt,
      sentiment: sentiment.label,
      sentimentScore: sentiment.score,
      metadata
    });
    
    console.log(`Processed article: ${scrapedArticle.title}`);
  } catch (error) {
    console.error(`Error processing article ${scrapedArticle.url}:`, error);
  }
}

// Main scraping function
export async function runScraper() {
  try {
    // Initialize sources if needed
    await initializeSources();
    
    // Get all active sources
    const sources = await storage.getSources();
    const activeSources = sources.filter(source => source.isActive);
    
    console.log(`Starting scraper for ${activeSources.length} sources...`);
    
    // For each source, process recent articles
    for (const source of activeSources) {
      console.log(`Scraping from ${source.name}...`);
      
      try {
        // Fetch main page to find recent article links
        const response = await fetch(source.url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Find article links - generic approach, would need customization per site
        const articleLinks: string[] = [];
        $('a').each((_, element) => {
          const href = $(element).attr('href');
          if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            // Make sure URL is absolute
            let articleUrl = href;
            if (href.startsWith('/')) {
              // Convert relative URL to absolute
              const sourceUrl = new URL(source.url);
              articleUrl = `${sourceUrl.protocol}//${sourceUrl.host}${href}`;
            } else if (!href.startsWith('http')) {
              // Skip non-HTTP links
              return;
            }
            
            // Add to list if it's not already there
            if (!articleLinks.includes(articleUrl)) {
              articleLinks.push(articleUrl);
            }
          }
        });
        
        // Limit to first 5 articles per source for demo
        // In production, would implement checking for duplicates against database
        const limitedLinks = articleLinks.slice(0, 5);
        
        for (const link of limitedLinks) {
          try {
            const article = await scrapeArticle(link, source);
            if (article) {
              await processArticle(article);
            }
          } catch (error) {
            console.error(`Error processing article ${link}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error scraping source ${source.name}:`, error);
      }
    }
    
    console.log("Scraping completed successfully.");
  } catch (error) {
    console.error("Error running scraper:", error);
  }
}
