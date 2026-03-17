import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Music2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data
const AUDIO_LIBRARY: Record<
  string,
  { id: string; name: string; duration: string; emoji: string }[]
> = {
  Music: [
    { id: "m1", name: "Epic Background", duration: "2:34", emoji: "🎵" },
    { id: "m2", name: "Happy Vibes", duration: "3:12", emoji: "🎶" },
    { id: "m3", name: "Chill Sunset", duration: "4:01", emoji: "🌅" },
    { id: "m4", name: "Dark Cinematic", duration: "3:45", emoji: "🎬" },
    { id: "m5", name: "Upbeat Energy", duration: "2:58", emoji: "⚡" },
  ],
  Songs: [
    { id: "s1", name: "Telugu Beat", duration: "3:45", emoji: "🎤" },
    { id: "s2", name: "Bollywood Mix", duration: "4:20", emoji: "🎸" },
    { id: "s3", name: "Pop Anthem", duration: "3:30", emoji: "🎙️" },
    { id: "s4", name: "Indie Folk", duration: "4:10", emoji: "🪕" },
  ],
  "Pleasant Sounds": [
    { id: "p1", name: "Rain Ambience", duration: "5:00", emoji: "🌧️" },
    { id: "p2", name: "Forest Birds", duration: "4:30", emoji: "🦜" },
    { id: "p3", name: "Ocean Waves", duration: "6:00", emoji: "🌊" },
    { id: "p4", name: "Café Atmosphere", duration: "5:30", emoji: "☕" },
  ],
  "Meme Sounds": [
    { id: "mm1", name: "Meme Boom", duration: "0:05", emoji: "💥" },
    { id: "mm2", name: "Dun Dun Dunn", duration: "0:03", emoji: "😱" },
    { id: "mm3", name: "Vine Boom", duration: "0:02", emoji: "🔊" },
    { id: "mm4", name: "Bruh Sound", duration: "0:02", emoji: "😤" },
    { id: "mm5", name: "Sad Trombone", duration: "0:04", emoji: "😢" },
  ],
};

const STICKERS = [
  "🔥",
  "💯",
  "⭐",
  "❤️",
  "🎉",
  "✨",
  "💪",
  "👑",
  "🎯",
  "🚀",
  "💎",
  "🌟",
  "🎵",
  "🤩",
  "😎",
  "🙌",
  "💫",
  "🎊",
  "🌈",
  "⚡",
  "🦋",
  "🌸",
  "🎀",
  "🍀",
];

const FILTERS = [
  { id: "f1", name: "Vintage", gradient: "from-amber-800/60 to-orange-900/60" },
  { id: "f2", name: "Cinema", gradient: "from-gray-900/70 to-blue-900/40" },
  { id: "f3", name: "Bright", gradient: "from-yellow-200/30 to-white/20" },
  { id: "f4", name: "Dark", gradient: "from-black/80 to-gray-950/60" },
  { id: "f5", name: "Warm", gradient: "from-orange-400/40 to-red-500/30" },
  { id: "f6", name: "Cool", gradient: "from-blue-400/40 to-cyan-500/30" },
  { id: "f7", name: "Neon", gradient: "from-purple-500/50 to-pink-500/40" },
  { id: "f8", name: "B&W", gradient: "from-gray-400/50 to-gray-600/40" },
];

const EFFECTS = [
  { id: "e1", name: "Blur", icon: "🌫️", desc: "Smooth background blur" },
  { id: "e2", name: "Glow", icon: "✨", desc: "Soft light emission" },
  { id: "e3", name: "Shake", icon: "📳", desc: "Camera shake vibration" },
  { id: "e4", name: "Zoom", icon: "🔍", desc: "Dramatic zoom in/out" },
  { id: "e5", name: "Fade", icon: "🌅", desc: "Smooth fade transition" },
  { id: "e6", name: "Glitch", icon: "⚡", desc: "Digital glitch distortion" },
  { id: "e7", name: "Mirror", icon: "🪞", desc: "Horizontal flip mirror" },
  { id: "e8", name: "Speed", icon: "💨", desc: "Speed ramp effect" },
];

const TEMPLATES = [
  {
    id: "t1",
    name: "Reels Vibe",
    duration: "0:30",
    color: "from-violet-600 to-purple-800",
    tracks: 4,
  },
  {
    id: "t2",
    name: "Wedding Story",
    duration: "2:00",
    color: "from-rose-500 to-pink-700",
    tracks: 6,
  },
  {
    id: "t3",
    name: "Travel Blog",
    duration: "1:00",
    color: "from-cyan-500 to-blue-700",
    tracks: 5,
  },
  {
    id: "t4",
    name: "Meme Clip",
    duration: "0:15",
    color: "from-amber-500 to-orange-700",
    tracks: 3,
  },
  {
    id: "t5",
    name: "Business Intro",
    duration: "0:30",
    color: "from-gray-500 to-zinc-700",
    tracks: 4,
  },
];

