import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Pause,
  Play,
  Plus,
  Scissors,
  SkipBack,
  SkipForward,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../backend";
import LeftPanel from "../components/editor/LeftPanel";
import RightPanel from "../components/editor/RightPanel";
import TopToolbar from "../components/editor/TopToolbar";

interface Props {
  project: Project;
  onBack: () => void;
}

const TOTAL_DURATION = 90; // seconds

const MOCK_CLIPS = [
  {
    id: "v1",
    track: "video",
    start: 0,
    end: 60,
    label: "Main Video.mp4",
    color: "bg-violet-600",
  },
  {
    id: "v2",
    track: "video",
    start: 65,
    end: 90,
    label: "B-Roll.mp4",
    color: "bg-violet-500",
  },
  {
    id: "a1",
    track: "audio1",
    start: 0,
    end: 45,
    label: "Epic Background",
    color: "bg-cyan-600",
  },
  {
    id: "a2",
    track: "audio1",
    start: 50,
    end: 80,
    label: "Happy Vibes",
    color: "bg-cyan-500",
  },
  {
    id: "a3",
    track: "audio2",
    start: 10,
    end: 25,
    label: "Meme Boom",
    color: "bg-teal-500",
  },
  {
    id: "t1",
    track: "text",
    start: 5,
    end: 20,
    label: "Intro Title",
    color: "bg-amber-500",
  },
  {
    id: "t2",
    track: "text",
    start: 40,
    end: 60,
    label: "Telugu Caption",
    color: "bg-orange-500",
  },
];

const TRACKS = [
  { id: "video", label: "Video 1", color: "bg-violet-600" },
  { id: "audio1", label: "Audio 1", color: "bg-cyan-600" },
  { id: "audio2", label: "Audio 2", color: "bg-teal-500" },
  { id: "text", label: "Text", color: "bg-amber-500" },
];

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const RULER_MARKS = Array.from({ length: 10 }, (_, i) => ({
  label: formatTime((TOTAL_DURATION / 10) * i),
}));

