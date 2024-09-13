import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Company = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company</CardTitle>
        <CardDescription>
          Change your Company here. After saving, you will be logged out.
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
  );
};

export default Company;
