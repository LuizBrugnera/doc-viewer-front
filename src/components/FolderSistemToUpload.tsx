"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search,
  ChevronRight,
  Folder,
  FileText,
  ArrowLeft,
  Clock,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/security/UseAuth";
import { DocumentService } from "@/services/DocumentService";
import {
  categoriesVoid,
  folderFatherFormat,
  folderFormat,
  folderUpFoldersFormat,
} from "./utils";

interface File {
  id: number;
  name: string;
  resource: "file";
  date: string;
  type: string;
}

interface Folder {
  name: string;
  resource: "folder";
  contents: (File | Folder)[];
}

interface Category {
  name: string;
  contents: Folder[];
}

interface FolderSistemToUploadProps {
  foldersAcess?: string[];
}

export default function FolderSistemToUpload({
  foldersAcess,
}: FolderSistemToUploadProps) {
  const { token } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const activePathRef = useRef(activePath);
  const formatMySqlToBrDate = (date: string) => {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    activePathRef.current = activePath;
  }, [activePath]);

  const categories = [
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

  const [acessCategories, setAcessCategories] =
    useState<Category[]>(categories);

  useEffect(() => {
    if (foldersAcess) {
      let newObject = JSON.parse(JSON.stringify(categoriesVoid)) as Category[];

      newObject.forEach((category) => {
        foldersAcess.forEach((folder) => {
          return folderUpFoldersFormat[folderFatherFormat[folder]] ===
            category.name
            ? category.contents.push({
                name: folderFormat[folder],
                resource: "folder",
                contents: [],
              })
            : null;
        });
      });

      newObject = newObject.filter((category) => {
        return category.contents.length > 0;
      });

      setAcessCategories(newObject);
    }
  }, [foldersAcess]);

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
    if (item.resource === "folder") {
      if (item.name === "") {
        setActivePath(activePath.slice(0, -1));
      } else {
        setActivePath([...activePath, item.name]);
      }
    }
  };

  const getCurrentContent = () => {
    let current: (Folder | File)[] | undefined = acessCategories.find(
      (cat) => cat.name === activeCategory
    )?.contents;

    for (const pathItem of activePath.slice(1)) {
      const folder = current?.find(
        (item) => item.resource === "folder" && item.name === pathItem
      ) as Folder;
      current = folder?.contents;
    }

    if (activePath.length > 1) {
      current = [
        { name: "", resource: "folder", contents: [] },
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
      if (item.resource === "folder") {
        const matchingContents = searchItems(item.contents);
        if (matchingContents.length > 0) {
          return true;
        }
      }
      return false;
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleUpload = async (files: FileList) => {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("document", files[i]);
      formData.append("folder", activePathRef.current[1]);
      formData.append("name", files[i].name);
      try {
        await DocumentService.uploadFileFast(token, formData);
      } catch (error) {
        console.error("Erro ao fazer upload dos arquivos:", error);
        alert("Erro ao fazer upload dos arquivos.");
      }
    }

    try {
      alert("Arquivos enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos:", error);
      alert("Erro ao fazer upload dos arquivos.");
    }
  };

  const renderContent = (content: (Folder | File)[]) => {
    const filteredContent = searchQuery ? searchItems(content) : content;

    return (
      <div className="grid grid-cols-3 gap-4">
        {filteredContent.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer mb-4"
            onClick={() => handleItemClick(item)}
          >
            {item.resource === "folder" ? (
              item.name === "" ? (
                <ArrowLeft className="h-12 w-12 mb-4 text-gray-600 " />
              ) : (
                <Folder className="h-12 w-12 mb-2 text-gray-600" />
              )
            ) : (
              <FileText className="h-12 w-12 mb-2 text-gray-600" />
            )}
            <span className="text-sm font-medium">{item.name || "Voltar"}</span>
            {item.resource !== "folder" && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatMySqlToBrDate((item as File).date)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const isUploadArea =
    (activeCategory === "Financeiro" && activePath.includes("Boletos")) ||
    (activeCategory === "Financeiro" && activePath.includes("Notas Fiscais")) ||
    (activeCategory === "Financeiro" && activePath.includes("Recibos")) ||
    (activeCategory === "Faturamento" &&
      activePath.includes("Relatório de Faturamento")) ||
    (activeCategory === "E-social" &&
      activePath.includes("Relatório Evento S-2240")) ||
    (activeCategory === "E-social" &&
      activePath.includes("Relatório Evento S-2220")) ||
    (activeCategory === "E-social" &&
      activePath.includes("Relatório Evento S-2210")) ||
    (activeCategory === "Vendas" && activePath.includes("Contratos")) ||
    (activeCategory === "Vendas" && activePath.includes("Ordens de Serviço")) ||
    (activeCategory === "Documentos tecnicos" &&
      activePath.includes("Laudos PCMSO")) ||
    (activeCategory === "Documentos tecnicos" &&
      activePath.includes("Laudos PGR")) ||
    (activeCategory === "Documentos tecnicos" &&
      activePath.includes("Laudos LTCAT")) ||
    (activeCategory === "Documentos tecnicos" &&
      activePath.includes("Laudos Diversos")) ||
    (activeCategory === "Exames" &&
      activePath.includes("Exames Laboratoriais")) ||
    (activeCategory === "Exames" && activePath.includes("Exames Telecardio")) ||
    (activeCategory === "Exames" && activePath.includes("Exames Local")) ||
    (activeCategory === "Exames" &&
      activePath.includes("Exames Proclinic (Aso)")) ||
    (activeCategory === "Exames" &&
      activePath.includes("Exames Proclinic (Audiometria)"));
  return (
    <div className="flex-grow container mx-auto px-4 py-8 flex">
      <aside className="w-64 pr-8">
        <nav>
          <ul className="space-y-2">
            {acessCategories.map((category, index) => (
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
        <div className="mb-6">
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
              {acessCategories
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
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                ))}
            </div>
          )}
          {isUploadArea ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${
                dragActive ? "border-primary" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-sm text-gray-600">
                  Arraste arquivos aqui ou clique para selecionar
                </span>
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
