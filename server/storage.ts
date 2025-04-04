import { 
  Article, InsertArticle, Source, InsertSource, 
  Category, InsertCategory, User, InsertUser,
  ArticleFilter, ArticleWithDetails
} from "@shared/schema";

export interface IStorage {
  // User methods (keeping the original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Source methods
  getSources(): Promise<Source[]>;
  getSourceById(id: number): Promise<Source | undefined>;
  createSource(source: InsertSource): Promise<Source>;
  updateSource(id: number, source: Partial<InsertSource>): Promise<Source | undefined>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Article methods
  getArticles(filter: ArticleFilter): Promise<{ articles: ArticleWithDetails[], total: number }>;
  getArticleById(id: number): Promise<ArticleWithDetails | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  getArticleStats(): Promise<{
    categoryCounts: {categoryId: number, categoryName: string, count: number}[],
    sourceCounts: {isNigerian: boolean, count: number}[],
    sentimentCounts: {sentiment: string, count: number}[],
    total: number
  }>;
  getLatestArticles(limit: number): Promise<ArticleWithDetails[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sources: Map<number, Source>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  
  private currentUserId: number;
  private currentSourceId: number;
  private currentCategoryId: number;
  private currentArticleId: number;

  constructor() {
    this.users = new Map();
    this.sources = new Map();
    this.categories = new Map();
    this.articles = new Map();
    
    this.currentUserId = 1;
    this.currentSourceId = 1;
    this.currentCategoryId = 1;
    this.currentArticleId = 1;
    
    // Initialize with some default categories
    this.setupDefaults();
  }
  
  private setupDefaults() {
    // Add default categories
    const defaultCategories: InsertCategory[] = [
      { name: "Murder", description: "Homicide and killing-related crimes", color: "#EF4444" },
      { name: "Robbery", description: "Theft with force or threat", color: "#3B82F6" },
      { name: "Cybercrime", description: "Digital and internet-based crimes", color: "#F59E0B" },
      { name: "Kidnapping", description: "Abduction and hostage situations", color: "#8B5CF6" },
      { name: "Fraud", description: "Deception for financial gain", color: "#EC4899" },
      { name: "Drug Trafficking", description: "Illegal drug trade and distribution", color: "#10B981" },
      { name: "Terrorism", description: "Violent acts for political aims", color: "#6B7280" },
      { name: "Corruption", description: "Abuse of power for personal gain", color: "#6366F1" }
    ];
    
    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User methods (keeping the original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Source methods
  async getSources(): Promise<Source[]> {
    return Array.from(this.sources.values());
  }
  
  async getSourceById(id: number): Promise<Source | undefined> {
    return this.sources.get(id);
  }
  
  async createSource(insertSource: InsertSource): Promise<Source> {
    const id = this.currentSourceId++;
    const now = new Date();
    const source: Source = { ...insertSource, id, createdAt: now };
    this.sources.set(id, source);
    return source;
  }
  
  async updateSource(id: number, sourceUpdate: Partial<InsertSource>): Promise<Source | undefined> {
    const existingSource = this.sources.get(id);
    if (!existingSource) return undefined;
    
    const updatedSource = { ...existingSource, ...sourceUpdate };
    this.sources.set(id, updatedSource);
    return updatedSource;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Article methods
  async getArticles(filter: ArticleFilter): Promise<{ articles: ArticleWithDetails[], total: number }> {
    let filteredArticles = Array.from(this.articles.values());
    
    // Apply category filter
    if (filter.categoryIds && filter.categoryIds.length > 0) {
      filteredArticles = filteredArticles.filter(article => 
        article.categoryId !== null && filter.categoryIds?.includes(article.categoryId)
      );
    }
    
    // Apply source filter
    if (filter.sourceIds && filter.sourceIds.length > 0) {
      filteredArticles = filteredArticles.filter(article => 
        filter.sourceIds?.includes(article.sourceId)
      );
    }
    
    // Apply sentiment filter
    if (filter.sentiments && filter.sentiments.length > 0) {
      filteredArticles = filteredArticles.filter(article => 
        article.sentiment !== null && filter.sentiments?.includes(article.sentiment)
      );
    }
    
    // Apply date range filter
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      filteredArticles = filteredArticles.filter(article => 
        article.publishedAt !== null && article.publishedAt >= fromDate
      );
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      filteredArticles = filteredArticles.filter(article => 
        article.publishedAt !== null && article.publishedAt <= toDate
      );
    }
    
    // Apply search term filter
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.content.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filteredArticles.sort((a, b) => {
      if (filter.sortBy === "publishedAt") {
        // Handle null publishedAt dates
        if (a.publishedAt === null && b.publishedAt === null) return 0;
        if (a.publishedAt === null) return 1;
        if (b.publishedAt === null) return -1;
        
        return filter.sortOrder === "desc" 
          ? b.publishedAt.getTime() - a.publishedAt.getTime()
          : a.publishedAt.getTime() - b.publishedAt.getTime();
      }
      
      if (filter.sortBy === "sentiment") {
        // Handle null sentiment scores
        if (a.sentimentScore === null && b.sentimentScore === null) return 0;
        if (a.sentimentScore === null) return 1;
        if (b.sentimentScore === null) return -1;
        
        return filter.sortOrder === "desc"
          ? b.sentimentScore - a.sentimentScore
          : a.sentimentScore - b.sentimentScore;
      }
      
      // Default: sort by publishedAt desc
      if (a.publishedAt === null && b.publishedAt === null) return 0;
      if (a.publishedAt === null) return 1;
      if (b.publishedAt === null) return -1;
      
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    });
    
    const total = filteredArticles.length;
    
    // Apply pagination
    const pageSize = filter.pageSize || 10;
    const page = filter.page || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedArticles = filteredArticles.slice(start, end);
    
    // Convert to ArticleWithDetails by joining with sources and categories
    const articlesWithDetails: ArticleWithDetails[] = paginatedArticles.map(article => {
      const source = this.sources.get(article.sourceId);
      const category = article.categoryId ? this.categories.get(article.categoryId) : null;
      
      if (!source) {
        throw new Error(`Source with ID ${article.sourceId} not found`);
      }
      
      return {
        ...article,
        source: {
          id: source.id,
          name: source.name,
          url: source.url,
          logo: source.logo || null,
          country: source.country,
          isNigerian: source.isNigerian
        },
        category: category ? {
          id: category.id,
          name: category.name,
          color: category.color
        } : null
      };
    });
    
    return { articles: articlesWithDetails, total };
  }
  
  async getArticleById(id: number): Promise<ArticleWithDetails | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const source = this.sources.get(article.sourceId);
    if (!source) throw new Error(`Source with ID ${article.sourceId} not found`);
    
    const category = article.categoryId ? this.categories.get(article.categoryId) : null;
    
    return {
      ...article,
      source: {
        id: source.id,
        name: source.name,
        url: source.url,
        logo: source.logo || null,
        country: source.country,
        isNigerian: source.isNigerian
      },
      category: category ? {
        id: category.id,
        name: category.name,
        color: category.color
      } : null
    };
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const now = new Date();
    const article: Article = { 
      ...insertArticle, 
      id, 
      scrapedAt: now,
      publishedAt: insertArticle.publishedAt || now
    };
    
    this.articles.set(id, article);
    return article;
  }
  
  async updateArticle(id: number, articleUpdate: Partial<InsertArticle>): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    if (!existingArticle) return undefined;
    
    const updatedArticle = { ...existingArticle, ...articleUpdate };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }
  
  async getArticleStats(): Promise<{
    categoryCounts: {categoryId: number, categoryName: string, count: number}[],
    sourceCounts: {isNigerian: boolean, count: number}[],
    sentimentCounts: {sentiment: string, count: number}[],
    total: number
  }> {
    const articles = Array.from(this.articles.values());
    const total = articles.length;
    
    // Count by category
    const categoryCountMap = new Map<number, number>();
    articles.forEach(article => {
      if (article.categoryId) {
        const current = categoryCountMap.get(article.categoryId) || 0;
        categoryCountMap.set(article.categoryId, current + 1);
      }
    });
    
    const categoryCounts = Array.from(categoryCountMap.entries()).map(([categoryId, count]) => {
      const category = this.categories.get(categoryId);
      return {
        categoryId,
        categoryName: category ? category.name : 'Unknown',
        count
      };
    });
    
    // Count by source type (Nigerian vs International)
    const nigerianCount = articles.filter(article => {
      const source = this.sources.get(article.sourceId);
      return source && source.isNigerian;
    }).length;
    
    const internationalCount = total - nigerianCount;
    
    const sourceCounts = [
      { isNigerian: true, count: nigerianCount },
      { isNigerian: false, count: internationalCount }
    ];
    
    // Count by sentiment
    const sentimentCountMap = new Map<string, number>();
    articles.forEach(article => {
      if (article.sentiment) {
        const current = sentimentCountMap.get(article.sentiment) || 0;
        sentimentCountMap.set(article.sentiment, current + 1);
      }
    });
    
    const sentimentCounts = Array.from(sentimentCountMap.entries()).map(([sentiment, count]) => ({
      sentiment,
      count
    }));
    
    return {
      categoryCounts,
      sourceCounts,
      sentimentCounts,
      total
    };
  }
  
  async getLatestArticles(limit: number): Promise<ArticleWithDetails[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => {
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;
        return b.publishedAt.getTime() - a.publishedAt.getTime();
      })
      .slice(0, limit);
    
    return articles.map(article => {
      const source = this.sources.get(article.sourceId);
      const category = article.categoryId ? this.categories.get(article.categoryId) : null;
      
      if (!source) {
        throw new Error(`Source with ID ${article.sourceId} not found`);
      }
      
      return {
        ...article,
        source: {
          id: source.id,
          name: source.name,
          url: source.url,
          logo: source.logo || null,
          country: source.country,
          isNigerian: source.isNigerian
        },
        category: category ? {
          id: category.id,
          name: category.name,
          color: category.color
        } : null
      };
    });
  }
}

export const storage = new MemStorage();
