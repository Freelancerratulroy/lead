
import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

// The API key is obtained from the environment variable as per requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchLeads = async (business: string, location: string): Promise<{ leads: Lead[], markdown: string, sources: any[] }> => {
  const prompt = `
    Act as a Professional Lead Generation and SEO Audit Specialist. 
    Your goal is to provide high-quality, verified business leads for "${business}" in "${location}".
    
    TASK: Use Google Search to find a detailed list of up to 80 potential clients. 
    Provide as many as possible (at least 20-30 in a single turn).
    
    For each lead, you must research and provide:
    1. Business Name: Official name.
    2. Phone Number: Direct contact number.
    3. Website: Full URL.
    4. Email Address: Professional or business email.
    5. Social Media: Links to Facebook/LinkedIn/Instagram.
    6. SEO Weak Points: Identify at least 3 technical SEO issues (e.g., No Meta Tags, Missing Alt Text, Poor Page Speed, No Schema Markup, or Non-Responsive Design).
    7. Business Status: Mention if they have a Google Business Profile (GBP) or not.

    FORMATTING RULE: 
    - Provide the output in a clean Markdown Table format.
    - If any data is not publicly available, mark it as "N/A".
    - Ensure the data is current by using your search grounding capabilities.

    | Business Name | Phone | Website | Email | Social Media | SEO Weak Points | GBP Status |
    |---------------|-------|---------|-------|--------------|-----------------|------------|
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        // Only Google Search grounding is allowed with gemini-3-pro-preview
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const markdown = response.text || "";
    const leads = parseMarkdownTable(markdown);
    
    // Extracting potential sources from grounding metadata if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { leads, markdown, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const parseMarkdownTable = (markdown: string): Lead[] => {
  const lines = markdown.trim().split('\n');
  const leads: Lead[] = [];
  
  const tableStartIndex = lines.findIndex(line => line.includes('|') && line.includes('---'));
  if (tableStartIndex === -1) return [];

  const dataLines = lines.slice(tableStartIndex + 1);

  dataLines.forEach((line, index) => {
    // Check if it's a valid data row (contains pipes and isn't just whitespace)
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
