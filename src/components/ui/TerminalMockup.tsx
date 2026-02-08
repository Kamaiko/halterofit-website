import { cn } from "../../utils/cn";

interface TerminalMockupProps {
  imageUrl: string;
  alt: string;
  /** Label shown in the title bar (e.g. "BlunderMate — Prolog") */
  title?: string;
  className?: string;
}

export default function TerminalMockup({
  imageUrl,
  alt,
  title = "terminal",
  className,
}: TerminalMockupProps) {
  return (
    <div className={cn("overflow-hidden bg-slate-900/80", className)}>
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/30" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/30" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/30" />
        <span className="ml-2 font-mono text-xs text-slate-500">{title}</span>
      </div>
      {/* Screenshot */}
      <div className="bg-black/40">
        <img
          src={imageUrl}
          alt={alt}
          className="h-48 w-full object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}
