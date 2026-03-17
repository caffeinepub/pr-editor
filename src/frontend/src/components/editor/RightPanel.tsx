import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Eye,
  Film,
  Image,
  Loader2,
  MessageSquare,
  Mic,
  Scissors,
  Subtitles,
  Type,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { JobType } from "../../backend";
import { useCreateAIJob, useGetUserJobs } from "../../hooks/useQueries";

const TOOL_JOB_TYPE: Record<string, JobType> = {
  autoCut: JobType.autoCut,
  remover: JobType.remover,
  show: JobType.autoCut,
  sync: JobType.autoCut,
  videoGen: JobType.textToVideo,
  storyToVideo: JobType.textToVideo,
  tts: JobType.tts,
  captions: JobType.captions,
  imageToVideo: JobType.imageToVideo,
  textToVideo: JobType.textToVideo,
};

const AI_TOOLS = [
  {
    id: "autoCut",
    label: "AI Auto Cut",
    icon: Scissors,
    desc: "Smart scene detection & cutting",
    color: "text-violet-400",
  },
  {
    id: "remover",
    label: "AI Remover",
    icon: Wand2,
    desc: "Remove objects & backgrounds",
    color: "text-cyan-400",
  },
  {
    id: "show",
    label: "AI Show",
    icon: Eye,
    desc: "Enhance & highlight subjects",
    color: "text-emerald-400",
  },
  {
    id: "sync",
    label: "AI Best Sync",
    icon: Zap,
    desc: "Auto-sync audio to beats",
    color: "text-amber-400",
  },
];

const GEN_TOOLS = [
  {
    id: "textToVideo",
    label: "Text to Video",
    icon: Type,
    placeholder: "Describe your video scene...",
  },
  {
    id: "imageToVideo",
    label: "Image to Video",
    icon: Image,
    placeholder: "Upload an image to animate...",
  },
  {
    id: "videoGen",
    label: "Video Gen",
    icon: Film,
    placeholder: "Enter a video generation prompt...",
  },
  {
    id: "storyToVideo",
    label: "Story to Video",
    icon: BookOpen,
    placeholder: "Enter your story or script...",
  },
];

