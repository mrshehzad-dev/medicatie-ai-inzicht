
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ConditionGuideline = {
  condition: string;
  guideline: string;
  deviation: string;
};

export const ConditionGuidelinesSection = ({ guidelines }: { guidelines: ConditionGuideline[] }) => {
  if (guidelines.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary">3. Aandoening ↔ Richtlijn</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aandoening</TableHead>
              <TableHead>Richtlijn­behandeling</TableHead>
              <TableHead>Afwijking & reden</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guidelines.map((item, index) => (
              <TableRow key={`condition-${index}`}>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.guideline}</TableCell>
                <TableCell>{item.deviation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
