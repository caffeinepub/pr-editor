import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  Clapperboard,
  Crop,
  Download,
  MousePointer2,
  Redo2,
  Save,
  Scissors,
  Settings,
  SplitSquareHorizontal,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../../backend";

interface Props {
  project: Project;
  onBack: () => void;
  onSave?: () => void;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

function TipBtn({
  tip,
  icon: Icon,
  onClick,
  label,
  ocid,
  className = "",
}: {
  tip: string;
  icon: React.ElementType;
  onClick?: () => void;
  label?: string;
  ocid?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 gap-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${label ? "px-2" : "w-8 px-0"} ${className}`}
          onClick={onClick}
          data-ocid={ocid}
        >
          <Icon className="w-3.5 h-3.5" />
          {label && <span className="text-[11px] font-medium">{label}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="text-xs bg-popover border-border text-foreground"
      >
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

export default function TopToolbar({
  project,
  onBack,
  onSave,
  zoom = 100,
  onZoomIn,
  onZoomOut,
}: Props) {
  const [projectName, setProjectName] = useState(project.name);
  const [editingName, setEditingName] = useState(false);

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className="flex items-center gap-1 px-2 h-11 border-b border-border shrink-0"
        style={{ background: "hsl(240 6% 8%)" }}
        data-ocid="editor.toolbar.panel"
      >
        <div className="flex items-center gap-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground h-8 w-8 px-0"
                data-ocid="editor.back.button"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Back to Dashboard
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-6 h-6 rounded bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Clapperboard className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-[13px] text-primary tracking-wider uppercase">
              PR EDITOR
            </span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-border" />

        <div className="flex items-center gap-0.5">
          <TipBtn
            tip="Select (V)"
            icon={MousePointer2}
            label="Select"
            ocid="editor.select.button"
          />
          <TipBtn
            tip="Cut (C)"
            icon={Scissors}
            label="Cut"
            onClick={() => toast.info("Cut")}
            ocid="editor.cut.button"
          />
          <TipBtn
            tip="Trim (T)"
            icon={Crop}
            label="Trim"
            onClick={() => toast.info("Trim")}
            ocid="editor.trim.button"
          />
          <TipBtn
            tip="Split (S)"
            icon={SplitSquareHorizontal}
            label="Split"
            onClick={() => toast.info("Split")}
            ocid="editor.split.button"
          />
        </div>

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-border" />

        <div className="flex items-center gap-0.5">
          <TipBtn
            tip="Undo (Ctrl+Z)"
            icon={Undo2}
            onClick={() => toast.info("Undo")}
            ocid="editor.undo.button"
          />
          <TipBtn
            tip="Redo (Ctrl+Shift+Z)"
            icon={Redo2}
            onClick={() => toast.info("Redo")}
            ocid="editor.redo.button"
          />
        </div>

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-border" />

        <div className="flex items-center gap-0.5">
          <TipBtn
            tip="Zoom Out"
            icon={ZoomOut}
            onClick={onZoomOut}
            ocid="editor.zoom_out.button"
          />
          <span className="text-[11px] font-mono text-muted-foreground w-10 text-center">
            {zoom}%
          </span>
          <TipBtn
            tip="Zoom In"
            icon={ZoomIn}
            onClick={onZoomIn}
            ocid="editor.zoom_in.button"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          {editingName ? (
            <input
              className="text-[13px] font-medium text-foreground bg-secondary border border-primary/50 rounded px-2 py-0.5 outline-none text-center max-w-[200px] w-full"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape")
                  setEditingName(false);
              }}
              data-ocid="editor.project_name.input"
            />
          ) : (
            <button
              type="button"
              className="text-[13px] font-medium text-foreground/80 hover:text-foreground px-2 py-0.5 rounded hover:bg-secondary transition-colors max-w-[200px] truncate"
              onClick={() => setEditingName(true)}
              title="Click to rename project"
              data-ocid="editor.project_name.button"
            >
              {projectName}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <TipBtn
            tip="Save Project (Ctrl+S)"
            icon={Save}
            onClick={onSave}
            ocid="editor.save.button"
            className="hover:text-primary"
          />
          <Button
            size="sm"
            className="h-8 gap-1.5 text-[11px] font-semibold bg-primary hover:bg-primary/85 text-primary-foreground px-3 shadow-glow-sm"
            onClick={() => toast.success("Exporting project…")}
            data-ocid="editor.export.button"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <TipBtn
            tip="Settings"
            icon={Settings}
            ocid="editor.settings.button"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
