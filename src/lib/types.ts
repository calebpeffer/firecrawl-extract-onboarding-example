// src/lib/types.ts
export interface CompanyInfo {
    company_name: string;
    product_description: string;
    pricing_tiers: {
      name: string;
      price: string;
      features: string[];
    }[];
    company_mission: string;
    target_audience: string;
  }