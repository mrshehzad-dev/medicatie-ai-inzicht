
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="border border-gray-200 shadow-md rounded-lg overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-50 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-blue-700 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">2</span>
            Behandelplan
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            Totaal FTP's: {totalFTPs}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-12 font-semibold text-gray-700">Nr.</TableHead>
                <TableHead className="font-semibold text-gray-700">Interventie (middel + dosis)</TableHead>
                <TableHead className="font-semibold text-gray-700">Voordelen / Nadelen</TableHead>
                <TableHead className="font-semibold text-gray-700">Evaluatie</TableHead>
                <TableHead className="w-20 font-semibold text-gray-700">Bron</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatmentPlan.map((item, index) => (
                <TableRow 
                  key={`treatment-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <TableCell className="font-medium text-blue-800">{item.nr}</TableCell>
                  <TableCell className="font-medium">{item.intervention}</TableCell>
                  <TableCell>{item.advantages}</TableCell>
                  <TableCell>{item.evaluation}</TableCell>
                  <TableCell className="text-gray-600">{item.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
