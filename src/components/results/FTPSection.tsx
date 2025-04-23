
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary">1. FTP's</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Nr.</TableHead>
              <TableHead>FTP</TableHead>
              <TableHead>Actuele medicatie</TableHead>
              <TableHead>Relevante data (lab, klinisch)</TableHead>
              <TableHead>STOP/START</TableHead>
              <TableHead className="w-20">Bron</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ftps.map((item, index) => (
              <TableRow key={`ftp-${index}`}>
                <TableCell>{item.nr}</TableCell>
                <TableCell>{item.ftp}</TableCell>
                <TableCell>{item.medication}</TableCell>
                <TableCell>{item.relevantData}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{item.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
