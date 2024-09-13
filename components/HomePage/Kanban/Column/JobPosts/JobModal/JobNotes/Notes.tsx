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

const Notes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          Change your Notes here. After saving, you will be logged out.
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
  );
};

export default Notes;
