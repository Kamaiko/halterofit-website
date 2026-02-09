import { useRef } from "react";
import type { ReactNode } from "react";
import { useInView } from "framer-motion";
import DemoSection from "../DemoSection";
import { cn } from "../../../utils/cn";
import { CARD_BASE, CARD_SHADOW_LIGHT } from "../../../constants/styles";

const cardClass = cn(CARD_BASE, CARD_SHADOW_LIGHT, "p-6");

const SUBTITLE_PREFIX = "Je construis des produits pensés pour les ";
const ACCENT_WORD = "utilisateurs";

interface Variant {
  label: string;
  name: string;
  description: string;
  renderAccent: () => ReactNode;
}

const VARIANTS: Variant[] = [
  {
    label: "A",
    name: "Color lift + weight",
    description: "text-slate-200 font-medium — contrast naturel, zéro couleur",
    renderAccent: () => (
      <span className="font-medium text-slate-200">{ACCENT_WORD}</span>
    ),
  },
  {
    label: "B",
    name: "Subtle underline",
    description: "Fine ligne cyan transparente sous le mot",
    renderAccent: () => (
      <span className="text-slate-300 underline decoration-cyan-400/30 underline-offset-4 decoration-1">
        {ACCENT_WORD}
      </span>
    ),
  },
  {
    label: "C",
    name: "Gradient text",
    description: "Dégradé slate→cyan, comme un reflet du glow",
    renderAccent: () => (
      <span className="bg-linear-to-r from-slate-300 to-cyan-300 bg-clip-text text-transparent">
        {ACCENT_WORD}
      </span>
    ),
  },
  {
    label: "D",
    name: "Tracking + weight",
    description: "tracking-wider font-medium — purement typographique",
    renderAccent: () => (
      <span className="font-medium tracking-wider text-slate-300">
        {ACCENT_WORD}
      </span>
    ),
  },
];

function TaglinePreview({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className={cardClass}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-bold text-cyan-400">
          {variant.label}
        </span>
        <div>
          <span className="text-xs font-medium text-slate-300">{variant.name}</span>
          <span className="ml-2 text-xs text-slate-500">{variant.description}</span>
        </div>
      </div>
      <div
        ref={ref}
        className={cn("tagline-glow", isInView && "glow-active")}
      >
        <p className="text-xl leading-relaxed text-slate-300 md:text-2xl">
          Diplômé en{" "}
          <span className="glow-pulse text-[1.15em] text-cyan-400">psycho</span>, reconverti
          en <span className="glow-pulse text-[1.15em] text-cyan-400">dev</span>.
          <span className="mt-1 block text-[0.9em] text-slate-500">
            {SUBTITLE_PREFIX}
            <span className="text-[1.15em]">{variant.renderAccent()}</span>.
          </span>
        </p>
      </div>
    </div>
  );
}

export default function TaglineStylingDemo() {
  return (
    <DemoSection
      number={5}
      title="Accent 'utilisateurs'"
      description="4 traitements pour mettre l'emphase sur 'utilisateurs' dans la sous-ligne, sans répéter le glow cyan de psycho/dev."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {VARIANTS.map((variant) => (
          <TaglinePreview key={variant.label} variant={variant} />
        ))}
      </div>
    </DemoSection>
  );
}
