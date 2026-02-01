import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "./Section";

const skillGroups = [
  {
    key: "languages",
    items: ["TypeScript", "JavaScript", "SQL", "HTML", "CSS"],
  },
  {
    key: "frameworks",
    items: [
      "React",
      "React Native",
      "Expo",
      "Vite",
      "NativeWind",
      "Tailwind CSS",
      "Framer Motion",
      "Jest",
    ],
  },
  {
    key: "tools",
    items: [
      "Git",
      "GitHub",
      "Supabase",
      "WatermelonDB",
      "MMKV",
      "Cloudflare",
      "EAS Build",
      "VS Code",
    ],
  },
];

export default function Skills() {
  const { t } = useTranslation();

  return (
    <Section id="skills" title={t("skills.title")}>
      <div className="grid gap-10 md:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
          >
            <h3 className="mb-4 text-sm font-semibold tracking-widest text-emerald-400 uppercase">
              {t(`skills.${group.key}`)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
