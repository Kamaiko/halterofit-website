import { useTranslation } from "react-i18next";
import { CONTAINER_WIDTH } from "../../constants/styles";
import { cn } from "../../utils/cn";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 px-6 py-8">
      <div className={cn(CONTAINER_WIDTH, "text-center text-sm text-slate-400")}>
        <p>&copy; {year} {t("footer.name")}. {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
