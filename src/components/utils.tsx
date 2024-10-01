import { Category } from "@/types/GlobalTypes";

export const foldersToAcess = {
  financeiro: [
    "boletos",
    "notasFiscais",
    "recibos",
    "contratos",
    "ordensServico",
  ],
  documentosTecnicos: [
    "laudosPCMSO",
    "laudosPGR",
    "laudosLTCAT",
    "laudosDiversos",
  ],
  faturamento: ["relatorioFaturamento"],
  esocial: [
    "relatorioEventoS2240",
    "relatorioEventoS2220",
    "relatorioEventoS2210",
  ],
  vendas: ["contratos", "ordensServico"], // poder vir do db
} as { [key: string]: string[] };

export const folderFormat = {
  boletos: "Boletos",
  notasFiscais: "Notas Fiscais",
  recibos: "Recibos",
  laudosPCMSO: "Laudos PCMSO",
  laudosPGR: "Laudos PGR",
  laudosLTCAT: "Laudos LTCAT",
  laudosDiversos: "Laudos Diversos",
  relatorioFaturamento: "Relatório de Faturamento",
  relatorioEventoS2240: "Relatório Evento S-2240",
  relatorioEventoS2220: "Relatório Evento S-2220",
  relatorioEventoS2210: "Relatório Evento S-2210",
  contratos: "Contratos",
  ordensServico: "Ordens de Serviço",
} as { [key: string]: string };

export const folderUpFoldersFormat = {
  financeiro: "Financeiro",
  documentosTecnicos: "Documentos Tecnicos",
  faturamento: "Faturamento",
  esocial: "E-social",
  vendas: "Vendas",
} as { [key: string]: string };

export const categoriesVoid = [
  {
    name: "Financeiro",
    contents: [],
  },
  {
    name: "Documentos tecnicos",
    contents: [],
  },
  {
    name: "Exames",
    contents: [],
  },
  {
    name: "Faturamento",
    contents: [],
  },
  {
    name: "E-social",
    contents: [],
  },
  {
    name: "Vendas",
    contents: [],
  },
] as Category[];

export const folderFatherFormat = {
  boletos: "financeiro",
  notasFiscais: "financeiro",
  recibos: "financeiro",
  laudosPCMSO: "documentosTecnicos",
  laudosPGR: "documentosTecnicos",
  laudosLTCAT: "documentosTecnicos",
  laudosDiversos: "documentosTecnicos",
  relatorioFaturamento: "faturamento",
  relatorioEventoS2240: "esocial",
  relatorioEventoS2220: "esocial",
  relatorioEventoS2210: "esocial",
  contratos: "vendas",
  ordensServico: "vendas",
} as { [key: string]: string };
