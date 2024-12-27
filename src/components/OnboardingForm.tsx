// src/components/OnboardingForm.tsx
'use client';

import { useState } from 'react';
import { CompanyInfo } from '@/lib/types';
import { extractCompanyInfo } from '@/lib/api';

// Add props interface to accept initial company data
interface OnboardingFormProps {
  initialCompanyInfo?: CompanyInfo;
  initialThemeColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onSubmit?: (companyInfo: CompanyInfo, themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  }) => void;
}

export default function OnboardingForm({ 
  initialCompanyInfo,
  initialThemeColors,
  onSubmit 
}: OnboardingFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Initialize with props if provided, otherwise use defaults
  const [themeColors, setThemeColors] = useState(initialThemeColors || {
    primary: '#3B82F6', // Default blue color instead of empty string
    secondary: '#E5E7EB', // Default gray color
    accent: '#60A5FA' // Default light blue
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo || {
    company_name: '',
    product_description: '',
    pricing_tiers: [],
    company_mission: '',
    target_audience: ''
  });

  const handleExtract = async () => {
    setLoading(true);
    try {
      // Extract company info
      const data = await extractCompanyInfo(url);
      setCompanyInfo(data);

      // Extract theme colors from website
      const response = await fetch('https://api.firecrawl.dev/v1/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          urls: [url],
          prompt: "Extract the main brand colors used on this website",
          schema: {
            type: "object",
            properties: {
              primary: { type: "string" },
              secondary: { type: "string" },
              accent: { type: "string" }
            }
          }
        })
      });

      const colorData = await response.json();
      const newColors = {
        primary: colorData.data.primary || themeColors.primary,
        secondary: colorData.data.secondary || themeColors.secondary,
        accent: colorData.data.accent || themeColors.accent
      };
      setThemeColors(newColors);
      // Immediately notify parent of color changes
      if (onSubmit) {
        onSubmit(data, newColors);
      }
    } catch (error) {
      console.error('Error extracting data:', error);
    }
    setLoading(false);
  };

  // Generate dynamic styles based on theme colors

  const focusRingStyle = `focus:ring-[${themeColors.accent}]`;
  const borderStyle = `border-[${themeColors.secondary}]`;

  // Handle form submission and color changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(companyInfo, themeColors);
    }
  };

  // Handle color changes and notify parent immediately
  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    const newColors = { ...themeColors, [colorType]: value };
    setThemeColors(newColors);
    if (onSubmit) {
      onSubmit(companyInfo, newColors);
    }
  };

  return (
    // Main container with glass morphism effect
    <div className={`max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border ${borderStyle}`}>
      {/* Debug theme colors */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm text-black">
        <p>Primary: {themeColors.primary}</p>
        <p>Secondary: {themeColors.secondary}</p>
        <p>Accent: {themeColors.accent}</p>
        <p>{buttonStyle}</p>
      </div> */}

      

      {/* URL Input Section with enhanced styling */}
      <div className={`mb-8 p-4 bg-white rounded-lg shadow-md border ${borderStyle}`}>
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL"
            className={`flex-1 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none bg-white shadow-inner`}
          />
          <button
            onClick={handleExtract}
            disabled={loading}
            className={`px-6 py-3 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 bg-[${themeColors.primary}] hover:bg-[${themeColors.primary}]/80`}
          >
            {loading ? 'Loading...' : 'Auto-fill'}
          </button>
        </div>
      </div>

      {/* Company Information Form with improved contrast and spacing */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Theme Colors Section */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Primary Color</label> 
            <input
              type="color"
              value={themeColors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-full h-12 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Secondary Color</label>
            <input
              type="color"
              value={themeColors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="w-full h-12 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Accent Color</label>
            <input
              type="color"
              value={themeColors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="w-full h-12 rounded cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Company Name</label>
          <input
            type="text"
            value={companyInfo.company_name}
            onChange={(e) => setCompanyInfo({...companyInfo, company_name: e.target.value})}
            className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none bg-white shadow-inner`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Product Description</label>
          <textarea
            value={companyInfo.product_description}
            onChange={(e) => setCompanyInfo({...companyInfo, product_description: e.target.value})}
            className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none bg-white shadow-inner h-32 resize-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Company Mission</label>
          <textarea
            value={companyInfo.company_mission}
            onChange={(e) => setCompanyInfo({...companyInfo, company_mission: e.target.value})}
            className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none bg-white shadow-inner h-32 resize-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Target Audience</label>
          <input
            type="text"
            value={companyInfo.target_audience}
            onChange={(e) => setCompanyInfo({...companyInfo, target_audience: e.target.value})}
            className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none bg-white shadow-inner`}
          />
        </div>

        {/* Pricing Tiers Section with enhanced card styling */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-4">Pricing Tiers</label>
          {companyInfo.pricing_tiers.map((tier, index) => (
            <div key={index} className={`mb-4 p-6 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow ${borderStyle}`}>
              <input
                type="text"
                value={tier.name}
                placeholder="Tier Name"
                onChange={(e) => {
                  const newTiers = [...companyInfo.pricing_tiers];
                  newTiers[index].name = e.target.value;
                  setCompanyInfo({...companyInfo, pricing_tiers: newTiers});
                }}
                className={`mb-3 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none shadow-inner`}
              />
              <input
                type="text"
                value={tier.price}
                placeholder="Price"
                onChange={(e) => {
                  const newTiers = [...companyInfo.pricing_tiers];
                  newTiers[index].price = e.target.value;
                  setCompanyInfo({...companyInfo, pricing_tiers: newTiers});
                }}
                className={`w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 ${focusRingStyle} focus:border-transparent outline-none shadow-inner`}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`w-full px-6 py-4 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 bg-[${themeColors.primary}] hover:bg-[${themeColors.primary}]/80`}
        >
          Complete Onboarding
        </button>
      </form>
    </div>
  );
}