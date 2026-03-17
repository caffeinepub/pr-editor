import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export type Time = bigint;
export interface Caption {
    text: string;
    language: Language;
    timestamp: bigint;
}
export interface AIJob {
    id: string;
    status: JobStatus;
    inputData?: ExternalBlob;
    owner: Principal;
    jobType: JobType;
    createdAt: Time;
    resultData?: ExternalBlob;
}
export interface MediaEntry {
    id: string;
    file: ExternalBlob;
    mediaType: MediaType;
    category: string;
}
export interface CreateProjectArgs {
    name: string;
    captions: Array<Caption>;
    mediaFiles: Array<MediaEntry>;
}
export interface Project {
    id: string;
    owner: Principal;
    name: string;
    createdAt: Time;
    captions: Array<Caption>;
    mediaFiles: Array<MediaEntry>;
}
export enum JobStatus {
    pending = "pending",
    complete = "complete",
    processing = "processing",
    failed = "failed"
}
export enum JobType {
    tts = "tts",
    autoCut = "autoCut",
    captions = "captions",
    textToVideo = "textToVideo",
    remover = "remover",
    imageToVideo = "imageToVideo"
}
export enum Language {
    en = "en",
    hi = "hi",
    te = "te"
}
export enum MediaType {
    audio = "audio",
    video = "video",
    effect = "effect",
    filter = "filter",
    template = "template",
    image = "image",
    sticker = "sticker"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMediaEntry(media: MediaEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAIJob(jobType: JobType, inputData: ExternalBlob | null): Promise<AIJob>;
    createProject(args: CreateProjectArgs): Promise<Project>;
    deleteMediaEntry(id: string): Promise<void>;
    deleteProject(id: string): Promise<void>;
    getAllJobs(): Promise<Array<AIJob>>;
    getAllMediaByType(mediaType: MediaType): Promise<Array<MediaEntry>>;
    getAllProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(jobId: string): Promise<AIJob | null>;
    getMediaEntry(id: string): Promise<MediaEntry | null>;
    getMyProjects(): Promise<Array<Project>>;
    getProject(id: string): Promise<Project | null>;
    getUserJobs(): Promise<Array<AIJob>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(user: Principal): Promise<Array<Project>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJobStatus(jobId: string, status: JobStatus, resultData: ExternalBlob | null): Promise<void>;
    updateProject(id: string, args: CreateProjectArgs): Promise<void>;
}
