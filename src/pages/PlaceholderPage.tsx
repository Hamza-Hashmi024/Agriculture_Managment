
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">This section is coming soon</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title} Module</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The {title} module is currently under development. This will include comprehensive 
            functionality for managing {title.toLowerCase()} in your business system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
