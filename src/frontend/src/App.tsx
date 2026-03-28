import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { JobStatus, JobType } from "./backend";
import type { AIJob, Project } from "./backend";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ─────────────────────── types ───────────────────────
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

type RightTab = "props" | "color" | "speed" | "audio" | "export";
type AudioSubTab = "music" | "songs" | "meme" | "pleasant" | "templates";
type CaptionLang = "en" | "te" | "hi";

// ─────────────────────── constants ───────────────────────
const LEFT_TABS: { id: LeftTab; icon: string; label: string }[] = [
  { id: "media", icon: "🎬", label: "Media" },
  { id: "audio", icon: "🎵", label: "Audio" },
  { id: "effects", icon: "✨", label: "Effects" },
  { id: "filters", icon: "🎨", label: "Filters" },
  { id: "stickers", icon: "😊", label: "Sticker" },
  { id: "text", icon: "T", label: "Text" },
  { id: "transitions", icon: "⚡", label: "Trans" },
  { id: "captions", icon: "💬", label: "Caption" },
  { id: "ai", icon: "🤖", label: "AI" },
  { id: "templates", icon: "📐", label: "Tmpl" },
  { id: "voiceover", icon: "🎤", label: "Voice" },
];

const RIGHT_TABS: { id: RightTab; label: string }[] = [
  { id: "props", label: "Props" },
  { id: "color", label: "Color" },
  { id: "speed", label: "Speed" },
  { id: "audio", label: "Audio" },
  { id: "export", label: "Export" },
];

const AUDIO_SUB: { id: AudioSubTab; label: string }[] = [
  { id: "music", label: "Music" },
  { id: "songs", label: "Songs" },
  { id: "meme", label: "Meme" },
  { id: "pleasant", label: "Pleasant" },
  { id: "templates", label: "Templates" },
];

const MUSIC_LIST = [
  { title: "Cinematic Rise", dur: "2:34", bpm: 120 },
  { title: "Epic Beat Drop", dur: "3:12", bpm: 140 },
  { title: "Chill Lofi Groove", dur: "2:50", bpm: 85 },
  { title: "Action Hero Theme", dur: "1:45", bpm: 160 },
  { title: "Soft Piano Mood", dur: "3:05", bpm: 70 },
];
const SONG_LIST = [
  { title: "Naatu Naatu", dur: "3:45", lang: "Telugu" },
  { title: "Kesariya", dur: "4:10", lang: "Hindi" },
  { title: "Buttabomma", dur: "3:30", lang: "Telugu" },
  { title: "Raataan Lambiyan", dur: "4:05", lang: "Hindi" },
];
const MEME_LIST = [
  { title: "Bruh Sound", dur: "0:03" },
  { title: "Dramatic Chipmunk", dur: "0:05" },
  { title: "Vine Boom", dur: "0:02" },
  { title: "Stonks", dur: "0:04" },
  { title: "MLG Airhorn", dur: "0:02" },
  { title: "Oh No", dur: "0:03" },
];
const PLEASANT_LIST = [
  { title: "Forest Birds", dur: "5:00" },
  { title: "Rain & Thunder", dur: "10:00" },
  { title: "Ocean Waves", dur: "8:00" },
  { title: "Fireplace Crackle", dur: "6:00" },
];
const EFFECTS = [
  { name: "Glitch", icon: "⚡" },
  { name: "Blur", icon: "💨" },
  { name: "Shake", icon: "📳" },
  { name: "Flash", icon: "🌟" },
  { name: "Zoom In", icon: "🔍" },
  { name: "Zoom Out", icon: "🔎" },
  { name: "Vignette", icon: "🌑" },
  { name: "Grain", icon: "🌫️" },
  { name: "Chromatic", icon: "🌈" },
  { name: "Mirror", icon: "🪞" },
  { name: "Pixelate", icon: "▪️" },
  { name: "Wave", icon: "〰️" },
];
const FILTERS = [
  { name: "Cinematic", icon: "🎬", style: "brightness(0.85) contrast(1.15)" },
  { name: "Vintage", icon: "📷", style: "sepia(0.6) contrast(1.1)" },
  { name: "Vivid", icon: "🌈", style: "saturate(1.8) contrast(1.1)" },
  { name: "B&W", icon: "⚫", style: "grayscale(1) contrast(1.2)" },
  { name: "Cool", icon: "❄️", style: "hue-rotate(30deg) saturate(1.2)" },
  { name: "Warm", icon: "🔥", style: "hue-rotate(-20deg) saturate(1.3)" },
  { name: "Drama", icon: "🎭", style: "contrast(1.4) brightness(0.9)" },
  { name: "Fade", icon: "🌫️", style: "brightness(1.1) saturate(0.7)" },
];
const STICKERS = [
  "😂",
  "🔥",
  "💯",
  "👏",
  "❤️",
  "🎉",
  "✅",
  "⭐",
  "🚀",
  "💪",
  "👑",
  "🎯",
  "💡",
  "📣",
  "🌟",
  "😎",
  "🤩",
  "💥",
  "🎊",
  "🙌",
];
const TEXT_STYLES = [
  { name: "Heading", style: { fontSize: 16, weight: "bold" } },
  { name: "Subheading", style: { fontSize: 13, weight: "600" } },
  { name: "Body", style: { fontSize: 11, weight: "400" } },
  { name: "Caption", style: { fontSize: 10, weight: "400" } },
  { name: "Highlight", style: { fontSize: 13, weight: "bold" } },
  { name: "Title Card", style: { fontSize: 20, weight: "900" } },
];
const TRANSITIONS = [
  { name: "Cut", icon: "✂️" },
  { name: "Fade", icon: "🌅" },
  { name: "Dissolve", icon: "💧" },
  { name: "Wipe Left", icon: "⬅️" },
  { name: "Wipe Right", icon: "➡️" },
  { name: "Slide Up", icon: "⬆️" },
  { name: "Zoom", icon: "🔍" },
  { name: "Spin", icon: "🌀" },
  { name: "Bounce", icon: "⬇️" },
  { name: "Flash", icon: "⚡" },
];
const TEMPLATES = [
  { name: "YouTube Intro", ratio: "16:9", dur: "0:15" },
  { name: "Instagram Reel", ratio: "9:16", dur: "0:30" },
  { name: "TikTok Trend", ratio: "9:16", dur: "0:60" },
  { name: "Cinematic", ratio: "21:9", dur: "2:00" },
  { name: "Slideshow", ratio: "16:9", dur: "1:00" },
  { name: "Wedding Film", ratio: "16:9", dur: "5:00" },
];
const AI_TOOLS: { label: string; jobType: JobType | null; icon: string }[] = [
  { label: "Text to Speech", jobType: JobType.tts, icon: "🗣️" },
  { label: "AI Auto Cut", jobType: JobType.autoCut, icon: "✂️" },
  { label: "AI Remover", jobType: JobType.remover, icon: "🧹" },
  { label: "Image to Video", jobType: JobType.imageToVideo, icon: "🖼️" },
  { label: "AI Best Sync", jobType: JobType.autoCut, icon: "🔄" },
  { label: "Edit Speech", jobType: JobType.tts, icon: "✏️" },
  { label: "Text to Video", jobType: JobType.textToVideo, icon: "📝" },
  { label: "Video Gen", jobType: JobType.textToVideo, icon: "🎥" },
  { label: "Story to Video", jobType: JobType.textToVideo, icon: "📖" },
  { label: "Auto Speech", jobType: JobType.tts, icon: "🎤" },
  { label: "Auto Captions", jobType: JobType.captions, icon: "💬" },
  { label: "AI Show", jobType: null, icon: "✨" },
];

