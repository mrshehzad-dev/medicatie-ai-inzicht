
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ConditionGuideline = {
  condition: string;
  guideline: string;
  deviation: string;
};

export const ConditionGuidelinesSection = ({ guidelines }: { guidelines: ConditionGuideline[] }) => {
  if (guidelines.length === 0) return null;

  return (
    <Card className="border border-gray-200 shadow-md rounded-lg overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-green-100 to-teal-50 pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-green-700 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">3</span>
          Aandoening ↔ Richtlijn
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">Aandoening</TableHead>
                <TableHead className="font-semibold text-gray-700">Richtlijn­behandeling</TableHead>
                <TableHead className="font-semibold text-gray-700">Afwijking & reden</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guidelines.map((item, index) => (
                <TableRow 
                  key={`condition-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <TableCell className="font-medium text-green-800">{item.condition}</TableCell>
                  <TableCell>{item.guideline}</TableCell>
                  <TableCell>{item.deviation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
