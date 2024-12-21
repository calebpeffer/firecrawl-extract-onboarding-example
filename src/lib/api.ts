// src/lib/api.ts
import { CompanyInfo } from './types';

const FIRECRAWL_API_KEY = process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY || '';

export async function extractCompanyInfo(url: string): Promise<CompanyInfo> {

    console.log('Extracting data from URL:', url);

    const response = await fetch('https://api.firecrawl.dev/v1/extract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        },

        // Log the URL for debugging purposes
        body: JSON.stringify({
            urls: [url],
            prompt: "Extract the following information: company name, product description, pricing tiers (including name, price, and features), company mission, target audience, and the main brand colors used on the website (primary, secondary, accent).",
            allowExternalLinks: false,
            schema: {
                type: "object",
                properties: {
                    company_name: { type: "string" },
                    product_description: { type: "string" },
                    pricing_tiers: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                price: { type: "string" },
                                features: { type: "array", items: { type: "string" } }
                            }
                        }
                    },
                    company_mission: { type: "string" },
                    target_audience: { type: "string" },
                    // Add theme colors to schema
                    theme_colors: {
                        type: "object",
                        properties: {
                            primary: { type: "string" },
                            secondary: { type: "string" },
                            accent: { type: "string" }
                        }
                    }
                },
                required: ["company_name", "product_description", "pricing_tiers", "company_mission", "target_audience", "theme_colors"]
            }
        })

    });

    const data = await response.json();
    // Log the raw response for debugging
    console.log('API Response:', JSON.stringify(data, null, 2));
    return data.data;
}