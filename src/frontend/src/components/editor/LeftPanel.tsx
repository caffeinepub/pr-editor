import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Film,
  FolderOpen,
  Grid2X2,
  ImageIcon,
  LayoutTemplate,
  Mic,
  Music,
  Play,
  Plus,
  Search,
  Shuffle,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Subtitles,
  Type,
  Upload,
  Video,
  Wand2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { JobType } from "../../backend";
import { useCreateAIJob } from "../../hooks/useQueries";

type TabId =
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

const TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: "media", icon: Film, label: "Media" },
  { id: "audio", icon: Music, label: "Audio" },
  { id: "effects", icon: Sparkles, label: "FX" },
  { id: "filters", icon: SlidersHorizontal, label: "Filter" },
  { id: "stickers", icon: Smile, label: "Sticker" },
  { id: "text", icon: Type, label: "Text" },
  { id: "transitions", icon: Shuffle, label: "Trans." },
  { id: "captions", icon: Subtitles, label: "Caption" },
  { id: "ai", icon: Wand2, label: "AI" },
  { id: "templates", icon: LayoutTemplate, label: "Tmpl" },
  { id: "voiceover", icon: Mic, label: "Voice" },
];

const AUDIO_TRACKS: Record<string, { name: string; duration: string }[]> = {
  Music: [
    { name: "Cinematic Rise", duration: "2:34" },
    { name: "Epic Drums", duration: "3:12" },
    { name: "Ambient Flow", duration: "4:05" },
    { name: "Electronic Beat", duration: "2:58" },
    { name: "Acoustic Warmth", duration: "3:44" },
  ],
  Songs: [
    { name: "Summer Vibes", duration: "3:28" },
    { name: "Midnight Drive", duration: "4:01" },
    { name: "Golden Hour", duration: "3:55" },
    { name: "Chill Hop Mix", duration: "2:47" },
  ],
  "Meme Sounds": [
    { name: "Vine Boom", duration: "0:02" },
    { name: "Bruh", duration: "0:01" },
    { name: "Wow", duration: "0:03" },
    { name: "Sad Violin", duration: "0:05" },
    { name: "Air Horn", duration: "0:02" },
    { name: "Nyan Cat", duration: "0:08" },
  ],
  "Pleasant Sounds": [
    { name: "Rain Forest", duration: "5:00" },
    { name: "Ocean Waves", duration: "5:00" },
    { name: "Fireplace", duration: "5:00" },
    { name: "Coffee Shop", duration: "5:00" },
  ],
};

const EFFECTS = [
  "Blur",
  "Glow",
  "Vignette",
  "Lens Flare",
  "Shake",
  "Zoom Pulse",
  "Light Leak",
  "Film Grain",
  "Glitch",
  "Chromatic",
  "Pixelate",
  "Mosaic",
];
const FILTERS = [
  "Cinematic",
  "Warm Tone",
  "Cold Blue",
  "Vintage",
  "Black & White",
  "Sepia",
  "Faded",
  "Vivid",
  "Matte",
  "Fuji",
  "Kodak",
  "Polaroid",
];
const STICKERS = [
  "\uD83C\uDFAC",
  "\uD83D\uDD25",
  "\u2B50",
  "\uD83D\uDCAB",
  "\uD83C\uDFB5",
  "\u2764\uFE0F",
  "\uD83D\uDE02",
  "\uD83E\uDD19",
  "\u2728",
  "\uD83C\uDF89",
  "\uD83D\uDCAF",
  "\uD83D\uDC51",
  "\uD83C\uDF08",
  "\uD83E\uDD8B",
  "\uD83C\uDFAF",
  "\uD83D\uDC8E",
];
const TRANSITIONS = [
  "Cut",
  "Dissolve",
  "Fade",
  "Wipe",
  "Slide",
  "Zoom",
  "Spin",
  "Glitch",
  "Blur",
  "Flash",
  "Push",
  "Cube",
];
const TEMPLATES = [
  { name: "Cinematic Reel", icon: "\uD83C\uDFAC" },
  { name: "Vlog Style", icon: "\uD83D\uDCF9" },
  { name: "Travel Montage", icon: "\u2708\uFE0F" },
  { name: "Product Promo", icon: "\uD83D\uDED2" },
  { name: "Social Short", icon: "\uD83D\uDCF1" },
  { name: "Wedding Film", icon: "\uD83D\uDC8D" },
];
const AI_TOOLS = [
  { label: "Text to Speech", icon: "🗣️", job: JobType.tts },
  { label: "AI Auto Cut", icon: "✂️", job: JobType.autoCut },
  { label: "Background Remove", icon: "🎭", job: JobType.remover },
  { label: "Image to Video", icon: "🖼️", job: JobType.imageToVideo },
  { label: "Auto Caption", icon: "💬", job: JobType.captions },
  { label: "Text to Video", icon: "📝", job: JobType.textToVideo },
];

