# CrimeWatch News Aggregator

A comprehensive crime news aggregation platform that scrapes, categorizes, and analyzes articles from 50 websites with a searchable interface. Built as a capstone project for the Nigerian University of Technology And Management (NUTM).

## Project Overview

CrimeWatch News aggregates crime-related news from both Nigerian and international sources, enabling users to stay informed about crime trends, analyze patterns, and understand the broader context of criminal activities.

## Features

- Multi-source News Aggregation: Collects news from 50+ Nigerian and international news sources
- Automated Web Scraping: Regular scraping of news sources to ensure up-to-date content
- Sentiment Analysis: Analyzes the sentiment of each article (positive, neutral, negative)
- Content Categorization: Automatically categorizes articles into crime types
- Advanced Filtering: Filter articles by source, category, sentiment, and date range
- Search Functionality: Full-text search across all aggregated articles
- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Real-time Analytics: View crime statistics and trends based on aggregated data
- Dark Mode Support: Toggle between light and dark themes for better readability

## Tech Stack

- Frontend: React, TypeScript, TanStack Query, Tailwind CSS, Shadcn UI
- Backend: Node.js, Express, Cheerio, Drizzle ORM, Zod
- Tools: Node-cron for scheduling, Archiver for file compression

## Getting Started with VS Code

### Prerequisites

- Node.js (v18 or higher)
- Visual Studio Code

### Setup Instructions

1. Extract the ZIP file to your desired location
2. Open the project in VS Code
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Access the application at http://localhost:5000

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared code between frontend and backend

## License and Attribution

© 2025 Nigerian University of Technology And Management (NUTM). All rights reserved.

Developed by:
- Chibuchi Agu
- Akolo Bulus