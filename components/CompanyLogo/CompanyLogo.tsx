'use client';

import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

import { config } from '@/lib/config';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  domain: string;
  companyName: string;
  logo?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 24, height: 24, iconSize: 16 },
  md: { width: 40, height: 40, iconSize: 24 },
  lg: { width: 64, height: 64, iconSize: 40 },
};

export const CompanyLogo = ({
  domain,
  companyName,
  logo,
  size = 'sm',
  className,
}: CompanyLogoProps) => {
  const [hasError, setHasError] = useState(false);
  const [isBlankImage, setIsBlankImage] = useState(false);
  const [fallbackStage, setFallbackStage] = useState<0 | 1>(0); 
  // 0: Initial (Manual Logo or Brandfetch if no manual)
  // 1: Brandfetch Fallback (if manual fails)
  
  const { width, height, iconSize } = sizeMap[size];

  // Extract domain from URL if needed
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  // Reset error states when domain or companyName changes
  useEffect(() => {
    setHasError(false);
    setIsBlankImage(false);
    setFallbackStage(0);
  }, [cleanDomain, companyName, logo]);

  // Priority Logic:
  // 1. Manual Logo (if stage 0)
  // 2. Brandfetch Dynamic (if stage 1 OR no manual logo provided)
  const brandfetchUrl = `https://cdn.brandfetch.io/${cleanDomain}?c=${config.brandfetch.clientId}`;
  
  let logoUrl: string | undefined = logo || undefined;
  
  // If we are in fallback stage 1, or if a manual logo was never provided, use Brandfetch dynamic
  if (fallbackStage === 1 || !logoUrl) {
    logoUrl = cleanDomain ? brandfetchUrl : undefined;
  }

  const handleNextStage = () => {
    // If the manual logo failed to load, try Brandfetch dynamic
    if (fallbackStage === 0 && logo && cleanDomain) {
      setFallbackStage(1);
    } else {
      // If Brandfetch dynamic failed, or if there's no domain to fall back to
      setHasError(true);
    }
  };

  if (hasError || isBlankImage || (!logoUrl)) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded bg-muted',
          className,
        )}
        style={{ width, height }}
        title={companyName}
      >
        <Building2 size={iconSize} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded',
        className,
      )}
      style={{ width, height }}
    >
      <img
        src={logoUrl}
        loading="lazy"
        alt={`${companyName} logo`}
        title={companyName}
        key={`${cleanDomain}-${companyName}-${fallbackStage}-${logo}`}
        className="object-contain w-full h-full"
        onLoad={(e) => {
          const img = e.currentTarget;
          // Check for small placeholder images (Brandfetch placeholder is often 40x40 but sometimes smaller)
          // If the image is very small, it's likely a bad asset or placeholder.
          if (img.naturalWidth < 16 || img.naturalHeight < 16) {
            handleNextStage();
          }
        }}
        onError={handleNextStage}
      />
    </div>
  );
};

export default CompanyLogo;
