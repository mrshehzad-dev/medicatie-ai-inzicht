
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TreatmentPlan = {
  nr: string;
  intervention: string;
  advantages: string;
  evaluation: string;
  source: string;
};

export const TreatmentPlanSection = ({ 
  treatmentPlan,
  totalFTPs 
}: { 
  treatmentPlan: TreatmentPlan[];
  totalFTPs: number;
}) => {
  if (treatmentPlan.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary">2. Behandelplan</CardTitle>
        <div className="text-sm font-medium mb-2">Totaal aantal FTP's: {totalFTPs}</div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Nr.</TableHead>
              <TableHead>Interventie (middel + dosis)</TableHead>
              <TableHead>Voordelen / Nadelen</TableHead>
              <TableHead>Evaluatie</TableHead>
              <TableHead className="w-20">Bron</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatmentPlan.map((item, index) => (
              <TableRow key={`treatment-${index}`}>
                <TableCell>{item.nr}</TableCell>
                <TableCell>{item.intervention}</TableCell>
                <TableCell>{item.advantages}</TableCell>
                <TableCell>{item.evaluation}</TableCell>
                <TableCell>{item.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
