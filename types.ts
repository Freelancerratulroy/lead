
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
