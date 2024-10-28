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
  vendas: ["contratos", "ordensServico"],
  all: [
    "boletos",
    "notasFiscais",
    "recibos",
    "laudosPCMSO",
    "laudosPGR",
    "laudosLTCAT",
    "laudosDiversos",
    "relatorioFaturamento",
    "relatorioEventoS2240",
    "relatorioEventoS2220",
    "relatorioEventoS2210",
    "contratos",
    "ordensServico",
  ],
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

export const stateFormat = {
  success: "Sucesso!",
  failure: "Falha!",
  conflict: "Conflito!",
} as { [key: string]: string };

export const categoriesDefault = [
  {
    name: "Financeiro",
    contents: [
      {
        name: "Boletos",
        resource: "folder",
        contents: [],
      },
      {
        name: "Notas Fiscais",
        resource: "folder",
        contents: [],
      },
      {
        name: "Recibos",
        resource: "folder",
        contents: [],
      },
    ],
  },
  {
    name: "Documentos tecnicos",
    contents: [
      {
        name: "Laudos PCMSO",
        resource: "folder",
        contents: [],
      },
      { name: "Laudos PGR", resource: "folder", contents: [] },
      { name: "Laudos LTCAT", resource: "folder", contents: [] },
      { name: "Laudos Diversos", resource: "folder", contents: [] },
    ],
  },
  {
    name: "Exames",
    contents: [
      {
        name: "Exames Laboratoriais",
        resource: "folder",
        contents: [],
      },
      {
        name: "Exames Telecardio",
        resource: "folder",
        contents: [],
      },
      {
        name: "Exames Local",
        resource: "folder",
        contents: [],
      },
      {
        name: "Exames Proclinic (Audiometria)",
        resource: "folder",
        contents: [],
      },
      {
        name: "Exames Proclinic (Aso)",
        resource: "folder",
        contents: [],
      },
    ],
  },
  {
    name: "Faturamento",
    contents: [
      {
        name: "Relatório de Faturamento",
        resource: "folder",
        contents: [],
      },
    ],
  },
  {
    name: "E-social",
    contents: [
      { name: "Relatório Evento S-2240", resource: "folder", contents: [] },
      { name: "Relatório Evento S-2220", resource: "folder", contents: [] },
      { name: "Relatório Evento S-2210", resource: "folder", contents: [] },
    ],
  },
  {
    name: "Vendas",
    contents: [
      { name: "Contratos", resource: "folder", contents: [] },
      { name: "Ordens de Serviço", resource: "folder", contents: [] },
    ],
  },
] as Category[];

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
export const formatMySqlToBrDate = (date: string) => {
  const [year, month, day] = date.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const uploadConditions: Record<string, string[]> = {
  Financeiro: ["Boletos", "Notas Fiscais", "Recibos"],
  Faturamento: ["Relatório de Faturamento"],
  "E-social": [
    "Relatório Evento S-2240",
    "Relatório Evento S-2220",
    "Relatório Evento S-2210",
  ],
  Vendas: ["Contratos", "Ordens de Serviço"],
  "Documentos tecnicos": [
    "Laudos PCMSO",
    "Laudos PGR",
    "Laudos LTCAT",
    "Laudos Diversos",
  ],
  Exames: [
    "Exames Laboratoriais",
    "Exames Telecardio",
    "Exames Local",
    "Exames Proclinic (Aso)",
    "Exames Proclinic (Audiometria)",
  ],
};

export const isUploadArea = (
  category: string | null,
  path: string | string[]
): boolean => {
  if (!category) return false;
  return (
    uploadConditions[category]?.some((condition) => path.includes(condition)) ||
    false
  );
};
