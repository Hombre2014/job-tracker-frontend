'use client';

import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

import { config } from '@/lib/config';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  domain: string;
  companyName: string;
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
  size = 'sm',
  className,
}: CompanyLogoProps) => {
  const [hasError, setHasError] = useState(false);
  const [isBlankImage, setIsBlankImage] = useState(false);
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
  }, [cleanDomain, companyName]);

  const logoUrl = `https://cdn.brandfetch.io/${cleanDomain}?c=${config.brandfetch.clientId}`;

  if (hasError || isBlankImage || !cleanDomain) {
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
        key={`${cleanDomain}-${companyName}`}
        className="object-contain w-full h-full"
        onLoad={(e) => {
          const img = e.currentTarget;

          // Check if image is suspiciously small (likely a placeholder or low-quality)
          // Brandfetch often returns small placeholder images (e.g., 40x40) for unavailable logos
          if (img.naturalWidth < 60 || img.naturalHeight < 60) {
            setIsBlankImage(true);
          }
        }}
        onError={() => {
          setHasError(true);
        }}
      />
    </div>
  );
};

export default CompanyLogo;
