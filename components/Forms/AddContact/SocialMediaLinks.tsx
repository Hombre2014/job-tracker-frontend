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

interface SocialMediaLinksProps {
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  handleFieldChange: (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const SocialMediaLinks = ({
  twitterUrl,
  githubUrl,
  linkedinUrl,
  facebookUrl,
  handleFieldChange,
}: SocialMediaLinksProps) => {
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
                placeholder="Twitter handle"
                onChange={(e) => handleFieldChange('twitterUrl', e)}
                className="!outline-none !border-none shadow-none focus-visible:ring-0"
              />
            </div>
            <Link
              target="_blank"
              href={`https://twitter.com/${twitterUrl}`}
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
              placeholder="Facebook profile"
              onChange={(e) => handleFieldChange('facebookUrl', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />
            <Link
              target="_blank"
              href={`https://facebook.com/${facebookUrl}`}
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
              placeholder="LinkedIn profile"
              onChange={(e) => handleFieldChange('linkedinUrl', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />
            <Link
              target="_blank"
              className="text-blue-500 hover:cursor-pointer"
              href={`https://linkedin.com/in/${linkedinUrl}`}
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
              placeholder="GitHub profile"
              onChange={(e) => handleFieldChange('githubUrl', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />
            <Link
              target="_blank"
              href={`https://github.com/${githubUrl}`}
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
