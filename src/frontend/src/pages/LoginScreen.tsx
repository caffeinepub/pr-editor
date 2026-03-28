import { Button } from "@/components/ui/button";
import { Film, Loader2, Mic2, Play, Sparkles, Wand2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  { icon: Film, label: "AI Video Generation" },
  { icon: Mic2, label: "Text to Speech" },
  { icon: Wand2, label: "AI Auto Cut" },
  { icon: Sparkles, label: "Smart Captions" },
];

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden"
      data-ocid="login.page"
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "hsl(197 100% 45% / 0.04)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "20%",
          left: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "hsl(240 60% 50% / 0.04)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full px-6">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "hsl(197 100% 45% / 0.12)",
              border: "1px solid hsl(197 100% 45% / 0.3)",
              boxShadow: "0 0 32px hsl(197 100% 45% / 0.15)",
            }}
          >
            <Play
              className="text-primary"
              style={{ width: 32, height: 32, fill: "hsl(197 100% 45%)" }}
            />
          </div>
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-widest text-primary uppercase">
              PR EDITOR
            </h1>
            <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
              Professional Video Editor
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Create. Edit. Share.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AI-powered editing with auto captions, smart cuts, voice synthesis,
            and stunning effects.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 w-full">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 border border-border"
              style={{ background: "hsl(240 6% 8%)" }}
            >
              <Icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-foreground/80">{label}</span>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/85 text-primary-foreground font-semibold text-sm h-11 rounded-lg shadow-glow"
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="login.submit.button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting…
            </>
          ) : (
            "Sign In to Continue"
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground/50 text-center">
          Secured by Internet Identity
        </p>
      </div>

      <p className="absolute bottom-4 text-[10px] text-muted-foreground/40">
        &copy; {new Date().getFullYear()}. Built with &#9829; using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="hover:text-muted-foreground/60 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
