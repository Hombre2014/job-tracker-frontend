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

const Contacts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>
          Change your Contacts here. After saving, you will be logged out.
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
  );
};

export default Contacts;
