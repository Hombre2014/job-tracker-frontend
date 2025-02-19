import Link from 'next/link';
import { useState } from 'react';

import { EditCompanySchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import EditCompanyForm from '@/components/Forms/EditCompanyForm';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

const Company = () => {
  const [showModal, setShowModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(() => {
    const currentJobPost = JSON.parse(
      localStorage.getItem('currentJobPost') || '{}'
    );
    return currentJobPost?.company || {};
  });

  const editCompanyDetails = () => {
    setShowModal(true);
  };

  const updateCompanyInfo = (data: Company) => {
    setCompanyInfo((prevInfo: Company) => ({
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
              <h2 className="text-2xl">{companyInfo.name}</h2>
              <p className="text-muted-foreground mb-8 h-100 overflow-y-auto">
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