const AUDIO_CATS = Object.keys(AUDIO_LIBRARY);

export default function LeftPanel() {
  const [audioCategory, setAudioCategory] = useState("Music");
  const [searchAudio, setSearchAudio] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredAudio = AUDIO_LIBRARY[audioCategory].filter((a) =>
    a.name.toLowerCase().includes(searchAudio.toLowerCase()),
  );

  return (
    <div className="h-full bg-card flex flex-col">
      <Tabs defaultValue="audio" className="flex flex-col h-full">
        <TabsList className="flex w-full rounded-none h-10 bg-muted/30 border-b border-border p-0 gap-0">
          {[
            { value: "audio", label: "Audio" },
            { value: "stickers", label: "Stickers" },
            { value: "filters", label: "Filters" },
            { value: "effects", label: "Effects" },
            { value: "templates", label: "Templates" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 rounded-none text-[11px] h-full border-r border-border last:border-0 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:border-b-primary"
              data-ocid={`left_panel.${tab.value}.tab`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Audio tab */}
        <TabsContent value="audio" className="flex-1 overflow-hidden m-0">
          <div className="flex flex-col h-full">
            {/* Category selector */}
            <div className="px-2 pt-2 pb-1 flex gap-1 flex-wrap">
              {AUDIO_CATS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setAudioCategory(cat)}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
                    audioCategory === cat
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30",
                  )}
                  data-ocid={`audio.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="px-2 pb-1 relative">
              <Search className="w-3 h-3 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search audio..."
                value={searchAudio}
                onChange={(e) => setSearchAudio(e.target.value)}
                className="h-7 text-xs pl-7 bg-muted border-border"
                data-ocid="audio.search_input"
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="px-2 pb-2 flex flex-col gap-1">
                {filteredAudio.map((audio, idx) => (
                  <div
                    key={audio.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    data-ocid={`audio.item.${idx + 1}`}
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
                      {audio.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {audio.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Music2 className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {audio.duration}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/20"
                      onClick={() =>
                        toast.success(`Added "${audio.name}" to timeline`)
                      }
                      data-ocid={`audio.item.${idx + 1}.button`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Stickers tab */}
        <TabsContent value="stickers" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              <p className="text-[10px] text-muted-foreground mb-2 px-1">
                Tap to add to canvas
              </p>
              <div className="grid grid-cols-6 gap-1">
                {STICKERS.map((sticker, idx) => (
                  <button
                    type="button"
                    key={sticker}
                    className="aspect-square rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
                    onClick={() => toast.success(`Added ${sticker} sticker`)}
                    data-ocid={`sticker.item.${idx + 1}`}
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Filters tab */}
        <TabsContent value="filters" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              <p className="text-[10px] text-muted-foreground mb-2 px-1">
                Select a filter to apply
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.map((filter, idx) => (
                  <button
                    type="button"
                    key={filter.id}
                    className={cn(
                      "rounded-lg overflow-hidden border-2 transition-all",
                      selectedFilter === filter.id
                        ? "border-primary"
                        : "border-transparent hover:border-primary/40",
                    )}
                    onClick={() => {
                      setSelectedFilter(
                        filter.id === selectedFilter ? null : filter.id,
                      );
                      toast.success(`Filter "${filter.name}" applied`);
                    }}
                    data-ocid={`filter.item.${idx + 1}`}
                  >
                    <div
                      className={cn(
                        "h-14 bg-gradient-to-br",
                        filter.gradient,
                        "relative",
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 flex items-end justify-center pb-1">
                        <span className="text-[10px] text-white font-medium">
                          {filter.name}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Effects tab */}
        <TabsContent value="effects" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-2 flex flex-col gap-1">
              {EFFECTS.map((effect, idx) => (
                <button
                  type="button"
                  key={effect.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  onClick={() => toast.success(`Effect "${effect.name}" added`)}
                  data-ocid={`effect.item.${idx + 1}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-lg flex-shrink-0">
                    {effect.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium group-hover:text-primary transition-colors">
                      {effect.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {effect.desc}
                    </p>
                  </div>
                  <Plus className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Templates tab */}
        <TabsContent value="templates" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-2 flex flex-col gap-2">
              {TEMPLATES.map((tpl, idx) => (
                <div
                  key={tpl.id}
                  className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  data-ocid={`template.item.${idx + 1}`}
                >
                  <div
                    className={cn(
                      "h-16 bg-gradient-to-br flex items-center justify-center relative",
                      tpl.color,
                    )}
                  >
                    <span className="text-white font-display font-bold text-sm">
                      {tpl.name}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
                        onClick={() =>
                          toast.success(`Template "${tpl.name}" applied!`)
                        }
                        data-ocid={`template.item.${idx + 1}.button`}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {tpl.duration}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] h-4 px-1.5"
                    >
                      {tpl.tracks} tracks
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
