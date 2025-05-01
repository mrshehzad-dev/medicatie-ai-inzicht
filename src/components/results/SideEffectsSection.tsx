
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SideEffect = {
  sideEffect: string;
  medications: string;
  timeline: string;
  alternativeCauses: string;
  monitoring: string;
  source: string;
};

export const SideEffectsSection = ({ sideEffects }: { sideEffects: SideEffect[] }) => {
  if (sideEffects.length === 0) return null;

  return (
    <Card className="border border-gray-200 shadow-md rounded-lg overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-50 pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-amber-700 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">4</span>
          Bijwerkingenanalyse (BATM)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">Bijwerking</TableHead>
                <TableHead className="font-semibold text-gray-700">Mogelijke middelen</TableHead>
                <TableHead className="font-semibold text-gray-700">Tijdsbeloop</TableHead>
                <TableHead className="font-semibold text-gray-700">Alternatieve oorzaken</TableHead>
                <TableHead className="font-semibold text-gray-700">Monitoring</TableHead>
                <TableHead className="w-20 font-semibold text-gray-700">Bron</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sideEffects.map((item, index) => (
                <TableRow 
                  key={`side-effect-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-amber-50"}
                >
                  <TableCell className="font-medium text-amber-800">{item.sideEffect}</TableCell>
                  <TableCell>{item.medications}</TableCell>
                  <TableCell>{item.timeline}</TableCell>
                  <TableCell>{item.alternativeCauses}</TableCell>
                  <TableCell>{item.monitoring}</TableCell>
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
