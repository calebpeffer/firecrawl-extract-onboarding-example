"use client"
import OnboardingForm from "@/components/OnboardingForm";
import Image from "next/image";
import { useState } from "react";
import { CompanyInfo } from "@/lib/types";

export default function Home() {
  // Track company info and theme colors
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [themeColors, setThemeColors] = useState<{
    primary: string;
    secondary: string;
    accent: string;
  } | null>(null);

  // Handle form submission
  const handleSubmit = (info: CompanyInfo, colors: {
    primary: string;
    secondary: string;
    accent: string;
  }) => {
    setCompanyInfo(info);
    setThemeColors(colors);
  };

  return (
    // Clean white background with subtle gradient
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Onboarding progress indicator */}

      
      <div className="w-full max-w-4xl mx-auto pt-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="relative h-2 bg-gray-100 rounded-full">
              {/* Active progress bar - use theme primary color if available */}
              <div 
                className={`absolute h-2 w-1/3 rounded-full transition-all duration-300 ${
                  themeColors?.primary ? `bg-[${themeColors.primary}]` : 'bg-blue-600'
                }`} 
              />
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <span className={themeColors?.primary ? `text-[${themeColors.primary}] font-semibold` : 'text-blue-600 font-semibold'}>
                Company Info
              </span>
              <span className="text-gray-400">Branding</span>
              <span className="text-gray-400">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Display current theme colors if available */}
      

      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Company Onboarding
        </h1>

        {/* OnboardingForm component with submit handler */}
        <div className="mb-16">
          <OnboardingForm onSubmit={handleSubmit} />
        </div>

        {/* Help section */}
        <div className="space-y-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Need Help?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Image
                src="/file.svg"
                alt="Documentation"
                width={24}
                height={24}
                className="mx-auto mb-4"
              />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-gray-600">
                Find in-depth information about our onboarding process
              </p>
            </a>

            <a
              href="https://vercel.com/templates"
              target="_blank"
              rel="noopener noreferrer" 
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Image
                src="/window.svg"
                alt="Examples"
                width={24}
                height={24}
                className="mx-auto mb-4"
              />
              <h3 className="font-semibold mb-2">Examples</h3>
              <p className="text-sm text-gray-600">
                View example companies and their onboarding
              </p>
            </a>

            <a
              href="mailto:support@example.com"
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1"
            >
              <Image
                src="/globe.svg"
                alt="Support"
                width={24}
                height={24}
                className="mx-auto mb-4"
              />
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-gray-600">
                Get help from our support team
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
