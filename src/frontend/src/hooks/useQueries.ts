import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AIJob, CreateProjectArgs, Project } from "../backend";
import { JobType } from "../backend";
import { useActor } from "./useActor";

export function useGetMyProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["myProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: CreateProjectArgs) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProject(args);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myProjects"] }),
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProject(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myProjects"] }),
  });
}

export function useCreateAIJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobType: JobType) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAIJob(jobType, null);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userJobs"] }),
  });
}

export function useGetUserJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<AIJob[]>({
    queryKey: ["userJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserJobs();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 4000,
    staleTime: 30_000,
  });
}

export { JobType };
