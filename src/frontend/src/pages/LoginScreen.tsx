import { Button } from "@/components/ui/button";
import { Film, Loader2, Mic2, Play, Sparkles, Wand2 } from "lucide-react";
import { motion } from "motion/react";
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              PR <span className="text-primary">EDITOR</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Professional Video Editor
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Create. Edit. Share.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AI-powered video editing with auto captions, smart cuts, voice
            synthesis, and stunning effects.
          </p>
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2"
            >
              <Icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Login button */}
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base h-12 rounded-xl shadow-glow"
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="login.primary_button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Get Started — Sign In"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Internet Computer · Secure & Decentralized
        </p>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
