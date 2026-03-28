import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clapperboard,
  Clock,
  Film,
  FolderOpen,
  LogOut,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProject,
  useDeleteProject,
  useGetMyProjects,
} from "../hooks/useQueries";

interface Props {
  onOpenProject: (project: Project) => void;
}

function formatDate(t: bigint): string {
  return new Date(Number(t) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PROJECT_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
];

function ProjectCard({
  project,
  index,
  onOpen,
  onDelete,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const color = PROJECT_COLORS[index % PROJECT_COLORS.length];
  const initials = project.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="group relative rounded-lg overflow-hidden border border-border bg-card cursor-pointer transition-all duration-150 hover:border-primary/40 hover:shadow-panel"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      data-ocid={`dashboard.project.item.${index + 1}`}
    >
      <div
        className="h-[120px] flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(240 6% 8%) 0%, ${color}18 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, ${color}15 19px, ${color}15 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, ${color}15 19px, ${color}15 20px)`,
          }}
        />
        <div
          className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}40`,
            color,
          }}
        >
          {initials}
        </div>
        <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/85 text-primary-foreground shadow-glow-sm"
            onClick={onOpen}
            data-ocid={`dashboard.project_open.button.${index + 1}`}
          >
            <FolderOpen className="w-3.5 h-3.5" /> Open
          </Button>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-medium text-foreground/90 truncate">
          {project.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/15 hover:text-destructive"
            onClick={onDelete}
            title="Delete project"
            data-ocid={`dashboard.project_delete.button.${index + 1}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ onOpenProject }: Props) {
  const { data: projects = [], isLoading } = useGetMyProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const { clear, identity } = useInternetIdentity();
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleCreate() {
    if (!newName.trim()) return;
    try {
      await createProject.mutateAsync({
        name: newName.trim(),
        captions: [],
        mediaFiles: [],
      });
      toast.success("Project created");
      setNewName("");
      setOpen(false);
    } catch {
      toast.error("Failed to create project");
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
      data-ocid="dashboard.page"
    >
      <header
        className="border-b border-border px-6 py-0"
        style={{ background: "hsl(240 6% 8%)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: "hsl(197 100% 45% / 0.15)",
                border: "1px solid hsl(197 100% 45% / 0.3)",
              }}
            >
              <Clapperboard className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-base text-primary tracking-wider uppercase">
              PR EDITOR
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                style={{ width: 13, height: 13 }}
              />
              <input
                className="h-8 pl-8 pr-3 text-xs rounded-md border border-border bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors w-52"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="dashboard.search.input"
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/85 text-primary-foreground shadow-glow-sm"
                  data-ocid="dashboard.new_project.button"
                >
                  <Plus className="w-3.5 h-3.5" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-sm"
                data-ocid="dashboard.new_project.dialog"
              >
                <DialogHeader>
                  <DialogTitle className="font-display">
                    New Project
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Project Name
                    </Label>
                    <Input
                      placeholder="My Awesome Video"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      className="h-9 text-sm"
                      autoFocus
                      data-ocid="dashboard.project_name.input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    data-ocid="dashboard.new_project_cancel.button"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreate}
                    disabled={createProject.isPending || !newName.trim()}
                    className="bg-primary hover:bg-primary/85 text-primary-foreground"
                    data-ocid="dashboard.new_project_create.button"
                  >
                    {createProject.isPending ? "Creating…" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="w-px h-5 bg-border" />
            <span className="text-muted-foreground text-xs hidden sm:block">
              {identity?.getPrincipal().toString().slice(0, 10)}…
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Log out"
              data-ocid="dashboard.logout.button"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              My Projects
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Film className="w-3.5 h-3.5" />
            <span>All Videos</span>
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            data-ocid="dashboard.projects.loading_state"
          >
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="rounded-lg border border-border bg-card animate-pulse"
                style={{ height: 168 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="dashboard.projects.empty_state"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "hsl(197 100% 45% / 0.08)",
                border: "1px solid hsl(197 100% 45% / 0.2)",
              }}
            >
              <Film className="w-8 h-8 text-primary/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground/70">
                {search ? "No projects found" : "No projects yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? "Try a different search term"
                  : "Create your first project to get started"}
              </p>
            </div>
            {!search && (
              <Button
                size="sm"
                className="gap-1.5 text-xs bg-primary hover:bg-primary/85 text-primary-foreground"
                onClick={() => setOpen(true)}
                data-ocid="dashboard.empty_create.button"
              >
                <Plus className="w-3.5 h-3.5" /> Create Project
              </Button>
            )}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            data-ocid="dashboard.projects.list"
          >
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onOpen={() => onOpenProject(p)}
                onDelete={(e) => handleDelete(p.id, e)}
              />
            ))}
          </div>
        )}
      </main>

      <footer
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-2 border-t border-border/50"
        style={{ background: "hsl(240 6% 8%)" }}
      >
        <p className="text-[10px] text-muted-foreground/50">
          &copy; {new Date().getFullYear()}. Built with &#9829; using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="hover:text-muted-foreground transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
