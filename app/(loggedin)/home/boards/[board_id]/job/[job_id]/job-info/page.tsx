'use client';

import { useEffect } from 'react';
import { PiUsers } from 'react-icons/pi';
import { useParams } from 'next/navigation';
import { RxInfoCircled } from 'react-icons/rx';
import { IoDocumentsOutline } from 'react-icons/io5';
import { SlNotebook, SlBriefcase } from 'react-icons/sl';

import Modal from '@/components/Misc/Modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const JobDetails = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();

  // TODO: Get the job details

  useEffect(() => {
    dispatch(getAllJobPostsPerColumn(job_id));
  }, [dispatch, job_id]);

  return (
    <Modal stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="mt-8 mx-4 text-xl font-bold">
            Full Stack Web Developer
          </CardTitle>
          <CardDescription className="mx-4 mt-8 pb-12">Amazon</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Job Info" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="Job Info">
                <RxInfoCircled className="h-5 w-5 mr-2" />
                Job Info
              </TabsTrigger>
              <TabsTrigger value="Notes">
                <SlNotebook className="h-5 w-5 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="Contacts">
                <PiUsers className="h-5 w-5 mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="Documents">
                <IoDocumentsOutline className="h-5 w-5 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="Company">
                <SlBriefcase className="h-5 w-5 mr-2" />
                Company
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Job Info">
              <Card>
                <CardHeader>
                  <CardTitle>Job Info</CardTitle>
                  <CardDescription>
                    Make changes to your Job Info here. Click save when you're
                    done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@peduarte" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>
                    Change your Notes here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current Notes</Label>
                    <Input id="current" type="Notes" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New Notes</Label>
                    <Input id="new" type="Notes" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Notes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>
                    Change your Contacts here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current Contacts</Label>
                    <Input id="current" type="Contacts" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New Contacts</Label>
                    <Input id="new" type="Contacts" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Contacts</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Change your Documents here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current Documents</Label>
                    <Input id="current" type="Documents" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New Documents</Label>
                    <Input id="new" type="Documents" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Documents</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Company">
              <Card>
                <CardHeader>
                  <CardTitle>Company</CardTitle>
                  <CardDescription>
                    Change your Company here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current Company</Label>
                    <Input id="current" type="Company" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New Company</Label>
                    <Input id="new" type="Company" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Company</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default JobDetails;
