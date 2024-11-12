import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatMySqlToBrDate } from "./utils";

type HistoryLog = {
  id: number;
  action: string;
  date: string;
  state: string;
  description: string;
};

type HistoryTableProps = {
  logs: HistoryLog[];
  onRetry: (logId: number) => void;
  onHold: (docId: number, logId: number) => void;
  onDiscard: (docId: number, logId: number) => void;
};

const stateTranslations: { [key: string]: string } = {
  success: "Sucesso!",
  failure: "Falha",
  conflict: "Conflito",
  pending: "Pendente",
  processing: "Em processamento",
  // Adicione outros estados conforme necessário
};

export default function HistoryTable({
  logs,
  onRetry,
  onHold,
  onDiscard,
}: HistoryTableProps) {
  const sortedLogs = logs.sort((a, b) => {
    const dateComparison =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return a.action.localeCompare(b.action);
  });

  function extractId(text: string) {
    const match = text.match(/\{(\d+)\}/);
    return match ? parseInt(match[1], 10) : null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ação</TableHead>
          <TableHead>Data e Hora</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Controles</TableHead>
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
                    <TableCell colSpan={5} className="text-left font-bold">
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
                <TableCell>{formatMySqlToBrDate(log.date)}</TableCell>
                <TableCell>
                  {stateTranslations[log.state] || log.state}
                </TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>
                  {log.state === "failure" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(log.id)}
                    >
                      Tentar Enviar Novamente
                    </Button>
                  )}
                  {log.state === "conflict" && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onHold(extractId(log.description)!, log.id)
                        }
                      >
                        Manter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onDiscard(extractId(log.description)!, log.id)
                        }
                      >
                        Excluir
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
