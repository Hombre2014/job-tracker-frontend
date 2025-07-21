import Link from 'next/link';
import { LiaLinkSolid } from 'react-icons/lia';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  SlSocialGithub,
  SlSocialTwitter,
  SlSocialFacebook,
  SlSocialLinkedin,
} from 'react-icons/sl';

const SocialMediaLinks = ({
  twitterUrl,
  githubUrl,
  linkedinUrl,
  facebookUrl,
  handleFieldChange,
}: SocialMediaLinksProps) => {
  // Helper function to construct full URLs from handles
  const getFullUrl = (handle: string, platform: string) => {
    if (!handle || handle.trim() === '') return '#';

    const cleanHandle = handle.trim();

    switch (platform) {
      case 'github':
        return `https://github.com/${cleanHandle}`;
      case 'twitter':
        return `https://twitter.com/${cleanHandle}`;
      case 'facebook':
        return `https://facebook.com/${cleanHandle}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanHandle}`;
      default:
        return '#';
    }
  };

  return (
    <div className="flex flex-col min-w-full mb-4">
      <div className="border rounded-md px-4">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start gap-2 items-center mb-2 mt-4 w-full">
              <SlSocialTwitter
                className={cn('block', twitterUrl !== '' && 'text-blue-500')}
              />
              <Input
                value={twitterUrl}
                placeholder="Twitter URL"
                onChange={(e) => handleFieldChange('twitterUrl', e)}
                className="!outline-none !border-none shadow-none focus-visible:ring-0"
              />
            </div>{' '}
            <Link
              target="_blank"
              href={getFullUrl(twitterUrl, 'twitter')}
              className="text-blue-500 hover:cursor-pointer"
            >
              <LiaLinkSolid
                className={cn('hidden', twitterUrl !== '' && 'block')}
              />
            </Link>
          </div>
          <div className="flex justify-start gap-2 items-center mb-2">
            <SlSocialFacebook
              className={cn('block', facebookUrl !== '' && 'text-blue-500')}
            />
            <Input
              value={facebookUrl}
              placeholder="Facebook URL"
              onChange={(e) => handleFieldChange('facebookUrl', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />{' '}
            <Link
              target="_blank"
              href={getFullUrl(facebookUrl, 'facebook')}
              className="text-blue-500 hover:cursor-pointer"
            >
              <LiaLinkSolid
                className={cn('hidden', facebookUrl !== '' && 'block')}
              />
            </Link>
          </div>
          <div className="flex justify-start gap-2 items-center mb-2">
            <SlSocialLinkedin
              className={cn('block', linkedinUrl !== '' && 'text-blue-500')}
            />
            <Input
              value={linkedinUrl}
              placeholder="LinkedIn URL"
              onChange={(e) => handleFieldChange('linkedinUrl', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />{' '}
            <Link
              target="_blank"
              className="text-blue-500 hover:cursor-pointer"
              href={getFullUrl(linkedinUrl, 'linkedin')}
            >
              <LiaLinkSolid
                className={cn('hidden', linkedinUrl !== '' && 'block')}
              />
            </Link>
          </div>
          <div className="flex justify-start gap-2 items-center mb-2">
            <SlSocialGithub
              className={cn('block', githubUrl !== '' && 'text-blue-500')}
            />
            <Input
              value={githubUrl}
              placeholder="GitHub URL"
              onChange={(e) => handleFieldChange('githubUrl', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />{' '}
            <Link
              target="_blank"
              href={getFullUrl(githubUrl, 'github')}
              className="text-blue-500 hover:cursor-pointer"
            >
              <LiaLinkSolid
                className={cn('hidden', githubUrl !== '' && 'block')}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