export default function RightPanel() {
  const [ttsText, setTtsText] = useState("");
  const [ttsLang, setTtsLang] = useState("en");
  const [ttsVoice, setTtsVoice] = useState("female");
  const [captionLang, setCaptionLang] = useState("en");
  const [genPrompts, setGenPrompts] = useState<Record<string, string>>({});
  const [editSpeechText, setEditSpeechText] = useState("");
  const [mockCaptions, setMockCaptions] = useState<
    { text: string; time: string }[]
  >([]);

  const createJob = useCreateAIJob();
  const { data: jobs = [] } = useGetUserJobs();

  const runningJobs = jobs.filter(
    (j) => j.status === "processing" || j.status === "pending",
  );

  const handleAITool = async (toolId: string, label: string) => {
    const jobType = TOOL_JOB_TYPE[toolId];
    if (!jobType) return;
    try {
      await createJob.mutateAsync(jobType);
      toast.success(`${label} job started!`, {
        description: "Processing in background...",
      });
    } catch {
      toast.error(`Failed to start ${label}`);
    }
  };

  const handleTTS = async () => {
    if (!ttsText.trim()) return;
    try {
      await createJob.mutateAsync(JobType.tts);
      toast.success("Text-to-Speech generated!", {
        description: `Voice: ${ttsVoice} · Language: ${ttsLang}`,
      });
      setTtsText("");
    } catch {
      toast.error("TTS generation failed");
    }
  };

  const handleGenerate = async (toolId: string, label: string) => {
    const prompt = genPrompts[toolId];
    if (!prompt?.trim()) return;
    const jobType = TOOL_JOB_TYPE[toolId];
    if (!jobType) return;
    try {
      await createJob.mutateAsync(jobType);
      toast.success(`${label} started!`, {
        description: `${prompt.slice(0, 60)}...`,
      });
      setGenPrompts((prev) => ({ ...prev, [toolId]: "" }));
    } catch {
      toast.error(`Failed to start ${label}`);
    }
  };

  const handleGenerateCaptions = async () => {
    try {
      await createJob.mutateAsync(JobType.captions);
      const langLabel =
        captionLang === "te"
          ? "Telugu"
          : captionLang === "hi"
            ? "Hindi"
            : "English";
      setMockCaptions([
        { text: "Welcome to PR EDITOR", time: "0:00" },
        {
          text:
            langLabel === "Telugu"
              ? "మీ వీడియో సంపాదించండి"
              : langLabel === "Hindi"
                ? "अपना वीडियो संपादित करें"
                : "Edit your video professionally",
          time: "0:05",
        },
        {
          text:
            langLabel === "Telugu"
              ? "AI తో సులభంగా"
              : langLabel === "Hindi"
                ? "AI के साथ आसानी से"
                : "Powered by AI technology",
          time: "0:12",
        },
      ]);
      toast.success(`${langLabel} captions generated!`);
    } catch {
      toast.error("Failed to generate captions");
    }
  };

  const handleAutoSpeech = async () => {
    try {
      await createJob.mutateAsync(JobType.autoCut);
      toast.success("Auto Speech started!", {
        description: "Processing in background...",
      });
    } catch {
      toast.error("Failed to start Auto Speech");
    }
  };

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="h-10 border-b border-border flex items-center px-3">
        <span className="text-xs font-semibold text-foreground">AI Tools</span>
        {runningJobs.length > 0 && (
          <Badge className="ml-2 h-4 text-[9px] bg-primary/20 text-primary border-primary/30">
            {runningJobs.length} running
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 flex flex-col gap-4">
          {/* AI Tools grid */}
          <div className="flex flex-col gap-1">
            {AI_TOOLS.map((tool, idx) => {
              const Icon = tool.icon;
              const isRunning = runningJobs.some(
                (j) => j.jobType === TOOL_JOB_TYPE[tool.id],
              );
              return (
                <button
                  type="button"
                  key={tool.id}
                  disabled={createJob.isPending || isRunning}
                  onClick={() => handleAITool(tool.id, tool.label)}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left",
                    "border-border hover:border-primary/40 hover:bg-muted/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                  data-ocid={`ai_tools.item.${idx + 1}.button`}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0",
                      tool.color,
                    )}
                  >
                    {isRunning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{tool.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {tool.desc}
                    </p>
                  </div>
                  {isRunning && (
                    <Badge className="text-[9px] h-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Running
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          <Separator className="bg-border" />

          {/* Speech section */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Speech Tools
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs gap-1.5 border-border hover:border-primary/40"
                onClick={() => {
                  if (!editSpeechText.trim()) {
                    toast.info("Enter speech text below first");
                    return;
                  }
                  toast.success("Speech edited!");
                }}
                data-ocid="speech.edit_speech.button"
              >
                <Mic className="w-3.5 h-3.5" /> Edit Speech
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs gap-1.5 border-border hover:border-primary/40"
                onClick={handleAutoSpeech}
                disabled={createJob.isPending}
                data-ocid="speech.auto_speech.button"
              >
                <Volume2 className="w-3.5 h-3.5" /> Auto Speech
              </Button>
            </div>
            <Textarea
              placeholder="Enter speech to edit or transcribe..."
              value={editSpeechText}
              onChange={(e) => setEditSpeechText(e.target.value)}
              className="mt-2 h-16 text-xs bg-muted border-border resize-none"
              data-ocid="speech.edit_speech.textarea"
            />
          </div>

          <Separator className="bg-border" />

          {/* Text to Speech */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Text to Speech
              </p>
            </div>
            <Textarea
              placeholder="Enter text to convert to speech..."
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              className="h-16 text-xs bg-muted border-border resize-none mb-2"
              data-ocid="tts.textarea"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">
                  Language
                </Label>
                <Select value={ttsLang} onValueChange={setTtsLang}>
                  <SelectTrigger
                    className="h-7 text-xs bg-muted border-border"
                    data-ocid="tts.language.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="en" className="text-xs">
                      English
                    </SelectItem>
                    <SelectItem value="hi" className="text-xs">
                      Hindi
                    </SelectItem>
                    <SelectItem value="te" className="text-xs">
                      Telugu
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">
                  Voice
                </Label>
                <Select value={ttsVoice} onValueChange={setTtsVoice}>
                  <SelectTrigger
                    className="h-7 text-xs bg-muted border-border"
                    data-ocid="tts.voice.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="female" className="text-xs">
                      Female
                    </SelectItem>
                    <SelectItem value="male" className="text-xs">
                      Male
                    </SelectItem>
                    <SelectItem value="neutral" className="text-xs">
                      Neutral
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full h-8 text-xs bg-primary hover:bg-primary/90"
              disabled={!ttsText.trim() || createJob.isPending}
              onClick={handleTTS}
              data-ocid="tts.generate.button"
            >
              {createJob.isPending ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : null}
              Generate Speech
            </Button>
          </div>

          <Separator className="bg-border" />

          {/* Captions */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Subtitles className="w-3.5 h-3.5 text-secondary" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Auto Captions
              </p>
            </div>
            <div className="mb-2">
              <Label className="text-[10px] text-muted-foreground mb-1 block">
                Language
              </Label>
              <Select value={captionLang} onValueChange={setCaptionLang}>
                <SelectTrigger
                  className="h-7 text-xs bg-muted border-border"
                  data-ocid="captions.language.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="en" className="text-xs">
                    🇺🇸 English
                  </SelectItem>
                  <SelectItem value="hi" className="text-xs">
                    🇮🇳 Hindi
                  </SelectItem>
                  <SelectItem value="te" className="text-xs">
                    🏴 Telugu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              className="w-full h-8 text-xs bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 mb-2"
              disabled={createJob.isPending}
              onClick={handleGenerateCaptions}
              data-ocid="captions.generate.button"
            >
              {createJob.isPending ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : null}
              Generate Captions
            </Button>
            {mockCaptions.length > 0 && (
              <div className="flex flex-col gap-1" data-ocid="captions.list">
                {mockCaptions.map((cap, idx) => (
                  <div
                    key={cap.time + String(idx)}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/40 border border-border"
                    data-ocid={`captions.item.${idx + 1}`}
                  >
                    <span className="text-[9px] text-secondary font-mono mt-0.5 flex-shrink-0">
                      {cap.time}
                    </span>
                    <span className="text-[10px] text-foreground leading-snug">
                      {cap.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Generation tools */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              AI Generation
            </p>
            <div className="flex flex-col gap-3">
              {GEN_TOOLS.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.id} data-ocid={`generation.item.${idx + 1}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-medium text-foreground">
                        {tool.label}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <Textarea
                        placeholder={tool.placeholder}
                        value={genPrompts[tool.id] ?? ""}
                        onChange={(e) =>
                          setGenPrompts((prev) => ({
                            ...prev,
                            [tool.id]: e.target.value,
                          }))
                        }
                        className="flex-1 h-14 text-[10px] bg-muted border-border resize-none"
                        data-ocid={`generation.${tool.id}.textarea`}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full h-7 mt-1 text-[10px] bg-muted hover:bg-muted/80 border border-border hover:border-primary/40"
                      disabled={
                        !genPrompts[tool.id]?.trim() || createJob.isPending
                      }
                      onClick={() => handleGenerate(tool.id, tool.label)}
                      data-ocid={`generation.${tool.id}.button`}
                    >
                      Generate
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
