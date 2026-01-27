import Link from 'next/link';
import { useState } from 'react';

import { EditCompanySchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from '@/components/CompanyLogo';
import EditCompanyForm from '@/components/Forms/EditCompanyForm';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

const Company = () => {
  const [showModal, setShowModal] = useState(false);

  const [companyInfo, setCompanyInfo] = useState(() => {
    const currentJobPost = JSON.parse(
      localStorage.getItem('currentJobPost') || '{}',
    );
    const company = currentJobPost?.company || {};

    return {
      name: company.name || '',
      description: company.description || '',
      industry: company.industry || '',
      url: company.url
        ? company.url.startsWith('http')
          ? company.url
          : `https://${company.url}`
        : '',
    };
  });

  const editCompanyDetails = () => {
    setShowModal(true);
  };

  type CompanyStateType = Omit<Company, 'id'>;

  const updateCompanyInfo = (data: CompanyStateType) => {
    setCompanyInfo((prevInfo: CompanyStateType) => ({
      ...prevInfo,
      ...data,
    }));
  };

  return (
    <>
      {showModal ? (
        <EditCompanyForm
          buttonText="Update"
          initialData={companyInfo} // Pass the latest companyInfo as initial data
          schema={EditCompanySchema}
          onClose={() => setShowModal(false)}
          updateCompanyInfo={updateCompanyInfo} // Pass the callback to update the company information
        />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-end mb-4">
            <Button variant="normal" onClick={editCompanyDetails}>
              Edit Company
            </Button>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-4 w-2/3">
              <div className="flex items-center gap-4">
                {companyInfo.url && (
                  <CompanyLogo
                    size="lg"
                    domain={companyInfo.url}
                    companyName={companyInfo.name}
                  />
                )}
                <h2 className="text-2xl">{companyInfo.name}</h2>
              </div>
              <p className="text-muted-foreground mb-8 max-h-[360px] overflow-y-auto">
                {companyInfo.description}
              </p>

              <Link
                target="_blank"
                rel="noreferrer noopener"
                href={companyInfo.url || '#'}
                onClick={(e) => {
                  if (!companyInfo.url) {
                    e.preventDefault();
                  }
                }}
              >
                <Button variant="normal" disabled={!companyInfo.url}>
                  Visit Website
                </Button>
              </Link>
            </div>
            <Card className="w-1/3 h-fit">
              <CardContent className="flex flex-col gap-4">
                <h3 className="mt-4">Website</h3>
                <CardDescription>{companyInfo.url}</CardDescription>
                <hr className="" />
                <h3>Industry</h3>
                <CardDescription>{companyInfo.industry}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Company;