// ─────────────────────── login screen ───────────────────────
function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div
      style={{
        height: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#e63946",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          PR EDITOR
        </div>
        <div style={{ fontSize: 13, color: "#555", marginBottom: 32 }}>
          Professional AI Video Editor
        </div>
        <button
          type="button"
          className="tool-btn red"
          style={{
            padding: "12px 32px",
            fontSize: 13,
            justifyContent: "center",
          }}
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="login.primary_button"
        >
          {isLoggingIn ? "Logging in..." : "Login to Start"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────── dashboard ───────────────────────
function Dashboard({
  onOpenProject,
}: { onOpenProject: (p: Project | null) => void }) {
  const { actor, isFetching } = useActor();
  const { clear, identity } = useInternetIdentity();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    actor
      .getMyProjects()
      .then((p) => {
        setProjects(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, isFetching]);

  const createProject = async () => {
    if (!actor || !newName.trim()) return;
    setCreating(true);
    try {
      const p = await actor.createProject({
        name: newName.trim(),
        captions: [],
        mediaFiles: [],
      });
      toast.success("Project created");
      setProjects((prev) => [p, ...prev]);
      setNewName("");
      onOpenProject(p);
    } catch {
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="editor-header">
        <div className="logo">PR EDITOR</div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "#555" }}>
          {identity?.getPrincipal().toString().slice(0, 12)}...
        </span>
        <button
          type="button"
          className="tb-btn"
          onClick={clear}
          data-ocid="dashboard.logout_button"
          style={{ marginLeft: 8 }}
        >
          Logout
        </button>
      </div>
      <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <input
            className="text-input"
            style={{ maxWidth: 280, marginBottom: 0 }}
            placeholder="New project name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createProject()}
            data-ocid="dashboard.input"
          />
          <button
            type="button"
            className="tool-btn red"
            style={{ width: "auto", marginBottom: 0 }}
            onClick={createProject}
            disabled={creating || !newName.trim()}
            data-ocid="dashboard.primary_button"
          >
            {creating ? "Creating..." : "+ New Project"}
          </button>
          <button
            type="button"
            className="tool-btn"
            style={{ width: "auto", marginBottom: 0 }}
            onClick={() => onOpenProject(null)}
            data-ocid="dashboard.secondary_button"
          >
            Open Editor
          </button>
        </div>
        {loading ? (
          <div
            style={{ color: "#555", fontSize: 13 }}
            data-ocid="dashboard.loading_state"
          >
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              color: "#444",
              fontSize: 13,
              textAlign: "center",
              marginTop: 60,
            }}
            data-ocid="dashboard.empty_state"
          >
            No projects yet. Create one above to get started.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {projects.map((p, i) => (
              <button
                type="button"
                key={p.id}
                className="grid-card"
                style={{ alignItems: "flex-start", padding: 14 }}
                onClick={() => onOpenProject(p)}
                data-ocid={`dashboard.item.${i + 1}`}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎬</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#eee",
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 10, color: "#555" }}>
                  {new Date(
                    Number(p.createdAt) / 1_000_000,
                  ).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────── prop slider ───────────────────────
function PropSlider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <input
        type="range"
        className="prop-slider"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="prop-value">
        {value}
        {unit ?? ""}
      </span>
    </div>
  );
}

// ─────────────────────── editor ───────────────────────
export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [project, setProject] = useState<Project | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // panel state
  const [leftTab, setLeftTab] = useState<LeftTab>("media");
  const [rightTab, setRightTab] = useState<RightTab>("props");
  const [audioSub, setAudioSub] = useState<AudioSubTab>("music");
  const [captionLang, setCaptionLang] = useState<CaptionLang>("en");
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"videos" | "images" | "audio">(
    "videos",
  );
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  // playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const duration = 30;

  // properties
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [speed, setSpeed] = useState(100);
  const speedRef = useRef(100);
  speedRef.current = speed;
  const [volume, setVolume] = useState(100);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [exportFormat, setExportFormat] = useState("MP4");
  const [exportQuality, setExportQuality] = useState("1080p");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // AI jobs
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [runningJob, setRunningJob] = useState<string | null>(null);

  // voiceover
  const [recording, setRecording] = useState(false);

  // playback loop
  const tick = useCallback((ts: number) => {
    if (lastTsRef.current !== null) {
      const delta = (ts - lastTsRef.current) / 1000;
      setTime((prev) => {
        const next = prev + delta * (speedRef.current / 100);
        if (next >= 30) {
          setIsPlaying(false);
          return 30;
        }
        return next;
      });
    }
    lastTsRef.current = ts;
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, tick]);

  const togglePlay = () => {
    if (time >= duration) setTime(0);
    setIsPlaying((p) => !p);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const fr = Math.floor((s % 1) * 10);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${fr}`;
  };

  const runAIJob = async (jobType: JobType | null, label: string) => {
    if (!actor || !jobType) {
      toast.info(`${label} — coming soon`);
      return;
    }
    setRunningJob(label);
    try {
      const job = await actor.createAIJob(jobType, null);
      setJobs((prev) => [job, ...prev]);
      toast.success(`${label} job started`);
    } catch {
      toast.error(`Failed to start ${label}`);
    } finally {
      setRunningJob(null);
    }
  };

  const doExport = () => {
    toast.success(`Exporting ${exportQuality} ${exportFormat}...`);
  };

  if (isInitializing) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ color: "#555", fontSize: 13 }}
          data-ocid="app.loading_state"
        >
          Initializing PR EDITOR...
        </div>
      </div>
    );
  }

  if (!identity)
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  if (showDashboard) {
    return (
      <>
        <Dashboard
          onOpenProject={(p) => {
            setProject(p);
            setShowDashboard(false);
          }}
        />
        <Toaster />
      </>
    );
  }

  // ── filter style for preview ──
  const filterStyle = activeFilter
    ? (FILTERS.find((f) => f.name === activeFilter)?.style ?? "none")
    : "none";

  return (
    <>
      <div className="editor-root">
        {/* HEADER */}
        <header className="editor-header">
          <button
            type="button"
            className="logo"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setShowDashboard(true)}
            data-ocid="header.link"
          >
            PR EDITOR
          </button>

          <div className="tb-sep" />

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.undo_button"
              onClick={() => toast.info("Undo")}
            >
              ↩ Undo
            </button>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.redo_button"
              onClick={() => toast.info("Redo")}
            >
              ↪ Redo
            </button>
          </div>
          <div className="tb-sep" />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.cut_button"
              onClick={() => toast.info("Cut")}
            >
              ✂️ Cut
            </button>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.split_button"
              onClick={() => toast.info("Split")}
            >
              ⚡ Split
            </button>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.trim_button"
              onClick={() => toast.info("Trim")}
            >
              ✂ Trim
            </button>
          </div>
          <div className="tb-sep" />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.speed_button"
              onClick={() => setRightTab("speed")}
            >
              ⚙ Speed
            </button>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.volume_button"
              onClick={() => setRightTab("audio")}
            >
              🔊 Volume
            </button>
          </div>
          <div className="tb-sep" />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.zoom_in_button"
              onClick={() => toast.info("Zoom In")}
            >
              🔍+
            </button>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.zoom_out_button"
              onClick={() => toast.info("Zoom Out")}
            >
              🔍-
            </button>
            <button
              type="button"
              className="tb-btn"
              data-ocid="header.markers_button"
              onClick={() => toast.info("Markers")}
            >
              📌 Markers
            </button>
          </div>

          <div style={{ flex: 1 }} />

          {project && (
            <span style={{ fontSize: 10, color: "#666", marginRight: 8 }}>
              {project.name}
            </span>
          )}
          <button
            type="button"
            className="tb-btn"
            data-ocid="header.save_button"
            onClick={() => toast.success("Saved!")}
          >
            💾 Save
          </button>
          <button
            type="button"
            className="tb-btn"
            data-ocid="header.share_button"
            onClick={() => toast.info("Share link copied")}
          >
            🔗 Share
          </button>
          <button
            type="button"
            className="tb-btn red-btn"
            onClick={doExport}
            data-ocid="header.export_button"
          >
            ▶ Export
          </button>
        </header>

        {/* BODY */}
        <div className="editor-body">
          {/* LEFT PANEL */}
          <aside className="left-panel">
            <div className="left-tab-icons">
              {LEFT_TABS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`left-tab-icon-btn${leftTab === t.id ? " active" : ""}`}
                  onClick={() => setLeftTab(t.id)}
                  data-ocid={`left_panel.${t.id}.tab`}
                  title={t.label}
                >
                  <span style={{ fontSize: 14 }}>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="left-panel-content">
              {/* MEDIA */}
              <div
                className={`tab-section${leftTab === "media" ? " visible" : ""}`}
              >
                <div className="section-label">Media Library</div>
                {/* Upload + Gallery buttons */}
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <button
                    type="button"
                    className="tool-btn"
                    style={{ flex: 1, justifyContent: "center", fontSize: 11 }}
                    onClick={() => {
                      const inp = document.createElement("input");
                      inp.type = "file";
                      inp.accept =
                        "video/*,image/*,audio/*,.mp4,.mov,.avi,.png,.jpg,.jpeg,.mp3,.wav";
                      inp.multiple = true;
                      inp.onchange = () => {
                        const files = Array.from(inp.files || []);
                        if (files.length) {
                          setSelectedMedia((prev) => [
                            ...prev,
                            ...files.map((f) => f.name),
                          ]);
                          toast.success(`${files.length} file(s) added`);
                        }
                      };
                      inp.click();
                    }}
                    data-ocid="media.upload_button"
                  >
                    📤 Upload
                  </button>
                  <button
                    type="button"
                    className="tool-btn cyan"
                    style={{ flex: 1, justifyContent: "center", fontSize: 11 }}
                    onClick={() => setShowGallery(true)}
                    data-ocid="media.gallery_button"
                  >
                    🖼 Gallery
                  </button>
                </div>
                <div className="section-label" style={{ marginTop: 4 }}>
                  Project Files
                </div>
                {(selectedMedia.length > 0
                  ? selectedMedia
                  : [
                      "Intro.mp4",
                      "Main_scene.mp4",
                      "Background.mp3",
                      "Logo.png",
                    ]
                ).map((f, i) => (
                  <div
                    key={f}
                    className="audio-item"
                    data-ocid={`media.item.${i + 1}`}
                  >
                    <span>
                      {f.endsWith(".mp3") || f.endsWith(".wav")
                        ? "🎵"
                        : f.endsWith(".png") ||
                            f.endsWith(".jpg") ||
                            f.endsWith(".jpeg")
                          ? "🖼️"
                          : "🎬"}
                    </span>
                    <span style={{ fontSize: 11, color: "#aaa", flex: 1 }}>
                      {f}
                    </span>
                    {selectedMedia.length > 0 && (
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff4444",
                          cursor: "pointer",
                          fontSize: 12,
                          padding: "0 2px",
                        }}
                        onClick={() =>
                          setSelectedMedia((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* AUDIO */}
              <div
                className={`tab-section${leftTab === "audio" ? " visible" : ""}`}
              >
                <div className="sub-tabs">
                  {AUDIO_SUB.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className={`sub-tab-btn${audioSub === s.id ? " active" : ""}`}
                      onClick={() => setAudioSub(s.id)}
                      data-ocid={`audio.${s.id}.tab`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {audioSub === "music" && (
                  <>
                    <div className="section-label">Background Music</div>
                    {MUSIC_LIST.map((m, i) => (
                      <div
                        key={m.title}
                        className="audio-item"
                        data-ocid={`audio.music.item.${i + 1}`}
                      >
                        <button
                          type="button"
                          style={{
                            background: "#e63946",
                            border: "none",
                            borderRadius: 3,
                            width: 18,
                            height: 18,
                            color: "#fff",
                            fontSize: 8,
                            cursor: "pointer",
                          }}
                        >
                          ▶
                        </button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "#ccc" }}>
                            {m.title}
                          </div>
                          <div style={{ fontSize: 9, color: "#555" }}>
                            {m.dur} · {m.bpm} BPM
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            color: "#888",
                            fontSize: 9,
                            padding: "2px 6px",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {audioSub === "songs" && (
                  <>
                    <div className="section-label">Songs</div>
                    {SONG_LIST.map((s, i) => (
                      <div
                        key={s.title}
                        className="audio-item"
                        data-ocid={`audio.songs.item.${i + 1}`}
                      >
                        <button
                          type="button"
                          style={{
                            background: "#e63946",
                            border: "none",
                            borderRadius: 3,
                            width: 18,
                            height: 18,
                            color: "#fff",
                            fontSize: 8,
                            cursor: "pointer",
                          }}
                        >
                          ▶
                        </button>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "#ccc" }}>
                            {s.title}
                          </div>
                          <div style={{ fontSize: 9, color: "#555" }}>
                            {s.dur} · {s.lang}
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            color: "#888",
                            fontSize: 9,
                            padding: "2px 6px",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {audioSub === "meme" && (
                  <>
                    <div className="section-label">Meme Sounds</div>
                    {MEME_LIST.map((m, i) => (
                      <div
                        key={m.title}
                        className="audio-item"
                        data-ocid={`audio.meme.item.${i + 1}`}
                      >
                        <button
                          type="button"
                          style={{
                            background: "#e63946",
                            border: "none",
                            borderRadius: 3,
                            width: 18,
                            height: 18,
                            color: "#fff",
                            fontSize: 8,
                            cursor: "pointer",
                          }}
                        >
                          ▶
                        </button>
                        <span style={{ fontSize: 11, color: "#ccc", flex: 1 }}>
                          {m.title}
                        </span>
                        <span style={{ fontSize: 9, color: "#555" }}>
                          {m.dur}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {audioSub === "pleasant" && (
                  <>
                    <div className="section-label">Pleasant Sounds</div>
                    {PLEASANT_LIST.map((p, i) => (
                      <div
                        key={p.title}
                        className="audio-item"
                        data-ocid={`audio.pleasant.item.${i + 1}`}
                      >
                        <button
                          type="button"
                          style={{
                            background: "#e63946",
                            border: "none",
                            borderRadius: 3,
                            width: 18,
                            height: 18,
                            color: "#fff",
                            fontSize: 8,
                            cursor: "pointer",
                          }}
                        >
                          ▶
                        </button>
                        <span style={{ fontSize: 11, color: "#ccc", flex: 1 }}>
                          {p.title}
                        </span>
                        <span style={{ fontSize: 9, color: "#555" }}>
                          {p.dur}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {audioSub === "templates" && (
                  <>
                    <div className="section-label">Audio Templates</div>
                    {[
                      "Upbeat Vlog",
                      "Dramatic Documentary",
                      "News Broadcast",
                      "Wedding Ceremony",
                      "Sports Highlights",
                    ].map((t, i) => (
                      <div
                        key={t}
                        className="audio-item"
                        data-ocid={`audio.templates.item.${i + 1}`}
                      >
                        <span style={{ fontSize: 11, color: "#ccc" }}>{t}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* EFFECTS */}
              <div
                className={`tab-section${leftTab === "effects" ? " visible" : ""}`}
              >
                <div className="section-label">Visual Effects</div>
                <div className="grid-2">
                  {EFFECTS.map((ef, i) => (
                    <button
                      type="button"
                      key={ef.name}
                      className="grid-card"
                      onClick={() => toast.info(`Applied: ${ef.name}`)}
                      data-ocid={`effects.item.${i + 1}`}
                    >
                      <span style={{ fontSize: 18 }}>{ef.icon}</span>
                      <span style={{ fontSize: 10 }}>{ef.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FILTERS */}
              <div
                className={`tab-section${leftTab === "filters" ? " visible" : ""}`}
              >
                <div className="section-label">Color Filters</div>
                <div className="grid-2">
                  {FILTERS.map((f, i) => (
                    <button
                      type="button"
                      key={f.name}
                      className="grid-card"
                      style={{
                        border:
                          activeFilter === f.name
                            ? "1px solid #e63946"
                            : undefined,
                      }}
                      onClick={() =>
                        setActiveFilter(activeFilter === f.name ? null : f.name)
                      }
                      data-ocid={`filters.item.${i + 1}`}
                    >
                      <span style={{ fontSize: 18 }}>{f.icon}</span>
                      <span style={{ fontSize: 10 }}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STICKERS */}
              <div
                className={`tab-section${leftTab === "stickers" ? " visible" : ""}`}
              >
                <div className="section-label">Stickers</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 4,
                  }}
                >
                  {STICKERS.map((s, i) => (
                    <button
                      type="button"
                      key={s}
                      className="grid-card"
                      style={{ fontSize: 22, padding: 8, cursor: "pointer" }}
                      onClick={() => toast.info(`Sticker added: ${s}`)}
                      data-ocid={`stickers.item.${i + 1}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEXT */}
              <div
                className={`tab-section${leftTab === "text" ? " visible" : ""}`}
              >
                <div className="section-label">Add Text</div>
                <input
                  className="text-input"
                  placeholder="Type your text..."
                  data-ocid="text.input"
                />
                <div className="section-label">Text Styles</div>
                {TEXT_STYLES.map((ts, i) => (
                  <button
                    type="button"
                    key={ts.name}
                    className="audio-item"
                    onClick={() => toast.info(`Style: ${ts.name}`)}
                    data-ocid={`text.item.${i + 1}`}
                  >
                    <span
                      style={{
                        fontSize: ts.style.fontSize - 2,
                        fontWeight: ts.style.weight,
                        color: "#ccc",
                        minWidth: 24,
                      }}
                    >
                      Aa
                    </span>
                    <span style={{ fontSize: 11, color: "#aaa" }}>
                      {ts.name}
                    </span>
                  </button>
                ))}
                <div className="section-label">Font</div>
                <select className="select-native" data-ocid="text.select">
                  <option>Satoshi</option>
                  <option>Sans-serif</option>
                  <option>Serif</option>
                  <option>Monospace</option>
                  <option>Pacifico</option>
                </select>
                <div className="section-label">Alignment</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["Left", "Center", "Right", "Justify"].map((a) => (
                    <button
                      type="button"
                      key={a}
                      className="tb-btn"
                      style={{ flex: 1, padding: 4, fontSize: 9 }}
                      data-ocid={`text.${a.toLowerCase()}_button`}
                    >
                      {a[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* TRANSITIONS */}
              <div
                className={`tab-section${leftTab === "transitions" ? " visible" : ""}`}
              >
                <div className="section-label">Transitions</div>
                <div className="grid-2">
                  {TRANSITIONS.map((tr, i) => (
                    <button
                      type="button"
                      key={tr.name}
                      className="grid-card"
                      onClick={() => toast.info(`Transition: ${tr.name}`)}
                      data-ocid={`transitions.item.${i + 1}`}
                    >
                      <span style={{ fontSize: 18 }}>{tr.icon}</span>
                      <span style={{ fontSize: 10 }}>{tr.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CAPTIONS */}
              <div
                className={`tab-section${leftTab === "captions" ? " visible" : ""}`}
              >
                <div className="section-label">Language</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {(["en", "te", "hi"] as CaptionLang[]).map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      className={`lang-btn${captionLang === lang ? " active" : ""}`}
                      onClick={() => setCaptionLang(lang)}
                      data-ocid={`captions.${lang}.button`}
                    >
                      {lang === "en"
                        ? "English"
                        : lang === "te"
                          ? "Telugu"
                          : "Hindi"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="tool-btn red"
                  style={{ justifyContent: "center" }}
                  onClick={() => runAIJob(JobType.captions, "Auto Captions")}
                  disabled={!!runningJob}
                  data-ocid="captions.generate_button"
                >
                  {runningJob === "Auto Captions"
                    ? "Generating..."
                    : "⚡ Auto Generate Captions"}
                </button>
                <div className="section-label">Caption Style</div>
                {["Default", "Bold White", "Yellow Highlight", "Subtitle"].map(
                  (cs, i) => (
                    <div
                      key={cs}
                      className="audio-item"
                      data-ocid={`captions.item.${i + 1}`}
                    >
                      <span style={{ fontSize: 11, color: "#ccc" }}>{cs}</span>
                    </div>
                  ),
                )}
                <div className="section-label">Settings</div>
                <PropSlider
                  label="Font size"
                  value={16}
                  min={8}
                  max={48}
                  unit="px"
                  onChange={() => {}}
                />
                <PropSlider
                  label="Position"
                  value={80}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={() => {}}
                />
              </div>

              {/* AI TOOLS */}
              <div
                className={`tab-section${leftTab === "ai" ? " visible" : ""}`}
              >
                <div className="section-label">AI Tools</div>
                <div className="grid-2">
                  {AI_TOOLS.map((tool, i) => (
                    <button
                      type="button"
                      key={tool.label}
                      className="grid-card"
                      onClick={() => runAIJob(tool.jobType, tool.label)}
                      disabled={runningJob === tool.label}
                      data-ocid={`ai.item.${i + 1}`}
                    >
                      <span style={{ fontSize: 18 }}>{tool.icon}</span>
                      <span style={{ fontSize: 9, lineHeight: 1.2 }}>
                        {runningJob === tool.label ? "Running..." : tool.label}
                      </span>
                    </button>
                  ))}
                </div>
                {jobs.length > 0 && (
                  <>
                    <div className="section-label">Recent Jobs</div>
                    {jobs.slice(0, 5).map((job, i) => (
                      <div
                        key={job.id}
                        className="audio-item"
                        data-ocid={`ai.jobs.item.${i + 1}`}
                      >
                        <span style={{ fontSize: 10, color: "#aaa", flex: 1 }}>
                          {job.jobType}
                        </span>
                        <span className={`status-badge status-${job.status}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* TEMPLATES */}
              <div
                className={`tab-section${leftTab === "templates" ? " visible" : ""}`}
              >
                <div className="section-label">Project Templates</div>
                {TEMPLATES.map((t, i) => (
                  <button
                    type="button"
                    key={t.name}
                    className="audio-item"
                    onClick={() => toast.info(`Template: ${t.name}`)}
                    data-ocid={`templates.item.${i + 1}`}
                  >
                    <span style={{ fontSize: 11, color: "#ccc", flex: 1 }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: 9, color: "#555" }}>
                      {t.ratio} · {t.dur}
                    </span>
                  </button>
                ))}
                <div className="section-label">Aspect Ratio</div>
                <select
                  className="select-native"
                  data-ocid="templates.ratio.select"
                >
                  <option>16:9 Landscape</option>
                  <option>9:16 Portrait</option>
                  <option>1:1 Square</option>
                  <option>21:9 Cinematic</option>
                  <option>4:3 Classic</option>
                </select>
              </div>

              {/* VOICEOVER */}
              <div
                className={`tab-section${leftTab === "voiceover" ? " visible" : ""}`}
              >
                <div className="section-label">Record Voiceover</div>
                <button
                  type="button"
                  className={`tool-btn${recording ? " red" : ""}`}
                  style={{ justifyContent: "center", padding: "12px" }}
                  onClick={() => {
                    setRecording((r) => !r);
                    toast.info(
                      recording ? "Recording stopped" : "Recording started...",
                    );
                  }}
                  data-ocid="voiceover.record_button"
                >
                  {recording ? "⏹ Stop Recording" : "🎤 Start Recording"}
                </button>
                {recording && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      height: 32,
                    }}
                  >
                    {Array.from(
                      { length: 30 },
                      (_, i) => `bar-${i * 7 + 3}`,
                    ).map((barId) => (
                      <div
                        key={barId}
                        style={{
                          flex: 1,
                          background: "#e63946",
                          borderRadius: 1,
                          height: `${20 + Math.sin((Number(barId.split("-")[1]) / 7) * 0.5) * 12}px`,
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="section-label">Voiceover Settings</div>
                <PropSlider
                  label="Volume"
                  value={volume}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={setVolume}
                />
                <PropSlider
                  label="Fade In"
                  value={fadeIn}
                  min={0}
                  max={5}
                  unit="s"
                  onChange={setFadeIn}
                />
                <PropSlider
                  label="Fade Out"
                  value={fadeOut}
                  min={0}
                  max={5}
                  unit="s"
                  onChange={setFadeOut}
                />
                <div className="section-label">Recordings</div>
                {["Take 1 (0:12)", "Take 2 (0:08)", "Take 3 (0:15)"].map(
                  (r, i) => (
                    <div
                      key={r}
                      className="audio-item"
                      data-ocid={`voiceover.item.${i + 1}`}
                    >
                      <button
                        type="button"
                        style={{
                          background: "#e63946",
                          border: "none",
                          borderRadius: 3,
                          width: 18,
                          height: 18,
                          color: "#fff",
                          fontSize: 8,
                          cursor: "pointer",
                        }}
                      >
                        ▶
                      </button>
                      <span style={{ fontSize: 11, color: "#ccc" }}>{r}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </aside>

          {/* CENTER AREA */}
          <main className="center-area">
            <div className="preview-area">
              <div
                className="preview-canvas"
                style={{ filter: filterStyle }}
                data-ocid="editor.canvas_target"
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎬</div>
                  <div style={{ fontSize: 12, color: "#444" }}>
                    {project ? project.name : "Drop media to start editing"}
                  </div>
                </div>
                {/* Playhead overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "#1a1a1a",
                  }}
                >
                  <div
                    style={{
                      width: `${(time / duration) * 100}%`,
                      height: "100%",
                      background: "#e63946",
                      transition: "width 0.05s linear",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PLAY CONTROLS */}
            <div className="play-controls">
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setTime(0)}
                data-ocid="player.rewind_button"
              >
                ⏮
              </button>
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setTime((t) => Math.max(0, t - 5))}
                data-ocid="player.back_button"
              >
                ⏪
              </button>
              <button
                type="button"
                className="ctrl-btn play-btn"
                onClick={togglePlay}
                data-ocid="player.play_button"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setTime((t) => Math.min(duration, t + 5))}
                data-ocid="player.forward_button"
              >
                ⏩
              </button>
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setTime(duration)}
                data-ocid="player.end_button"
              >
                ⏭
              </button>
              <span className="timecode">
                {formatTime(time)} / {formatTime(duration)}
              </span>
            </div>

            {/* TIMELINE */}
            <div className="timeline-area">
              <div className="timeline-ruler">
                {[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30].map((sec) => (
                  <div key={`tick-${sec}s`} className="ruler-tick">
                    {sec}s
                  </div>
                ))}
              </div>
              <div className="timeline-tracks" style={{ position: "relative" }}>
                {/* Playhead */}
                <div
                  className="playhead"
                  style={{
                    left: `calc(80px + ${(time / duration) * (60 * 11 - 0)}px)`,
                  }}
                />

                {[
                  {
                    label: "Video 1",
                    color: "#1e4a7a",
                    clips: [
                      { left: 0, width: 180, name: "Intro.mp4" },
                      { left: 200, width: 240, name: "Main.mp4" },
                    ],
                  },
                  {
                    label: "Audio 1",
                    color: "#1a5c2a",
                    clips: [{ left: 0, width: 420, name: "Background.mp3" }],
                  },
                  {
                    label: "Audio 2",
                    color: "#4a2a5c",
                    clips: [{ left: 100, width: 120, name: "SFX.mp3" }],
                  },
                  {
                    label: "Captions",
                    color: "#5c3a1a",
                    clips: [{ left: 30, width: 200, name: "En Subtitles" }],
                  },
                  {
                    label: "Effects",
                    color: "#3a1a1a",
                    clips: [{ left: 80, width: 100, name: "Glitch" }],
                  },
                ].map((track, ti) => (
                  <div
                    key={track.label}
                    className="timeline-track"
                    data-ocid={`timeline.row.${ti + 1}`}
                  >
                    <div className="track-label">{track.label}</div>
                    <div className="track-content">
                      {track.clips.map((clip, ci) => (
                        <div
                          key={`${clip.name}-${clip.left}`}
                          className="track-clip"
                          style={{
                            left: clip.left,
                            width: clip.width,
                            background: track.color,
                          }}
                          data-ocid={`timeline.clip.${ti + 1}.${ci + 1}`}
                        >
                          {clip.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT PANEL */}
          <aside className="right-panel">
            <div className="right-panel-tabs">
              {RIGHT_TABS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`right-tab-btn${rightTab === t.id ? " active" : ""}`}
                  onClick={() => setRightTab(t.id)}
                  data-ocid={`right_panel.${t.id}.tab`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="right-panel-content">
              {/* PROPERTIES */}
              {rightTab === "props" && (
                <div>
                  <div className="section-label">Position</div>
                  <PropSlider
                    label="X"
                    value={posX}
                    min={-500}
                    max={500}
                    unit="px"
                    onChange={setPosX}
                  />
                  <PropSlider
                    label="Y"
                    value={posY}
                    min={-500}
                    max={500}
                    unit="px"
                    onChange={setPosY}
                  />
                  <div className="section-label">Transform</div>
                  <PropSlider
                    label="Scale"
                    value={scale}
                    min={10}
                    max={300}
                    unit="%"
                    onChange={setScale}
                  />
                  <PropSlider
                    label="Rotate"
                    value={rotation}
                    min={-180}
                    max={180}
                    unit="°"
                    onChange={setRotation}
                  />
                  <PropSlider
                    label="Opacity"
                    value={opacity}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={setOpacity}
                  />
                  <div className="section-label">Flip</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      className="tb-btn"
                      style={{ flex: 1, fontSize: 10, padding: 5 }}
                      onClick={() => toast.info("Flip H")}
                      data-ocid="props.flip_h_button"
                    >
                      ↔ Flip H
                    </button>
                    <button
                      type="button"
                      className="tb-btn"
                      style={{ flex: 1, fontSize: 10, padding: 5 }}
                      onClick={() => toast.info("Flip V")}
                      data-ocid="props.flip_v_button"
                    >
                      ↕ Flip V
                    </button>
                  </div>
                </div>
              )}

              {/* COLOR */}
              {rightTab === "color" && (
                <div>
                  <div className="section-label">Adjustments</div>
                  <PropSlider
                    label="Brightness"
                    value={brightness}
                    min={0}
                    max={200}
                    unit="%"
                    onChange={setBrightness}
                  />
                  <PropSlider
                    label="Contrast"
                    value={contrast}
                    min={0}
                    max={200}
                    unit="%"
                    onChange={setContrast}
                  />
                  <PropSlider
                    label="Saturation"
                    value={saturation}
                    min={0}
                    max={200}
                    unit="%"
                    onChange={setSaturation}
                  />
                  <PropSlider
                    label="Hue"
                    value={hue}
                    min={-180}
                    max={180}
                    unit="°"
                    onChange={setHue}
                  />
                  <div className="section-label">Tone</div>
                  <PropSlider
                    label="Highlights"
                    value={100}
                    min={0}
                    max={200}
                    unit="%"
                    onChange={() => {}}
                  />
                  <PropSlider
                    label="Shadows"
                    value={100}
                    min={0}
                    max={200}
                    unit="%"
                    onChange={() => {}}
                  />
                  <PropSlider
                    label="Temp"
                    value={0}
                    min={-100}
                    max={100}
                    unit="K"
                    onChange={() => {}}
                  />
                  <div className="section-label">Vignette</div>
                  <PropSlider
                    label="Amount"
                    value={0}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={() => {}}
                  />
                  <button
                    type="button"
                    className="tool-btn"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      setBrightness(100);
                      setContrast(100);
                      setSaturation(100);
                      setHue(0);
                      toast.info("Color reset");
                    }}
                    data-ocid="color.reset_button"
                  >
                    ↺ Reset Color
                  </button>
                </div>
              )}

              {/* SPEED */}
              {rightTab === "speed" && (
                <div>
                  <div className="section-label">Playback Speed</div>
                  <PropSlider
                    label="Speed"
                    value={speed}
                    min={25}
                    max={400}
                    unit="%"
                    onChange={setSpeed}
                  />
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#e63946",
                      margin: "8px 0",
                    }}
                  >
                    {(speed / 100).toFixed(2)}x
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 8,
                    }}
                  >
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4].map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`tb-btn${speed === s * 100 ? " active" : ""}`}
                        style={{ fontSize: 10, padding: "4px 6px" }}
                        onClick={() => setSpeed(s * 100)}
                        data-ocid={`speed.${String(s).replace(".", "_")}_button`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                  <div className="section-label">Reverse</div>
                  <button
                    type="button"
                    className="tool-btn"
                    data-ocid="speed.reverse_button"
                    onClick={() => toast.info("Reverse applied")}
                  >
                    ⏪ Reverse Clip
                  </button>
                  <div className="section-label">Freeze Frame</div>
                  <button
                    type="button"
                    className="tool-btn"
                    data-ocid="speed.freeze_button"
                    onClick={() => toast.info("Freeze frame set")}
                  >
                    ❄️ Freeze at {formatTime(time)}
                  </button>
                </div>
              )}

              {/* AUDIO */}
              {rightTab === "audio" && (
                <div>
                  <div className="section-label">Volume</div>
                  <PropSlider
                    label="Volume"
                    value={volume}
                    min={0}
                    max={200}
                    unit="%"
                    onChange={setVolume}
                  />
                  <div className="section-label">Fade</div>
                  <PropSlider
                    label="Fade In"
                    value={fadeIn}
                    min={0}
                    max={5}
                    unit="s"
                    onChange={setFadeIn}
                  />
                  <PropSlider
                    label="Fade Out"
                    value={fadeOut}
                    min={0}
                    max={5}
                    unit="s"
                    onChange={setFadeOut}
                  />
                  <div className="section-label">Equalizer</div>
                  {["Bass", "Mid", "Treble"].map((band) => (
                    <PropSlider
                      key={band}
                      label={band}
                      value={0}
                      min={-12}
                      max={12}
                      unit="dB"
                      onChange={() => {}}
                    />
                  ))}
                  <div className="section-label">Effects</div>
                  {["Noise Reduction", "Echo", "Reverb", "Pitch Shift"].map(
                    (fx, i) => (
                      <button
                        type="button"
                        key={fx}
                        className="tool-btn"
                        data-ocid={`audio.fx.item.${i + 1}`}
                        onClick={() => toast.info(`Applied: ${fx}`)}
                      >
                        {fx}
                      </button>
                    ),
                  )}
                </div>
              )}

              {/* EXPORT */}
              {rightTab === "export" && (
                <div>
                  <div className="section-label">Format</div>
                  <select
                    className="select-native"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    data-ocid="export.format.select"
                  >
                    <option>MP4</option>
                    <option>MOV</option>
                    <option>GIF</option>
                    <option>WebM</option>
                    <option>AVI</option>
                  </select>
                  <div className="section-label">Quality</div>
                  <select
                    className="select-native"
                    value={exportQuality}
                    onChange={(e) => setExportQuality(e.target.value)}
                    data-ocid="export.quality.select"
                  >
                    <option>480p</option>
                    <option>720p</option>
                    <option>1080p</option>
                    <option>2K</option>
                    <option>4K</option>
                  </select>
                  <div className="section-label">Settings</div>
                  <PropSlider
                    label="FPS"
                    value={30}
                    min={15}
                    max={60}
                    unit="fps"
                    onChange={() => {}}
                  />
                  <PropSlider
                    label="Bitrate"
                    value={8}
                    min={1}
                    max={50}
                    unit="Mb"
                    onChange={() => {}}
                  />
                  <div className="section-label">Output</div>
                  <select
                    className="select-native"
                    data-ocid="export.codec.select"
                  >
                    <option>H.264</option>
                    <option>H.265 / HEVC</option>
                    <option>VP9</option>
                    <option>ProRes</option>
                  </select>
                  <button
                    type="button"
                    className="tool-btn red"
                    style={{
                      justifyContent: "center",
                      padding: 12,
                      marginTop: 8,
                    }}
                    onClick={doExport}
                    data-ocid="export.submit_button"
                  >
                    ▶ Export {exportQuality} {exportFormat}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      <Toaster />

      {/* ─── Gallery Modal ─── */}
      {showGallery && (
        <dialog
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGallery(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowGallery(false);
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "1px solid #00e5ff44",
              borderRadius: 12,
              width: "min(760px, 95vw)",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(0,229,255,0.15)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: "1px solid #ffffff11",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: "#00e5ff" }}>
                🖼 Media Gallery
              </span>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#aaa",
                  fontSize: 20,
                  cursor: "pointer",
                }}
                onClick={() => setShowGallery(false)}
              >
                ✕
              </button>
            </div>
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 6,
                padding: "10px 18px",
                borderBottom: "1px solid #ffffff11",
              }}
            >
              {(["videos", "images", "audio"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setGalleryTab(tab)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: "pointer",
                    background: galleryTab === tab ? "#00e5ff" : "#ffffff11",
                    color: galleryTab === tab ? "#000" : "#ccc",
                    border: "none",
                    fontWeight: galleryTab === tab ? 700 : 400,
                    textTransform: "capitalize",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Grid */}
            <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
                  gap: 12,
                }}
              >
                {galleryTab === "videos" &&
                  [
                    { name: "Intro Clip", dur: "0:12", thumb: "🎬" },
                    { name: "Main Scene", dur: "1:05", thumb: "🎬" },
                    { name: "Outro", dur: "0:08", thumb: "🎬" },
                    { name: "B-Roll 1", dur: "0:23", thumb: "🎬" },
                    { name: "B-Roll 2", dur: "0:18", thumb: "🎬" },
                    { name: "Title Card", dur: "0:05", thumb: "🎬" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setSelectedMedia((prev) => [
                          ...prev,
                          `${item.name}.mp4`,
                        ]);
                        toast.success(`${item.name} added`);
                        setShowGallery(false);
                      }}
                      style={{
                        background: "#0d0d1a",
                        border: "1px solid #ffffff15",
                        borderRadius: 8,
                        padding: 10,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "border-color 0.15s",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00e5ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff15";
                      }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 6 }}>
                        {item.thumb}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#ccc", marginBottom: 2 }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#666" }}>
                        {item.dur}
                      </div>
                    </button>
                  ))}
                {galleryTab === "images" &&
                  [
                    { name: "Background", thumb: "🖼️" },
                    { name: "Logo", thumb: "🖼️" },
                    { name: "Overlay 1", thumb: "🖼️" },
                    { name: "Overlay 2", thumb: "🖼️" },
                    { name: "Thumbnail", thumb: "🖼️" },
                    { name: "Banner", thumb: "🖼️" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setSelectedMedia((prev) => [
                          ...prev,
                          `${item.name}.png`,
                        ]);
                        toast.success(`${item.name} added`);
                        setShowGallery(false);
                      }}
                      style={{
                        background: "#0d0d1a",
                        border: "1px solid #ffffff15",
                        borderRadius: 8,
                        padding: 10,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "border-color 0.15s",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00e5ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff15";
                      }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 6 }}>
                        {item.thumb}
                      </div>
                      <div style={{ fontSize: 11, color: "#ccc" }}>
                        {item.name}
                      </div>
                    </button>
                  ))}
                {galleryTab === "audio" &&
                  [
                    { name: "BG Music", dur: "2:30", thumb: "🎵" },
                    { name: "SFX Hit", dur: "0:02", thumb: "🔊" },
                    { name: "Ambient", dur: "3:00", thumb: "🎵" },
                    { name: "Voiceover", dur: "0:45", thumb: "🎤" },
                    { name: "Jingle", dur: "0:15", thumb: "🎵" },
                    { name: "Transition", dur: "0:03", thumb: "🔊" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setSelectedMedia((prev) => [
                          ...prev,
                          `${item.name}.mp3`,
                        ]);
                        toast.success(`${item.name} added`);
                        setShowGallery(false);
                      }}
                      style={{
                        background: "#0d0d1a",
                        border: "1px solid #ffffff15",
                        borderRadius: 8,
                        padding: 10,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "border-color 0.15s",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00e5ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff15";
                      }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 6 }}>
                        {item.thumb}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#ccc", marginBottom: 2 }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#666" }}>
                        {item.dur}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
