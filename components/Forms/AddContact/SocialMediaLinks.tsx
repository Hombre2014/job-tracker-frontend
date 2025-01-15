import Link from 'next/link';
import {
  SlSocialGithub,
  SlSocialTwitter,
  SlSocialFacebook,
  SlSocialLinkedin,
} from 'react-icons/sl';
import { LiaLinkSolid } from 'react-icons/lia';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SocialMediaLinksProps {
  twitterHandle: string;
  gitHubProfile: string;
  linkedinProfile: string;
  facebookProfile: string;
  handleFieldChange: (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const SocialMediaLinks = ({
  twitterHandle,
  gitHubProfile,
  linkedinProfile,
  facebookProfile,
  handleFieldChange,
}: SocialMediaLinksProps) => {
  return (
    <div className="flex flex-col min-w-full mb-4">
      <div className="border rounded-md px-4">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start gap-2 items-center mb-2 mt-4 w-full">
              <SlSocialTwitter
                className={cn('block', twitterHandle !== '' && 'text-blue-500')}
              />
              <Input
                value={twitterHandle}
                placeholder="Twitter handle"
                onChange={(e) => handleFieldChange('twitterHandle', e)}
                className="!outline-none !border-none shadow-none focus-visible:ring-0"
              />
            </div>
            <Link
              target="_blank"
              href={`https://twitter.com/${twitterHandle}`}
              className="text-blue-500 hover:cursor-pointer"
            >
              <LiaLinkSolid
                className={cn('hidden', twitterHandle !== '' && 'block')}
              />
            </Link>
          </div>
          <div className="flex justify-start gap-2 items-center mb-2">
            <SlSocialFacebook
              className={cn('block', facebookProfile !== '' && 'text-blue-500')}
            />
            <Input
              value={facebookProfile}
              placeholder="Facebook profile"
              onChange={(e) => handleFieldChange('facebookProfile', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />
            <Link
              target="_blank"
              href={`https://facebook.com/${facebookProfile}`}
              className="text-blue-500 hover:cursor-pointer"
            >
              <LiaLinkSolid
                className={cn('hidden', facebookProfile !== '' && 'block')}
              />
            </Link>
          </div>
          <div className="flex justify-start gap-2 items-center mb-2">
            <SlSocialLinkedin
              className={cn('block', linkedinProfile !== '' && 'text-blue-500')}
            />
            <Input
              value={linkedinProfile}
              placeholder="LinkedIn profile"
              onChange={(e) => handleFieldChange('linkedinProfile', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />
            <Link
              target="_blank"
              className="text-blue-500 hover:cursor-pointer"
              href={`https://linkedin.com/in/${linkedinProfile}`}
            >
              <LiaLinkSolid
                className={cn('hidden', linkedinProfile !== '' && 'block')}
              />
            </Link>
          </div>
          <div className="flex justify-start gap-2 items-center mb-2">
            <SlSocialGithub
              className={cn('block', gitHubProfile !== '' && 'text-blue-500')}
            />
            <Input
              value={gitHubProfile}
              placeholder="GitHub profile"
              onChange={(e) => handleFieldChange('gitHubProfile', e)}
              className="!outline-none !border-none shadow-none focus-visible:ring-0"
            />
            <Link
              target="_blank"
              href={`https://github.com/${gitHubProfile}`}
              className="text-blue-500 hover:cursor-pointer"
            >
              <LiaLinkSolid
                className={cn('hidden', gitHubProfile !== '' && 'block')}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
