import { useParams } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

const Company = () => {
  const currentJobPost: JobApplication = JSON.parse(
    localStorage.getItem('currentJobPost') || '{}'
  );

  const editCompanyDetails = () => {
    console.log('edit company details');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end mb-4">
        <Button variant="normal" onClick={editCompanyDetails}>
          Edit Company
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-2/3">
          <h2 className="text-2xl">{currentJobPost?.company.name}</h2>
          <p className="text-muted-foreground">
            {currentJobPost?.company.description}
          </p>

          <Link
            target="_blank"
            rel="noreferrer noopener"
            href={currentJobPost?.company.url || '#'}
            onClick={(e) => {
              if (!currentJobPost?.company.url) {
                e.preventDefault();
              }
            }}
          >
            <Button variant="normal" disabled={!currentJobPost?.company.url}>
              Visit Website
            </Button>
          </Link>
        </div>
        <Card className="w-1/3">
          <CardContent className="flex flex-col gap-4">
            <h3 className="mt-4">Website</h3>
            <CardDescription>{currentJobPost?.company.url}</CardDescription>
            <hr className="" />
            <h3>Industry</h3>
            <CardDescription>
              {currentJobPost?.company.industry}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Company;