export default function EditorPage({ project, onBack }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [zoom, setZoom] = useState(1);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const tick = (timestamp: number) => {
        if (lastTimestampRef.current !== null) {
          const delta = (timestamp - lastTimestampRef.current) / 1000;
          setCurrentTime((prev) => {
            if (prev >= TOTAL_DURATION) {
              setIsPlaying(false);
              return 0;
            }
            return prev + delta;
          });
        }
        lastTimestampRef.current = timestamp;
        rafRef.current = requestAnimationFrame(tick);
      };
      lastTimestampRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying]);

  const playheadPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopToolbar project={project} onBack={onBack} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-[272px] flex-shrink-0 border-r border-border overflow-hidden">
          <LeftPanel />
        </aside>

        {/* Center */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Canvas */}
          <div
            className="flex-1 bg-black flex items-center justify-center relative overflow-hidden"
            data-ocid="editor.canvas_target"
          >
            {/* Film grain overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
            {/* 16:9 canvas */}
            <div
              className="relative w-full max-w-4xl"
              style={{ aspectRatio: "16/9" }}
            >
              <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center border border-zinc-800 relative overflow-hidden">
                {/* Mock video content */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-cyan-950/20" />
                <div className="text-center z-10">
                  <div className="font-display text-3xl font-bold text-white/20 mb-2">
                    {project.name}
                  </div>
                  <div className="text-white/30 text-sm">
                    {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
                  </div>
                </div>

                {/* Play overlay */}
                {!isPlaying && (
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center group"
                    onClick={() => setIsPlaying(true)}
                    data-ocid="editor.play.button"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Timecode badge */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-xs text-white/80 px-2 py-1 rounded font-mono">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="h-12 bg-card border-t border-border flex items-center gap-3 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:text-primary"
              onClick={() => setCurrentTime(0)}
              data-ocid="editor.rewind.button"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:text-primary"
              onClick={() => setIsPlaying(!isPlaying)}
              data-ocid="editor.play_pause.toggle"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground hover:text-primary"
              onClick={() =>
                setCurrentTime(Math.min(TOTAL_DURATION, currentTime + 5))
              }
              data-ocid="editor.forward.button"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Scrubber */}
            <div className="flex-1 flex items-center gap-2">
              <Slider
                min={0}
                max={TOTAL_DURATION}
                step={0.1}
                value={[currentTime]}
                onValueChange={([v]) => setCurrentTime(v)}
                className="flex-1"
                data-ocid="editor.timeline.input"
              />
            </div>

            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </span>

            {/* Volume */}
            <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Slider
              min={0}
              max={100}
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              className="w-20"
              data-ocid="editor.volume.input"
            />
          </div>

          {/* Timeline */}
          <div className="h-[180px] bg-card border-t border-border flex flex-col">
            {/* Timeline header */}
            <div className="h-8 border-b border-border flex items-center">
              <div className="w-[80px] flex-shrink-0 border-r border-border h-full flex items-center px-2 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  data-ocid="timeline.zoom_in.button"
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  data-ocid="timeline.zoom_out.button"
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
              </div>
              {/* Time ruler */}
              <div className="flex-1 relative overflow-hidden h-full">
                <div
                  className="absolute inset-0 flex items-end pb-1"
                  style={{ width: `${100 * zoom}%` }}
                >
                  {RULER_MARKS.map((mark) => (
                    <div
                      key={mark.label}
                      className="flex-1 border-r border-border/50 text-[9px] text-muted-foreground px-1"
                    >
                      {mark.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tracks */}
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              {TRACKS.map((track) => (
                <div
                  key={track.id}
                  className="flex h-[34px] border-b border-border/40 last:border-0"
                >
                  {/* Track label */}
                  <div className="w-[80px] flex-shrink-0 border-r border-border/50 flex items-center px-2 gap-1.5">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        track.color,
                      )}
                    />
                    <span className="text-[10px] text-muted-foreground truncate">
                      {track.label}
                    </span>
                  </div>

                  {/* Clip lane */}
                  <div
                    className="flex-1 relative bg-muted/20"
                    style={{ width: `${100 * zoom}%` }}
                  >
                    {/* Playhead */}
                    <div
                      className="playhead"
                      style={{ left: `${playheadPercent}%` }}
                    />

                    {MOCK_CLIPS.filter((c) => c.track === track.id).map(
                      (clip) => (
                        <button
                          type="button"
                          key={clip.id}
                          className={cn(
                            "absolute top-[3px] bottom-[3px] rounded flex items-center px-2 text-[10px] font-medium text-white truncate cursor-pointer transition-all border",
                            clip.color,
                            selectedClip === clip.id
                              ? "border-white/60 ring-1 ring-white/40"
                              : "border-transparent opacity-90 hover:opacity-100",
                          )}
                          style={{
                            left: `${(clip.start / TOTAL_DURATION) * 100}%`,
                            width: `${((clip.end - clip.start) / TOTAL_DURATION) * 100}%`,
                          }}
                          onClick={() =>
                            setSelectedClip(
                              clip.id === selectedClip ? null : clip.id,
                            )
                          }
                          data-ocid={`timeline.clip.${clip.id}`}
                        >
                          {clip.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add track button */}
            <div className="h-7 border-t border-border/40 flex items-center px-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[10px] text-muted-foreground hover:text-foreground gap-1 px-2"
                data-ocid="timeline.add_track.button"
              >
                <Plus className="w-3 h-3" /> Add Track
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[10px] text-muted-foreground hover:text-foreground gap-1 px-2"
                data-ocid="timeline.split.button"
              >
                <Scissors className="w-3 h-3" /> Split
              </Button>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-[280px] flex-shrink-0 border-l border-border overflow-hidden">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}