type GalleryCat = "Videos" | "Images" | "Audio";

const GALLERY_ITEMS: Record<
  GalleryCat,
  { name: string; thumb: string; duration?: string }[]
> = {
  Videos: [
    {
      name: "City Timelapse",
      thumb: "https://picsum.photos/seed/vid1/120/68",
      duration: "0:30",
    },
    {
      name: "Ocean Sunset",
      thumb: "https://picsum.photos/seed/vid2/120/68",
      duration: "0:45",
    },
    {
      name: "Forest Walk",
      thumb: "https://picsum.photos/seed/vid3/120/68",
      duration: "1:00",
    },
    {
      name: "Studio Lights",
      thumb: "https://picsum.photos/seed/vid4/120/68",
      duration: "0:20",
    },
    {
      name: "Drone Aerial",
      thumb: "https://picsum.photos/seed/vid5/120/68",
      duration: "0:55",
    },
    {
      name: "Crowd Scene",
      thumb: "https://picsum.photos/seed/vid6/120/68",
      duration: "0:38",
    },
    {
      name: "Night Drive",
      thumb: "https://picsum.photos/seed/vid7/120/68",
      duration: "1:10",
    },
    {
      name: "Mountain Top",
      thumb: "https://picsum.photos/seed/vid8/120/68",
      duration: "0:25",
    },
  ],
  Images: [
    { name: "Abstract Red", thumb: "https://picsum.photos/seed/img1/120/68" },
    { name: "Blue Bokeh", thumb: "https://picsum.photos/seed/img2/120/68" },
    { name: "Architecture", thumb: "https://picsum.photos/seed/img3/120/68" },
    { name: "Portrait", thumb: "https://picsum.photos/seed/img4/120/68" },
    { name: "Landscape", thumb: "https://picsum.photos/seed/img5/120/68" },
    { name: "Product Shot", thumb: "https://picsum.photos/seed/img6/120/68" },
    { name: "Texture Dark", thumb: "https://picsum.photos/seed/img7/120/68" },
    { name: "Neon City", thumb: "https://picsum.photos/seed/img8/120/68" },
  ],
  Audio: [
    { name: "Epic Intro", thumb: "", duration: "0:15" },
    { name: "Soft Piano", thumb: "", duration: "1:30" },
    { name: "Bass Drop", thumb: "", duration: "0:08" },
    { name: "Crowd Cheer", thumb: "", duration: "0:05" },
    { name: "Wind Ambience", thumb: "", duration: "3:00" },
    { name: "Drum Fill", thumb: "", duration: "0:04" },
  ],
};

