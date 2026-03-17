import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Download,
  Folder,
  LogOut,
  Play,
  Save,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { Project } from "../../backend";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface Props {
  project: Project;
  onBack: () => void;
}

export default function TopToolbar({ project, onBack }: Props) {
  const { identity, clear } = useInternetIdentity();
  const shortId =
    identity?.getPrincipal().toString().slice(0, 6).toUpperCase() ?? "??";

  return (
    <header className="h-[52px] bg-card border-b border-border flex items-center px-3 gap-2 flex-shrink-0">
      {/* Back */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={onBack}
        data-ocid="toolbar.back.button"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
          <Play className="w-3.5 h-3.5 text-primary fill-primary" />
        </div>
        <span className="font-display text-base font-bold tracking-tight">
          PR <span className="text-primary">EDITOR</span>
        </span>
      </div>

      <div className="h-5 w-px bg-border mx-1" />

      {/* Project name */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border">
        <Folder className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-foreground max-w-[140px] truncate">
          {project.name}
        </span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => toast.success("Project saved!")}
        data-ocid="toolbar.save.button"
      >
        <Save className="w-3.5 h-3.5" />
        Save
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => toast.info("Upload media to your project")}
        data-ocid="toolbar.upload.button"
      >
        <Upload className="w-3.5 h-3.5" />
        Upload
      </Button>

      <Button
        size="sm"
        className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => toast.success("Export started!")}
        data-ocid="toolbar.export.button"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </Button>

      <div className="h-5 w-px bg-border mx-1" />

      {/* User avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            data-ocid="toolbar.user.button"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {shortId.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-card border-border"
          data-ocid="toolbar.user.dropdown_menu"
        >
          <DropdownMenuItem className="text-xs text-muted-foreground cursor-default">
            {identity?.getPrincipal().toString().slice(0, 16)}...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={clear}
            className="text-destructive focus:text-destructive"
            data-ocid="toolbar.logout.button"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
