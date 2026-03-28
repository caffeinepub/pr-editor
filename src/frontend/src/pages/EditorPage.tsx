import {
  FastForward,
  Maximize,
  Pause,
  Play,
  Rewind,
  Square,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend";
import LeftPanel from "../components/editor/LeftPanel";
import RightPanel from "../components/editor/RightPanel";
import TopToolbar from "../components/editor/TopToolbar";

interface Props {
  project: Project;
  onBack: () => void;
}

type LeftTab =
  | "media"
  | "audio"
  | "effects"
  | "filters"
  | "stickers"
  | "text"
  | "transitions"
  | "captions"
  | "ai"
  | "templates"
  | "voiceover";

const TOTAL_DURATION = 60;

const TIMELINE_CLIPS = {
  video: [
    { start: 0, end: 15, label: "Clip 1", color: "#0ea5e9" },
    { start: 18, end: 35, label: "Clip 2", color: "#38bdf8" },
    { start: 38, end: 60, label: "Clip 3", color: "#0ea5e9" },
  ],
  audio: [{ start: 0, end: 60, label: "Music Track", color: "#10b981" }],
  effects: [
    { start: 5, end: 12, label: "Fade In", color: "#f59e0b" },
    { start: 30, end: 38, label: "Zoom", color: "#f59e0b" },
  ],
};

export default function EditorPage({ project, onBack }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [leftTab, setLeftTab] = useState<LeftTab>("media");
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const stopPlayback = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const tick = useCallback(
    (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setCurrentTime((t) => {
        const next = t + delta;
        if (next >= TOTAL_DURATION) {
          stopPlayback();
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopPlayback],
  );

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [isPlaying, stopPlayback, tick]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setCurrentTime(0);
  }, [stopPlayback]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const fr = Math.floor((s % 1) * 30);
    return `${m}:${String(sec).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
  };

  const timelineProgress = (currentTime / TOTAL_DURATION) * 100;
  const frame = Math.floor((currentTime % 1) * 30);

  return (
    <div className="editor-root" data-ocid="editor.page">
      <TopToolbar
        project={project}
        onBack={onBack}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(z + 25, 300))}
        onZoomOut={() => setZoom((z) => Math.max(z - 25, 25))}
        onSave={() => toast.success("Project saved")}
      />

      <div className="editor-body">
        <LeftPanel activeTab={leftTab} onTabChange={setLeftTab} />

        <div className="center-area">
          {/* Preview */}
          <div className="preview-area">
            <div className="preview-canvas">
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(240 5% 10%) 39px, hsl(240 5% 10%) 40px), repeating-linear-gradient(90deg, transparent, transparent 69px, hsl(240 5% 10%) 69px, hsl(240 5% 10%) 70px)",
                  opacity: 0.4,
                }}
              />
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "hsl(197 100% 45% / 0.12)",
                    border: "1px solid hsl(197 100% 45% / 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Play
                    style={{
                      width: 28,
                      height: 28,
                      color: "hsl(197 100% 45%)",
                      opacity: 0.8,
                      fill: "hsl(197 100% 45%)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "hsl(240 5% 46%)",
                    fontWeight: 500,
                  }}
                >
                  {project.name}
                </p>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 10,
                  fontSize: 10,
                  color: "hsl(240 5% 40%)",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.04em",
                }}
              >
                F{String(frame).padStart(2, "0")}
              </div>
              {isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "hsl(197 100% 45%)",
                      animation: "pulse 1s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "hsl(197 100% 55%)",
                    }}
                  >
                    LIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Playback controls */}
          <div className="play-controls" data-ocid="editor.playback.panel">
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => setCurrentTime((t) => Math.max(0, t - 5))}
              title="Back 5s"
            >
              <Rewind style={{ width: 13, height: 13 }} />
            </button>
            <button
              type="button"
              className="ctrl-btn"
              onClick={handleStop}
              title="Stop"
              data-ocid="editor.stop.button"
            >
              <Square style={{ width: 13, height: 13 }} />
            </button>
            <button
              type="button"
              className="ctrl-btn play-btn"
              onClick={handlePlay}
              title={isPlaying ? "Pause" : "Play"}
              data-ocid="editor.play.button"
            >
              {isPlaying ? (
                <Pause style={{ width: 16, height: 16 }} />
              ) : (
                <Play style={{ width: 16, height: 16 }} />
              )}
            </button>
            <button
              type="button"
              className="ctrl-btn"
              onClick={() =>
                setCurrentTime((t) => Math.min(TOTAL_DURATION, t + 5))
              }
              title="Forward 5s"
            >
              <FastForward style={{ width: 13, height: 13 }} />
            </button>

            {/* Seek bar */}
            <input
              type="range"
              min={0}
              max={TOTAL_DURATION}
              step={0.1}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="flex-1 mx-1.5 h-1 accent-primary cursor-pointer"
              style={{ margin: "0 6px" }}
              aria-label="Seek"
            />

            <span className="timecode">{formatTime(currentTime)}</span>

            <button
              type="button"
              className="ctrl-btn"
              onClick={() => toast.info("Volume")}
              title="Volume"
            >
              <Volume2 style={{ width: 13, height: 13 }} />
            </button>
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => toast.info("Fullscreen")}
              title="Fullscreen"
              data-ocid="editor.fullscreen.button"
            >
              <Maximize style={{ width: 13, height: 13 }} />
            </button>
          </div>

          {/* Timeline */}
          <div className="timeline-area" data-ocid="editor.timeline.panel">
            <div className="timeline-ruler">
              {Array.from({ length: 13 }, (_, i) => (
                <div key={`ruler-${i * 5}`} className="ruler-tick">
                  {i * 5}s
                </div>
              ))}
            </div>
            <div className="timeline-tracks">
              {/* Video */}
              <div className="timeline-track">
                <div
                  className="track-label"
                  style={{ borderLeft: "3px solid #0ea5e9" }}
                >
                  VIDEO
                </div>
                <div
                  className="track-content"
                  style={{ minWidth: `${zoom * 6}px` }}
                >
                  {TIMELINE_CLIPS.video.map((c) => (
                    <div
                      key={c.label}
                      className="track-clip"
                      style={{
                        left: `${(c.start / TOTAL_DURATION) * 100}%`,
                        width: `${((c.end - c.start) / TOTAL_DURATION) * 100}%`,
                        background: c.color,
                        opacity: 0.85,
                      }}
                    >
                      {c.label}
                    </div>
                  ))}
                  <div
                    className="playhead"
                    style={{ left: `${timelineProgress}%` }}
                  />
                </div>
              </div>
              {/* Audio */}
              <div className="timeline-track">
                <div
                  className="track-label"
                  style={{ borderLeft: "3px solid #10b981" }}
                >
                  AUDIO
                </div>
                <div
                  className="track-content"
                  style={{ minWidth: `${zoom * 6}px` }}
                >
                  {TIMELINE_CLIPS.audio.map((c) => (
                    <div
                      key={c.label}
                      className="track-clip"
                      style={{
                        left: `${(c.start / TOTAL_DURATION) * 100}%`,
                        width: `${((c.end - c.start) / TOTAL_DURATION) * 100}%`,
                        background: c.color,
                        opacity: 0.75,
                      }}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
              {/* FX */}
              <div className="timeline-track">
                <div
                  className="track-label"
                  style={{ borderLeft: "3px solid #f59e0b" }}
                >
                  FX
                </div>
                <div
                  className="track-content"
                  style={{ minWidth: `${zoom * 6}px` }}
                >
                  {TIMELINE_CLIPS.effects.map((c) => (
                    <div
                      key={c.label}
                      className="track-clip"
                      style={{
                        left: `${(c.start / TOTAL_DURATION) * 100}%`,
                        width: `${((c.end - c.start) / TOTAL_DURATION) * 100}%`,
                        background: c.color,
                        opacity: 0.8,
                      }}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
              {/* Captions */}
              <div className="timeline-track">
                <div
                  className="track-label"
                  style={{ borderLeft: "3px solid #a855f7" }}
                >
                  CAPT
                </div>
                <div
                  className="track-content"
                  style={{ minWidth: `${zoom * 6}px` }}
                >
                  <div
                    className="track-clip"
                    style={{
                      left: "8%",
                      width: "28%",
                      background: "#a855f7",
                      opacity: 0.75,
                    }}
                  >
                    Caption 1
                  </div>
                  <div
                    className="track-clip"
                    style={{
                      left: "48%",
                      width: "22%",
                      background: "#a855f7",
                      opacity: 0.75,
                    }}
                  >
                    Caption 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RightPanel />
      </div>
    </div>
  );
}
