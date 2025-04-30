
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FTP = {
  nr: string;
  ftp: string;
  medication: string;
  relevantData: string;
  action: string;
  source: string;
};

export const FTPSection = ({ ftps }: { ftps: FTP[] }) => {
  if (ftps.length === 0) return null;

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900">1. FTP's</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No.</TableHead>
              <TableHead>FTP</TableHead>
              <TableHead>Current medication</TableHead>
              <TableHead>Relevant data (lab, clinical)</TableHead>
              <TableHead>STOP/START</TableHead>
              <TableHead className="w-20">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ftps.map((item, index) => (
              <TableRow key={`ftp-${index}`}>
                <TableCell className="font-medium">{item.nr}</TableCell>
                <TableCell>{item.ftp}</TableCell>
                <TableCell>{item.medication}</TableCell>
                <TableCell>{item.relevantData}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>[{item.source}]</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
