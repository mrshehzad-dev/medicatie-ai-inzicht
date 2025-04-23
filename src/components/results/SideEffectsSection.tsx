
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary">4. Bijwerkingenanalyse (BATM)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bijwerking</TableHead>
              <TableHead>Mogelijke middelen</TableHead>
              <TableHead>Tijdsbeloop</TableHead>
              <TableHead>Alternatieve oorzaken</TableHead>
              <TableHead>Monitoring</TableHead>
              <TableHead className="w-20">Bron</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sideEffects.map((item, index) => (
              <TableRow key={`side-effect-${index}`}>
                <TableCell>{item.sideEffect}</TableCell>
                <TableCell>{item.medications}</TableCell>
                <TableCell>{item.timeline}</TableCell>
                <TableCell>{item.alternativeCauses}</TableCell>
                <TableCell>{item.monitoring}</TableCell>
                <TableCell>{item.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
