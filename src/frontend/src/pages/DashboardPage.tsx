import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, FolderOpen, LogOut, Play, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
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

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage({ onOpenProject }: Props) {
  const { identity, clear } = useInternetIdentity();
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projects = [], isLoading } = useGetMyProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const principal = `${identity?.getPrincipal().toString().slice(0, 10)}...`;

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const project = await createProject.mutateAsync({
        name: newName.trim(),
        captions: [],
        mediaFiles: [],
      });
      toast.success(`Project "${project.name}" created!`);
      setNewName("");
      setDialogOpen(false);
      onOpenProject(project);
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleDelete = async (
    id: string,
    name: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      await deleteProject.mutateAsync(id);
      toast.success(`Deleted "${name}"`);
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Play className="w-4 h-4 text-primary fill-primary" />
          </div>
          <span className="font-display text-lg font-bold">
            PR <span className="text-primary">EDITOR</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {principal}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            data-ocid="dashboard.logout.button"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your video projects
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-ocid="dashboard.create_project.button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-card border-border"
                data-ocid="new_project.dialog"
              >
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Create New Project
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      placeholder="My Awesome Video"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      className="bg-muted border-border"
                      data-ocid="new_project.input"
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={!newName.trim() || createProject.isPending}
                    className="bg-primary hover:bg-primary/90"
                    data-ocid="new_project.submit_button"
                  >
                    {createProject.isPending ? "Creating..." : "Create & Open"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-52 rounded-xl bg-card" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="projects.empty_state"
            >
              <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
                <Film className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                No projects yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Create your first project to start editing amazing videos
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    data-ocid="projects.empty_state.create.button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Project
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:shadow-glow"
                  onClick={() => onOpenProject(project)}
                  data-ocid={`projects.item.${idx + 1}`}
                >
                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-primary/20 via-muted to-secondary/10 flex items-center justify-center relative">
                    <Film className="w-10 h-10 text-muted-foreground/40" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate mb-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs bg-primary/20 hover:bg-primary/40 text-primary border-0"
                        onClick={() => onOpenProject(project)}
                        data-ocid={`projects.item.${idx + 1}.open.button`}
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        onClick={(e) =>
                          handleDelete(project.id, project.name, e)
                        }
                        data-ocid={`projects.item.${idx + 1}.delete_button`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
