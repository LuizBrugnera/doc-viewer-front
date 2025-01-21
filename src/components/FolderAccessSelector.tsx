import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FolderAccessSelectorProps = {
  availableFolders: { [key: string]: string };
  selectedFolders: { foldername: string }[];
  onFolderChange: (folder: string, checked: boolean) => void;
};

export default function FolderAccessSelector({
  availableFolders,
  selectedFolders,
  onFolderChange,
}: FolderAccessSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(availableFolders).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <Checkbox
            id={`folder-${key}`}
            checked={selectedFolders.some(
              (folder) => folder.foldername === key
            )}
            onCheckedChange={(checked) =>
              onFolderChange(key, checked as boolean)
            }
          />
          <Label htmlFor={`folder-${key}`}>{value}</Label>
        </div>
      ))}
    </div>
  );
}
