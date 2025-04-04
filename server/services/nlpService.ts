import { storage } from "../storage";

// Simple sentiment analysis
export async function analyzeSentiment(text: string): Promise<{ label: string; score: number }> {
  // In production, we'd use a proper NLP library like Natural or a cloud API
  // For this demo, we'll use a simple keyword-based approach
  
  const positiveWords = [
    "good", "great", "excellent", "positive", "success", "successful", 
    "rescued", "saved", "recovered", "found", "resolved", "arrested",
    "captured", "justice", "solve", "solved", "conviction"
  ];
  
  const negativeWords = [
    "bad", "terrible", "horrible", "negative", "failure", "crime", "criminal",
    "murder", "killed", "dead", "injured", "stolen", "robbery", "attack",
    "fraud", "corruption", "kidnap", "kidnapped", "victim", "violence"
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  // Calculate sentiment score (-100 to 100)
  const totalSentimentWords = positiveCount + negativeCount;
  let score = 0;
  
  if (totalSentimentWords > 0) {
    // Score from -100 (all negative) to 100 (all positive)
    score = Math.round(((positiveCount - negativeCount) / totalSentimentWords) * 100);
  }
  
  // Determine sentiment label
  let label = "neutral";
  if (score < -20) label = "negative";
  else if (score > 20) label = "positive";
  
  return { label, score };
}

// Simple crime classification
export async function classifyArticle(title: string, content: string): Promise<{ id: number; name: string } | null> {
  // Get all categories
  const categories = await storage.getCategories();
  
  // Simple keyword-based classification
  const crimeKeywords: Record<string, string[]> = {
    "Murder": ["murder", "kill", "homicide", "manslaughter", "deadly", "stab"],
    "Robbery": ["robbery", "steal", "stole", "theft", "burglary", "loot"],
    "Cybercrime": ["cyber", "hack", "hacker", "phishing", "malware", "ransomware", "online fraud"],
    "Kidnapping": ["kidnap", "abduct", "hostage", "ransom", "missing person"],
    "Fraud": ["fraud", "scam", "embezzle", "ponzi", "fake", "counterfeit"],
    "Drug Trafficking": ["drug", "narcotic", "cocaine", "heroin", "cannabis", "trafficking"],
    "Terrorism": ["terror", "bomb", "explosion", "attack", "extremist", "militant"],
    "Corruption": ["corrupt", "bribe", "graft", "extort", "misappropriation"]
  };
  
  // Combine title and content, giving title more weight
  const text = `${title} ${title} ${content}`.toLowerCase();
  
  // Count keyword matches for each category
  const categoryScores: Record<string, number> = {};
  
  for (const [categoryName, keywords] of Object.entries(crimeKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    categoryScores[categoryName] = score;
  }
  
  // Find the category with the highest score
  let bestCategory = null;
  let highestScore = 0;
  
  for (const [categoryName, score] of Object.entries(categoryScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = categoryName;
    }
  }
  
  // If no clear category or very low score, return null
  if (highestScore < 2 || !bestCategory) {
    return null;
  }
  
  // Find the category ID
  const category = categories.find(cat => cat.name === bestCategory);
  if (!category) return null;
  
  return { id: category.id, name: category.name };
}
