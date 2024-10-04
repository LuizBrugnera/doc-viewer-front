"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ChevronRight,
  Folder,
  FileText,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/security/UseAuth";
import { DocumentService } from "@/services/DocumentService";
import { categoriesDefault } from "./utils";
import { Category, File } from "@/types/GlobalTypes";

interface Folder {
  name: string;
  resource: "folder";
  contents: (File | Folder)[];
}

export default function FolderSistem() {
  const { token } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const formatMySqlToBrDate = (date: string) => {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };
  const [categories, setCategories] = useState<Category[]>(
    JSON.parse(JSON.stringify(categoriesDefault)) as Category[]
  );

  const handleDownload = async (id: number, fileName: string) => {
    try {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const response = await DocumentService.downloadFile(token, id);
      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download do arquivo:", error);
      alert("Erro ao fazer download do arquivo.");
    }
  };

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
    } else {
      handleDownload(item.id, item.name);
    }
  };

  const getCurrentContent = () => {
    let current: (Folder | File)[] | undefined = categories.find(
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
            {item.resource === "folder" ? (
              item.name === "" ? (
                <ArrowLeft className="h-12 w-12 mb-2 text-gray-600" />
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

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const data = await DocumentService.getFilesByUserWithFolderFormat(token);

      setCategories(data);
    };

    fetchDocuments();
  }, [token]);

  return (
    <div className="flex-grow container mx-auto px-4 py-8 flex">
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
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
