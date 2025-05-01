
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

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
    <Card className="border border-gray-200 shadow-md rounded-lg overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-50 pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-purple-700 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">1</span>
          FTP's
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-12 font-semibold text-gray-700">No.</TableHead>
                <TableHead className="font-semibold text-gray-700">FTP</TableHead>
                <TableHead className="font-semibold text-gray-700">Current medication</TableHead>
                <TableHead className="font-semibold text-gray-700">Relevant data (lab, clinical)</TableHead>
                <TableHead className="font-semibold text-gray-700">STOP/START</TableHead>
                <TableHead className="w-20 font-semibold text-gray-700">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ftps.map((item, index) => (
                <TableRow 
                  key={`ftp-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-purple-50"}
                >
                  <TableCell className="font-medium text-purple-800">{item.nr}</TableCell>
                  <TableCell className="font-medium">{item.ftp}</TableCell>
                  <TableCell>{item.medication}</TableCell>
                  <TableCell>{item.relevantData}</TableCell>
                  <TableCell className="font-medium">{item.action}</TableCell>
                  <TableCell className="text-gray-600">[{item.source}]</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
