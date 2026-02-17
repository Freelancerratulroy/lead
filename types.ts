
export interface Lead {
  id: string;
  businessName: string;
  phone: string;
  website: string;
  email: string;
  socialMedia: string;
  seoWeakPoints: string[];
  businessStatus: string;
  groundingSources?: Array<{ title: string; uri: string }>;
}

export interface LeadSearchFilters {
  targetBusiness: string;
  targetLocation: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// HTML VIS Types
export interface EditableField {
  id: string;
  type: 'text' | 'image' | 'link' | 'color' | 'font';
  label: string;
  currentValue: string;
  selector: string; // Describes the element (e.g., "hero heading", "main logo")
}

export interface HTMLAnalysis {
  fields: EditableField[];
  title: string;
  description: string;
}

export interface HTMLVisResult {
  code: string;
  explanation: string;
}
