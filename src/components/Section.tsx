import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={`pt-24 pb-24 px-6${className ? ` ${className}` : ""}`}>
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-12 text-3xl font-bold text-white">
            {title}
            <span className="text-cyan-400">.</span>
          </h2>
        </ScrollReveal>
        {children}
      </div>
    </section>
  );
}
