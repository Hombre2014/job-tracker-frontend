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

  // Reset error state when domain changes
  useEffect(() => {
    setHasError(false);
    setIsBlankImage(false);
  }, [cleanDomain]);

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
        alt={`${companyName} logo`}
        className="object-contain w-full h-full"
        onLoad={(e) => {
          const img = e.currentTarget;
          console.log(
            'CompanyLogo: Image loaded for',
            companyName,
            'dimensions:',
            img.naturalWidth,
            'x',
            img.naturalHeight,
          );

          // Check if image is suspiciously small (likely a placeholder)
          if (img.naturalWidth < 10 || img.naturalHeight < 10) {
            console.log(
              'CompanyLogo: Image too small, treating as blank for',
              companyName,
            );
            setIsBlankImage(true);
            return;
          }

          // Additional check: detect if image is effectively blank by checking if it's too uniform
          // Very small images from Brandfetch are usually placeholders
          if (img.naturalWidth <= 50 && img.naturalHeight <= 50) {
            console.log(
              'CompanyLogo: Image dimensions suggest placeholder for',
              companyName,
            );
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
