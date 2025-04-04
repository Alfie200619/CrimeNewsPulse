import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (keeping the original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// News Sources
export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  logo: text("logo"),
  country: text("country").notNull(),
  isNigerian: boolean("is_nigerian").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSourceSchema = createInsertSchema(sources).omit({
  id: true,
  createdAt: true,
});

export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;

// Crime Types/Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// News Articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  url: text("url").notNull().unique(),
  sourceId: integer("source_id").notNull(),
  categoryId: integer("category_id"),
  publishedAt: timestamp("published_at"),
  scrapedAt: timestamp("scraped_at").notNull().defaultNow(),
  sentiment: text("sentiment"),
  sentimentScore: integer("sentiment_score"),
  metadata: json("metadata"),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  scrapedAt: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Full article with joined data
export const articleWithDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  url: z.string(),
  publishedAt: z.date().nullable(),
  scrapedAt: z.date(),
  sentiment: z.string().nullable(),
  sentimentScore: z.number().nullable(),
  metadata: z.any().nullable(),
  source: z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    logo: z.string().nullable(),
    country: z.string(),
    isNigerian: z.boolean()
  }),
  category: z.object({
    id: z.number(),
    name: z.string(),
    color: z.string()
  }).nullable()
});

export type ArticleWithDetails = z.infer<typeof articleWithDetailsSchema>;

// For filtering articles
export const articleFilterSchema = z.object({
  categoryIds: z.array(z.number()).optional(),
  sourceIds: z.array(z.number()).optional(),
  sentiments: z.array(z.string()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  searchTerm: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  sortBy: z.enum(["publishedAt", "sentiment", "relevance"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export type ArticleFilter = z.infer<typeof articleFilterSchema>;
