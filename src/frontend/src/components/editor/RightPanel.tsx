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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type RightTab = "properties" | "color" | "speed" | "export";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>;
}

function SliderRow({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="prop-label">{label}</span>
        <span className="prop-value">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<RightTab>("properties");
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [shadows, setShadows] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [reversed, setReversed] = useState(false);
  const [format, setFormat] = useState("mp4");
  const [resolution, setResolution] = useState("1080p");
  const [quality, setQuality] = useState(80);
  const [fps, setFps] = useState("30");

  const TABS: { id: RightTab; label: string }[] = [
    { id: "properties", label: "Props" },
    { id: "color", label: "Color" },
    { id: "speed", label: "Speed" },
    { id: "export", label: "Export" },
  ];

  return (
    <div className="right-panel" data-ocid="editor.right_panel">
      <div className="right-panel-tabs">
        {TABS.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`right-tab-btn ${activeTab === t.id ? "active" : ""}`}
            data-ocid={`right_panel.${t.id}.tab`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="right-panel-content">
          {activeTab === "properties" && (
            <div>
              <SectionHeader>Position</SectionHeader>
              <SliderRow
                label="X"
                value={posX}
                onChange={setPosX}
                min={-500}
                max={500}
              />
              <SliderRow
                label="Y"
                value={posY}
                onChange={setPosY}
                min={-500}
                max={500}
              />
              <SectionHeader>Transform</SectionHeader>
              <SliderRow
                label="Scale"
                value={scale}
                onChange={setScale}
                min={10}
                max={300}
                unit="%"
              />
              <SliderRow
                label="Rotation"
                value={rotation}
                onChange={setRotation}
                min={-180}
                max={180}
                unit="\u00B0"
              />
              <SectionHeader>Appearance</SectionHeader>
              <SliderRow
                label="Opacity"
                value={opacity}
                onChange={setOpacity}
                unit="%"
              />
            </div>
          )}

          {activeTab === "color" && (
            <div>
              <SectionHeader>Exposure</SectionHeader>
              <SliderRow
                label="Brightness"
                value={brightness}
                onChange={setBrightness}
                min={0}
                max={200}
                unit="%"
              />
              <SliderRow
                label="Contrast"
                value={contrast}
                onChange={setContrast}
                min={0}
                max={200}
                unit="%"
              />
              <SectionHeader>Color</SectionHeader>
              <SliderRow
                label="Saturation"
                value={saturation}
                onChange={setSaturation}
                min={0}
                max={200}
                unit="%"
              />
              <SliderRow
                label="Hue"
                value={hue}
                onChange={setHue}
                min={-180}
                max={180}
                unit="\u00B0"
              />
              <SliderRow
                label="Temp"
                value={temperature}
                onChange={setTemperature}
                min={-100}
                max={100}
              />
              <SectionHeader>Tone</SectionHeader>
              <SliderRow
                label="Highlights"
                value={highlights}
                onChange={setHighlights}
                min={-100}
                max={100}
              />
              <SliderRow
                label="Shadows"
                value={shadows}
                onChange={setShadows}
                min={-100}
                max={100}
              />
            </div>
          )}

          {activeTab === "speed" && (
            <div>
              <SectionHeader>Playback Speed</SectionHeader>
              <SliderRow
                label="Speed"
                value={Math.round(speed * 100)}
                onChange={(v) => setSpeed(v / 100)}
                min={25}
                max={400}
                unit="%"
              />
              <p className="text-[10px] text-muted-foreground mb-3">
                Current: {speed.toFixed(2)}x
              </p>
              <SectionHeader>Presets</SectionHeader>
              <div className="grid grid-cols-5 gap-1 mb-3">
                {[0.25, 0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`tb-btn text-center px-1 ${speed === s ? "active" : ""}`}
                    onClick={() => setSpeed(s)}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <SectionHeader>Options</SectionHeader>
              <div className="flex items-center justify-between py-2">
                <span className="prop-label">Reverse</span>
                <Switch
                  checked={reversed}
                  onCheckedChange={setReversed}
                  data-ocid="right_panel.reverse.switch"
                />
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div>
              <SectionHeader>Format</SectionHeader>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger
                  className="h-8 text-xs mb-2"
                  data-ocid="right_panel.format.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 — H.264</SelectItem>
                  <SelectItem value="mov">MOV — ProRes</SelectItem>
                  <SelectItem value="webm">WebM — VP9</SelectItem>
                  <SelectItem value="gif">GIF (Animated)</SelectItem>
                </SelectContent>
              </Select>
              <SectionHeader>Video Settings</SectionHeader>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger
                  className="h-8 text-xs mb-2"
                  data-ocid="right_panel.resolution.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4k">4K — 3840×2160</SelectItem>
                  <SelectItem value="1080p">1080p — 1920×1080</SelectItem>
                  <SelectItem value="720p">720p — 1280×720</SelectItem>
                  <SelectItem value="480p">480p — 854×480</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fps} onValueChange={setFps}>
                <SelectTrigger
                  className="h-8 text-xs mb-2"
                  data-ocid="right_panel.fps.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 fps — Film</SelectItem>
                  <SelectItem value="30">30 fps — Standard</SelectItem>
                  <SelectItem value="60">60 fps — Smooth</SelectItem>
                  <SelectItem value="120">120 fps — High Speed</SelectItem>
                </SelectContent>
              </Select>
              <SliderRow
                label="Quality"
                value={quality}
                onChange={setQuality}
                unit="%"
              />
              <Button
                size="sm"
                className="w-full h-8 text-xs font-semibold mt-2 bg-primary hover:bg-primary/85 text-primary-foreground gap-1.5 shadow-glow-sm"
                onClick={() => toast.success("Export started!")}
                data-ocid="right_panel.export.button"
              >
                <Download className="w-3.5 h-3.5" /> Export Video
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