function GalleryModal({ onClose }: { onClose: () => void }) {
  const [cat, setCat] = useState<GalleryCat>("Videos");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function addSelected() {
    if (selected.size === 0) {
      toast.warning("Select at least one item");
      return;
    }
    toast.success(
      `Added ${selected.size} item${selected.size > 1 ? "s" : ""} to timeline`,
    );
    onClose();
  }

  const items = GALLERY_ITEMS[cat];

  return (
    <button
      type="button"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "default",
      }}
      onClick={onClose}
    >
      <dialog
        open
        style={{
          background: "#0f1117",
          border: "1px solid #1e2535",
          borderRadius: 10,
          width: 520,
          maxWidth: "95vw",
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 0,
          margin: 0,
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #1e2535",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Grid2X2 style={{ width: 16, height: 16, color: "#06b6d4" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
              Media Gallery
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Category tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "10px 16px 0",
            borderBottom: "1px solid #1e2535",
          }}
        >
          {(["Videos", "Images", "Audio"] as GalleryCat[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              style={{
                padding: "5px 14px",
                borderRadius: "6px 6px 0 0",
                fontSize: 11,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: cat === c ? "#06b6d4" : "transparent",
                color: cat === c ? "#0f1117" : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          {cat === "Audio" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((item) => {
                const sel = selected.has(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggle(item.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 7,
                      border: sel
                        ? "1.5px solid #06b6d4"
                        : "1.5px solid #1e2535",
                      background: sel ? "rgba(6,182,212,0.08)" : "#161b27",
                      cursor: "pointer",
                      transition: "all 0.12s",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: sel ? "#06b6d4" : "#1e2535",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Music
                        style={{
                          width: 14,
                          height: 14,
                          color: sel ? "#0f1117" : "#64748b",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#e2e8f0",
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>
                        {item.duration}
                      </p>
                    </div>
                    {sel && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#06b6d4",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {items.map((item) => {
                const sel = selected.has(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggle(item.name)}
                    style={{
                      border: sel
                        ? "2px solid #06b6d4"
                        : "2px solid transparent",
                      borderRadius: 7,
                      overflow: "hidden",
                      cursor: "pointer",
                      background: "#161b27",
                      padding: 0,
                      position: "relative",
                      transition: "border-color 0.12s",
                    }}
                  >
                    <img
                      src={item.thumb}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: 60,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {item.duration && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 20,
                          right: 4,
                          background: "rgba(0,0,0,0.7)",
                          borderRadius: 3,
                          padding: "1px 4px",
                          fontSize: 9,
                          color: "#e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        {item.duration}
                      </div>
                    )}
                    {sel && (
                      <div
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "#06b6d4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            color: "#0f1117",
                            fontWeight: 800,
                          }}
                        >
                          ✓
                        </span>
                      </div>
                    )}
                    <p
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        margin: "3px 4px 4px",
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #1e2535",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: "#64748b" }}>
            {selected.size > 0
              ? `${selected.size} selected`
              : "Click items to select"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "5px 14px",
                borderRadius: 6,
                fontSize: 11,
                border: "1px solid #1e2535",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addSelected}
              style={{
                padding: "5px 14px",
                borderRadius: 6,
                fontSize: 11,
                border: "none",
                background: "#06b6d4",
                color: "#0f1117",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add to Timeline
            </button>
          </div>
        </div>
      </dialog>
    </button>
  );
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="panel-search-wrap mb-2">
      <Search className="panel-search-icon" style={{ width: 12, height: 12 }} />
      <input className="panel-search" placeholder={placeholder} />
    </div>
  );
}

interface Props {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
}

export default function LeftPanel({ activeTab, onTabChange }: Props) {
  const createJob = useCreateAIJob();
  const [audioSub, setAudioSub] = useState("Music");
  const [captionLang, setCaptionLang] = useState<"en" | "te" | "hi">("en");
  const [showGallery, setShowGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function runAI(job: JobType) {
    try {
      await createJob.mutateAsync(job);
      toast.success("AI job queued");
    } catch {
      toast.error("Failed to queue job");
    }
  }

  return (
    <>
      {showGallery && <GalleryModal onClose={() => setShowGallery(false)} />}
      <div className="left-panel" data-ocid="editor.left_panel">
        <div className="left-tab-icons">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                type="button"
                key={t.id}
                className={`left-tab-icon-btn ${activeTab === t.id ? "active" : ""}`}
                onClick={() => onTabChange(t.id)}
                title={t.label}
                data-ocid={`left_panel.${t.id}.tab`}
              >
                <Icon style={{ width: 15, height: 15 }} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <ScrollArea className="flex-1">
          <div className="left-panel-content">
            {/* MEDIA */}
            <div
              className={`tab-section ${activeTab === "media" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search media…" />
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*,audio/*,.mp4,.mov,.avi,.png,.jpg,.jpeg,.gif,.mp3,.wav"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    toast.success(
                      `${files.length} file${files.length > 1 ? "s" : ""} added`,
                    );
                  }
                  e.target.value = "";
                }}
              />
              {/* Upload box */}
              <button
                type="button"
                className="upload-box mb-2"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="editor.media.upload_button"
              >
                <Upload
                  className="mx-auto mb-2 text-muted-foreground"
                  style={{ width: 20, height: 20 }}
                />
                <p className="text-xs text-muted-foreground">
                  Upload from device
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  MP4, MOV, AVI, PNG, JPG
                </p>
              </button>
              {/* Gallery button */}
              <button
                type="button"
                className="upload-box mb-3"
                onClick={() => setShowGallery(true)}
                data-ocid="editor.media.gallery_button"
                style={{ borderColor: "#06b6d4", borderStyle: "solid" }}
              >
                <Grid2X2
                  className="mx-auto mb-2"
                  style={{ width: 20, height: 20, color: "#06b6d4" }}
                />
                <p className="text-xs" style={{ color: "#06b6d4" }}>
                  Browse Gallery
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Videos · Images · Audio
                </p>
              </button>
              <p className="section-label">Recent Files</p>
              {[
                "Interview_raw.mp4",
                "B-roll_park.mp4",
                "Logo_animation.mov",
              ].map((f) => (
                <div key={f} className="audio-item">
                  <Film
                    className="text-muted-foreground shrink-0"
                    style={{ width: 13, height: 13 }}
                  />
                  <span className="text-[11px] text-foreground/80 flex-1 truncate">
                    {f}
                  </span>
                  <button
                    type="button"
                    className="ctrl-btn text-[9px]"
                    onClick={() => toast.info(`Added ${f}`)}
                  >
                    <Plus style={{ width: 11, height: 11 }} />
                  </button>
                </div>
              ))}
            </div>

            {/* AUDIO */}
            <div
              className={`tab-section ${activeTab === "audio" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search audio…" />
              <div className="sub-tabs">
                {Object.keys(AUDIO_TRACKS).map((k) => (
                  <button
                    type="button"
                    key={k}
                    className={`sub-tab-btn ${audioSub === k ? "active" : ""}`}
                    onClick={() => setAudioSub(k)}
                    data-ocid={`left_panel.audio_${k.toLowerCase().replace(/\s/g, "_")}.tab`}
                  >
                    {k === "Meme Sounds"
                      ? "Meme"
                      : k === "Pleasant Sounds"
                        ? "Ambient"
                        : k}
                  </button>
                ))}
              </div>
              {(AUDIO_TRACKS[audioSub] || []).map((t) => (
                <div key={t.name} className="audio-item">
                  <button
                    type="button"
                    className="ctrl-btn p-0"
                    onClick={() => toast.info(`Playing ${t.name}`)}
                    style={{ width: 22, height: 22, flexShrink: 0 }}
                  >
                    <Play style={{ width: 10, height: 10 }} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground/85 truncate">
                      {t.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {t.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ctrl-btn p-0"
                    onClick={() => toast.info(`Added ${t.name}`)}
                    style={{ width: 22, height: 22, flexShrink: 0 }}
                  >
                    <Plus style={{ width: 10, height: 10 }} />
                  </button>
                </div>
              ))}
            </div>

            {/* EFFECTS */}
            <div
              className={`tab-section ${activeTab === "effects" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search effects…" />
              <div className="grid-2">
                {EFFECTS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    className="grid-card"
                    onClick={() => toast.info(`Applied ${e}`)}
                  >
                    <Sparkles
                      className="text-primary"
                      style={{ width: 14, height: 14 }}
                    />
                    <span>{e}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FILTERS */}
            <div
              className={`tab-section ${activeTab === "filters" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search filters…" />
              <div className="grid-2">
                {FILTERS.map((f) => (
                  <button
                    type="button"
                    key={f}
                    className="grid-card"
                    onClick={() => toast.info(`Applied ${f}`)}
                  >
                    <SlidersHorizontal
                      className="text-primary"
                      style={{ width: 13, height: 13 }}
                    />
                    <span>{f}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STICKERS */}
            <div
              className={`tab-section ${activeTab === "stickers" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search stickers…" />
              <div className="grid grid-cols-4 gap-1.5">
                {STICKERS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className="grid-card text-xl py-2"
                    onClick={() => toast.info(`Added sticker ${s}`)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* TEXT */}
            <div
              className={`tab-section ${activeTab === "text" ? "visible" : ""}`}
            >
              <p className="section-label">Add Text</p>
              <button
                type="button"
                className="tool-btn red mb-3"
                onClick={() => toast.info("Add title")}
                data-ocid="editor.text.add_button"
              >
                <Type style={{ width: 13, height: 13 }} /> Add Title
              </button>
              <p className="section-label">Style Presets</p>
              {[
                "Main Title",
                "Subtitle",
                "Lower Third",
                "Caption",
                "Callout",
                "Neon Glow",
              ].map((t) => (
                <button
                  type="button"
                  key={t}
                  className="tool-btn"
                  onClick={() => toast.info(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TRANSITIONS */}
            <div
              className={`tab-section ${activeTab === "transitions" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search transitions…" />
              <div className="grid-2">
                {TRANSITIONS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className="grid-card"
                    onClick={() => toast.info(`Applied ${t}`)}
                  >
                    <Shuffle
                      className="text-primary"
                      style={{ width: 13, height: 13 }}
                    />
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CAPTIONS */}
            <div
              className={`tab-section ${activeTab === "captions" ? "visible" : ""}`}
            >
              <p className="section-label">Language</p>
              <div className="flex gap-2 mb-3">
                {(["en", "te", "hi"] as const).map((l) => (
                  <button
                    type="button"
                    key={l}
                    className={`lang-btn ${captionLang === l ? "active" : ""}`}
                    onClick={() => setCaptionLang(l)}
                    data-ocid={`left_panel.caption_${l}.button`}
                  >
                    {l === "en" ? "English" : l === "te" ? "Telugu" : "Hindi"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="tool-btn red mb-2"
                onClick={() => runAI(JobType.captions)}
                data-ocid="editor.captions.auto.button"
              >
                <Subtitles style={{ width: 13, height: 13 }} /> Auto Generate
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={() => toast.info("Add caption")}
                data-ocid="editor.captions.add.button"
              >
                <Plus style={{ width: 13, height: 13 }} /> Add Caption
              </button>
            </div>

            {/* AI TOOLS */}
            <div
              className={`tab-section ${activeTab === "ai" ? "visible" : ""}`}
            >
              <p className="section-label">AI Powered Tools</p>
              {AI_TOOLS.map((tool) => (
                <button
                  type="button"
                  key={tool.label}
                  className="tool-btn mb-1"
                  onClick={() => runAI(tool.job)}
                  data-ocid={`editor.ai_${tool.label.toLowerCase().replace(/\s/g, "_")}.button`}
                >
                  <span className="text-base leading-none">{tool.icon}</span>
                  <span className="flex-1 text-left">{tool.label}</span>
                  <Wand2
                    className="text-primary/60"
                    style={{ width: 11, height: 11 }}
                  />
                </button>
              ))}
            </div>

            {/* TEMPLATES */}
            <div
              className={`tab-section ${activeTab === "templates" ? "visible" : ""}`}
            >
              <SearchBar placeholder="Search templates…" />
              {TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.name}
                  className="tool-btn"
                  onClick={() => toast.info(`Applied template: ${t.name}`)}
                >
                  <span className="text-sm">{t.icon}</span>
                  {t.name}
                </button>
              ))}
            </div>

            {/* VOICEOVER */}
            <div
              className={`tab-section ${activeTab === "voiceover" ? "visible" : ""}`}
            >
              <p className="section-label">Voice Settings</p>
              <select className="select-native">
                <option>Male — Deep</option>
                <option>Female — Warm</option>
                <option>Male — Neutral</option>
                <option>Female — Crisp</option>
              </select>
              <p className="section-label">Script</p>
              <textarea
                className="text-input"
                rows={4}
                placeholder="Type your script here…"
                data-ocid="editor.voiceover.textarea"
              />
              <button
                type="button"
                className="tool-btn red"
                onClick={() => runAI(JobType.tts)}
                data-ocid="editor.voiceover.generate.button"
              >
                <Mic style={{ width: 13, height: 13 }} /> Generate Voiceover
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
