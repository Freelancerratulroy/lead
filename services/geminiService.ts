
import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

export const searchLeads = async (business: string, location: string): Promise<{ leads: Lead[], markdown: string, sources: any[] }> => {
  // Strictly use process.env.API_KEY as per the platform requirements.
  // Vercel will inject this automatically if set in Environment Variables.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please ensure you have set 'API_KEY' in your Vercel Environment Variables and Redeployed.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a Professional Lead Generation and SEO Audit Specialist. 
    Your goal is to provide high-quality, verified business leads for "${business}" in "${location}".
    
    TASK: Research and provide a list of verified business leads in a clean Markdown Table.
    
    For each lead, include:
    1. Business Name
    2. Phone Number
    3. Website URL
    4. Email Address
    5. Social Media Links
    6. 3 Technical SEO Weak Points (e.g., No Meta Tags, Missing Alt Text, Poor Page Speed)
    7. GBP Status (Does it have a Google Business Profile?)

    Format ONLY as a Markdown Table:
    | Business Name | Phone | Website | Email | Social Media | SEO Weak Points | GBP Status |
    |---------------|-------|---------|-------|--------------|-----------------|------------|
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const markdown = response.text || "";
    const leads = parseMarkdownTable(markdown);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { leads, markdown, sources };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unexpected error occurred while fetching leads.");
  }
};

const parseMarkdownTable = (markdown: string): Lead[] => {
  const lines = markdown.trim().split('\n');
  const leads: Lead[] = [];
  
  const tableStartIndex = lines.findIndex(line => line.includes('|') && line.includes('---'));
  if (tableStartIndex === -1) return [];

  const dataLines = lines.slice(tableStartIndex + 1);

  dataLines.forEach((line, index) => {
    if (line.trim() && line.includes('|')) {
      const cols = line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);

      if (cols.length >= 7) {
        leads.push({
          id: `lead-${index}-${Date.now()}`,
          businessName: cols[0] || "N/A",
          phone: cols[1] || "N/A",
          website: cols[2] || "N/A",
          email: cols[3] || "N/A",
          socialMedia: cols[4] || "N/A",
          seoWeakPoints: (cols[5] || "").split(',').map(s => s.trim()).filter(s => s !== "" && s !== "-"),
          businessStatus: cols[6] || "N/A"
        });
      }
    }
  });

  return leads;
};
