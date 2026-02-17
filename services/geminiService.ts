
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, HTMLAnalysis, EditableField, HTMLVisResult } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseGeminiError = (error: any): string => {
  console.error("Gemini API Error:", error);
  return error?.message || "An error occurred during AI processing.";
};

/**
 * Searches for leads using Gemini 3 Flash with Google Search grounding.
 */
export const searchLeads = async (business: string, location: string): Promise<{ leads: Lead[], markdown: string, sources: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 20-30 real businesses of type "${business}" in "${location}". 
      Return the data in a clean Markdown table with columns: Business Name, Phone, Website, Email, Social Media, SEO Weak Points (comma separated), GBP Status.`,
      config: {
        systemInstruction: "You are a Professional Lead Generation and SEO Audit Specialist. Use real-time data to find current business information.",
        tools: [{ googleSearch: {} }]
      }
    });

    const markdown = response.text || "";
    const leads = parseMarkdownTable(markdown);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { leads, markdown, sources };
  } catch (error) {
    throw new Error(parseGeminiError(error));
  }
};

/**
 * HTML VIS: Analyzes pasted HTML to identify editable components.
 */
export const analyzeHTMLCode = async (html: string): Promise<HTMLAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this HTML code and identify all editable text blocks, image URLs, links (hrefs), primary colors, and font families. 
      HTML Code: ${html}`,
      config: {
        systemInstruction: "You are an expert Frontend Designer. Identify the key visual components of the HTML for a user-friendly editor.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            fields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['text', 'image', 'link', 'color', 'font'] },
                  label: { type: Type.STRING },
                  currentValue: { type: Type.STRING },
                  selector: { type: Type.STRING }
                },
                required: ['id', 'type', 'label', 'currentValue', 'selector']
              }
            }
          },
          required: ['title', 'description', 'fields']
        }
      }
    });

    return JSON.parse(response.text || "{}") as HTMLAnalysis;
  } catch (error) {
    throw new Error(parseGeminiError(error));
  }
};

/**
 * HTML VIS: Applies changes to the HTML based on visual editor inputs or chat instructions.
 */
export const updateHTMLCode = async (html: string, instruction: string): Promise<HTMLVisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Original HTML: \n${html}\n\nRequested Modification: ${instruction}`,
      config: {
        systemInstruction: `You are an expert Frontend Developer. 
        Apply the user's modifications to the HTML/CSS while keeping the original structure, responsiveness, and design integrity intact. 
        If images or links are updated, ensure they are valid. 
        If styling is updated, use inline CSS or update the internal <style> block. 
        Return ONLY a JSON object with the new code and a brief explanation.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ['code', 'explanation']
        }
      }
    });

    return JSON.parse(response.text || "{}") as HTMLVisResult;
  } catch (error) {
    throw new Error(parseGeminiError(error));
  }
};

const parseMarkdownTable = (markdown: string): Lead[] => {
  const lines = markdown.trim().split('\n');
  const leads: Lead[] = [];
  const tableStartIndex = lines.findIndex(line => line.includes('|') && line.includes('---'));
  if (tableStartIndex === -1) return [];
  const dataLines = lines.slice(tableStartIndex + 1);

  dataLines.forEach((line, index) => {
    const cols = line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
    if (cols.length >= 7) {
      leads.push({
        id: `lead-${index}-${Date.now()}`,
        businessName: cols[0] || "N/A",
        phone: cols[1] || "N/A",
        website: cols[2] || "N/A",
        email: cols[3] || "N/A",
        socialMedia: cols[4] || "N/A",
        seoWeakPoints: (cols[5] || "").split(',').map(s => s.trim()).filter(s => s !== ""),
        businessStatus: cols[6] || "N/A"
      });
    }
  });
  return leads;
};
