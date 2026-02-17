
import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

export const searchLeads = async (business: string, location: string): Promise<{ leads: Lead[], markdown: string, sources: any[] }> => {
  // Directly access process.env.API_KEY as per system requirements.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    throw new Error("API_KEY is missing. Action required: 1. Go to Vercel Settings -> Environment Variables. 2. Add 'API_KEY'. 3. Go to Deployments -> Redeploy.");
  }

  // Create instance right before use to ensure the latest key is used
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a Professional Lead Generation and SEO Audit Specialist. 
    Find verified business leads for "${business}" in "${location}".
    
    Provide exactly:
    - Business Name
    - Phone Number
    - Website
    - Email
    - Social Media links
    - 3 specific technical SEO weak points
    - GBP status (Yes/No)

    Output format: Markdown Table.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const markdown = response.text || "";
    const leads = parseMarkdownTable(markdown);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { leads, markdown, sources };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fetch leads from Gemini.");
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
