import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMySqlToBrDate } from "./utils";

type Log = {
  id: number;
  action: string;
  date: string;
  state?: string;
  description: string;
};

type LogTableProps = {
  logs: Log[];
};

export default function LogTable({ logs }: LogTableProps) {
  // Ordena os logs por data (mais recentes primeiro) e ação
  const sortedLogs = logs.sort((a, b) => {
    const dateComparison =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return a.action.localeCompare(b.action);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ação</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data e Hora</TableHead>
          <TableHead>Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLogs.map((log, index, logsArray) => {
          const previousLog = logsArray[index - 1];
          const isNewDay =
            !previousLog ||
            new Date(log.date).toDateString() !==
              new Date(previousLog.date).toDateString();

          return (
            <Fragment key={log.id}>
              {isNewDay && (
                <>
                  {index !== 0 && <tr className="h-4" />}
                  <TableRow>
                    <TableCell colSpan={4} className="text-left font-bold">
                      {new Date(log.date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                </>
              )}
              <TableRow>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.state || "Sucesso!"}</TableCell>
                <TableCell>{formatMySqlToBrDate(log.date)}</TableCell>
                <TableCell>{log.description}</TableCell>
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
