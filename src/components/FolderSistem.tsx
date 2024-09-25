"use client";

import { useState } from "react";
import {
  Search,
  ChevronRight,
  Folder,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface File {
  name: string;
  type: "file";
}

interface Folder {
  name: string;
  type: "folder";
  contents: (File | Folder)[];
}

interface Category {
  name: string;
  contents: Folder[];
}

export default function FolderSistem() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categories: Category[] = [
    {
      name: "Financeiro",
      contents: [
        {
          name: "Boletos",
          type: "folder",
          contents: [
            { name: "Boleto 1", type: "file" },
            { name: "Boleto 2", type: "file" },
            { name: "Boleto carga", type: "file" },
          ],
        },
        {
          name: "Notas Fiscais",
          type: "folder",
          contents: [
            { name: "NF 001", type: "file" },
            { name: "NF 002", type: "file" },
          ],
        },
        {
          name: "Extratos",
          type: "folder",
          contents: [
            { name: "Extrato Janeiro", type: "file" },
            { name: "Extrato Fevereiro", type: "file" },
          ],
        },
      ],
    },
    {
      name: "Documentos tecnicos",
      contents: [
        {
          name: "Manuais",
          type: "folder",
          contents: [
            { name: "Manual Equipamento A", type: "file" },
            { name: "Manual Equipamento B", type: "file" },
          ],
        },
        {
          name: "Projetos",
          type: "folder",
          contents: [
            { name: "Projeto X", type: "file" },
            { name: "Projeto Y", type: "file" },
          ],
        },
        {
          name: "Relatórios",
          type: "folder",
          contents: [
            { name: "Relatório Trimestral", type: "file" },
            { name: "Relatório Anual", type: "file" },
          ],
        },
      ],
    },
    {
      name: "Exames",
      contents: [
        {
          name: "Exames Laboratoriais",
          type: "folder",
          contents: [
            { name: "Hemograma", type: "file" },
            { name: "Glicemia", type: "file" },
          ],
        },
        {
          name: "Exames Telecardio",
          type: "folder",
          contents: [
            { name: "ECG 01", type: "file" },
            { name: "ECG 02", type: "file" },
          ],
        },
        {
          name: "Exames Local",
          type: "folder",
          contents: [
            { name: "Raio-X", type: "file" },
            { name: "Ultrassom", type: "file" },
          ],
        },
        {
          name: "Exames Proclinic (Audiometria)",
          type: "folder",
          contents: [{ name: "Audiometria 2023", type: "file" }],
        },
        {
          name: "Exames Proclinic (Aso)",
          type: "folder",
          contents: [{ name: "ASO 2023", type: "file" }],
        },
      ],
    },
    {
      name: "Treinamentos NRs",
      contents: [
        {
          name: "NR-10",
          type: "folder",
          contents: [
            { name: "Certificado NR-10", type: "file" },
            { name: "Material NR-10", type: "file" },
          ],
        },
        {
          name: "NR-35",
          type: "folder",
          contents: [
            { name: "Certificado NR-35", type: "file" },
            { name: "Material NR-35", type: "file" },
          ],
        },
        {
          name: "NR-33",
          type: "folder",
          contents: [
            { name: "Certificado NR-33", type: "file" },
            { name: "Material NR-33", type: "file" },
          ],
        },
      ],
    },
    {
      name: "Ordem de Serviços",
      contents: [
        {
          name: "Pendentes",
          type: "folder",
          contents: [
            { name: "OS 001", type: "file" },
            { name: "OS 002", type: "file" },
          ],
        },
        {
          name: "Em andamento",
          type: "folder",
          contents: [
            { name: "OS 003", type: "file" },
            { name: "OS 004", type: "file" },
          ],
        },
        {
          name: "Concluídas",
          type: "folder",
          contents: [
            { name: "OS 005", type: "file" },
            { name: "OS 006", type: "file" },
          ],
        },
      ],
    },
    {
      name: "E-social",
      contents: [
        {
          name: "Eventos",
          type: "folder",
          contents: [
            { name: "Evento 1", type: "file" },
            { name: "Evento 2", type: "file" },
          ],
        },
        {
          name: "Relatórios",
          type: "folder",
          contents: [
            { name: "Relatório Mensal", type: "file" },
            { name: "Relatório Anual", type: "file" },
          ],
        },
        {
          name: "Certificados",
          type: "folder",
          contents: [{ name: "Certificado Digital", type: "file" }],
        },
      ],
    },
    {
      name: "Contratos",
      contents: [
        {
          name: "Ativos",
          type: "folder",
          contents: [
            { name: "Contrato A", type: "file" },
            { name: "Contrato B", type: "file" },
          ],
        },
        {
          name: "Arquivados",
          type: "folder",
          contents: [
            { name: "Contrato C", type: "file" },
            { name: "Contrato D", type: "file" },
          ],
        },
        {
          name: "Em negociação",
          type: "folder",
          contents: [
            { name: "Proposta 1", type: "file" },
            { name: "Proposta 2", type: "file" },
          ],
        },
      ],
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
      setActivePath([]);
      return;
    }

    setActiveCategory(categoryName);
    setActivePath([categoryName]);
  };

  const handleItemClick = (item: Folder | File) => {
    if (item.type === "folder") {
      if (item.name === "") {
        setActivePath(activePath.slice(0, -1));
      } else {
        setActivePath([...activePath, item.name]);
      }
    } else {
      console.log("File clicked:", item.name);
    }
  };

  const getCurrentContent = () => {
    let current: (Folder | File)[] | undefined = categories.find(
      (cat) => cat.name === activeCategory
    )?.contents;

    for (const pathItem of activePath.slice(1)) {
      const folder = current?.find(
        (item) => item.type === "folder" && item.name === pathItem
      ) as Folder;
      current = folder?.contents;
    }

    if (activePath.length > 1) {
      current = [
        { name: "", type: "folder", contents: [] },
        ...(current || []),
      ];
    }

    return current || [];
  };

  const searchItems = (items: (Folder | File)[]): (Folder | File)[] => {
    return items.filter((item) => {
      if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      if (item.type === "folder") {
        const matchingContents = searchItems(item.contents);
        if (matchingContents.length > 0) {
          return true;
        }
      }
      return false;
    });
  };

  const renderContent = (content: (Folder | File)[]) => {
    const filteredContent = searchQuery ? searchItems(content) : content;

    return (
      <div className="grid grid-cols-3 gap-4">
        {filteredContent.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {item.type === "folder" ? (
              item.name === "" ? (
                <ArrowLeft className="h-12 w-12 mb-2 text-gray-600" />
              ) : (
                <Folder className="h-12 w-12 mb-2 text-gray-600" />
              )
            ) : (
              <FileText className="h-12 w-12 mb-2 text-gray-600" />
            )}
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 flex">
        <aside className="w-64 pr-8">
          <nav>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <ChevronRight
                      className={`h-4 w-4 mr-2 transition-transform ${
                        activeCategory === category.name ? "rotate-90" : ""
                      }`}
                    />
                    {category.name}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-grow">
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="account">Minha Conta</TabsTrigger>
            </TabsList>
            <TabsContent value="documents">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Seus Documentos</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {activeCategory
                    ? activePath[activePath.length - 1]
                    : "Todas as Categorias"}
                </h2>
                {activeCategory ? (
                  renderContent(getCurrentContent())
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {categories
                      .filter((category) =>
                        category.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((category, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <Folder className="h-12 w-12 mb-2 text-gray-600" />
                          <span className="text-sm">{category.name}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="account">
              <h2 className="text-2xl font-bold mb-4">Minha Conta</h2>
              <p>Conteúdo da conta do usuário aqui.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
