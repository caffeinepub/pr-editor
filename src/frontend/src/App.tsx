import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useState } from "react";
import type { Project } from "./backend";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LoginScreen from "./pages/LoginScreen";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EditorPage = lazy(() => import("./pages/EditorPage"));

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Loading PR EDITOR...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  if (!identity) {
    return <LoginScreen />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {!currentProject ? (
        <DashboardPage onOpenProject={setCurrentProject} />
      ) : (
        <EditorPage
          project={currentProject}
          onBack={() => setCurrentProject(null)}
        />
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster />
    </>
  );
}
