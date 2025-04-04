import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { articleFilterSchema, insertArticleSchema } from "@shared/schema";
import { runScraper } from "./scrapers/index";
import cron from "node-cron";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the HTTP server
  const httpServer = createServer(app);
  
  // API Routes
  
  // GET all sources
  app.get("/api/sources", async (req: Request, res: Response) => {
    try {
      const sources = await storage.getSources();
      return res.json(sources);
    } catch (error) {
      console.error("Error fetching sources:", error);
      return res.status(500).json({ message: "Failed to fetch sources" });
    }
  });
  
  // GET all categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      return res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // GET articles with filtering
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      // Parse and validate filter params
      const filter = articleFilterSchema.parse({
        categoryIds: req.query.categoryIds ? (req.query.categoryIds as string).split(',').map(Number) : undefined,
        sourceIds: req.query.sourceIds ? (req.query.sourceIds as string).split(',').map(Number) : undefined,
        sentiments: req.query.sentiments ? (req.query.sentiments as string).split(',') : undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        searchTerm: req.query.searchTerm as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
        sortBy: req.query.sortBy as any || "publishedAt",
        sortOrder: req.query.sortOrder as any || "desc"
      });
      
      const result = await storage.getArticles(filter);
      return res.json(result);
    } catch (error) {
      console.error("Error fetching articles:", error);
      return res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  
  // GET a single article by ID
  app.get("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const article = await storage.getArticleById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      return res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      return res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  
  // GET top articles (for right sidebar)
  app.get("/api/articles/top/:limit", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.params.limit) || 5;
      const articles = await storage.getLatestArticles(limit);
      return res.json(articles);
    } catch (error) {
      console.error("Error fetching top articles:", error);
      return res.status(500).json({ message: "Failed to fetch top articles" });
    }
  });
  
  // GET article statistics
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getArticleStats();
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching article statistics:", error);
      return res.status(500).json({ message: "Failed to fetch article statistics" });
    }
  });
  
  // POST endpoint to manually trigger scraping for testing
  app.post("/api/scrape", async (req: Request, res: Response) => {
    try {
      // Run the scraper asynchronously
      runScraper().catch(err => console.error("Error in manual scrape:", err));
      return res.json({ message: "Scraping process started" });
    } catch (error) {
      console.error("Error starting scraper:", error);
      return res.status(500).json({ message: "Failed to start scraper" });
    }
  });
  
  // Schedule scraper to run every hour
  try {
    cron.schedule("0 * * * *", () => {
      console.log("Running scheduled scraper...");
      runScraper().catch(err => console.error("Error in scheduled scrape:", err));
    });
    console.log("Scraper scheduled to run every hour");
    
    // Run the scraper once at startup
    console.log("Running initial scraper...");
    runScraper().catch(err => console.error("Error in initial scrape:", err));
  } catch (error) {
    console.error("Error setting up scraper schedule:", error);
  }
  
  return httpServer;
}
