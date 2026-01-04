import { useI18n, Lang } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const languages: { code: Lang; label: string }[] = [
    { code: "en", label: "🇺🇸 EN" },
    { code: "th", label: "🇹🇭 TH" },
    { code: "ja", label: "🇯🇵 JA" },
    { code: "ko", label: "🇰🇷 KO" },
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLocale(e.target.value as Lang);
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-pastel-lavender/50 to-pastel-mint/50 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-500" />
      <div className="relative flex items-center gap-2">
        <label htmlFor="language-switcher" className="sr-only">
          Change language
        </label>
        <select
          id="language-switcher"
          value={locale}
          onChange={handleChange}
          className="appearance-none cursor-pointer rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-slate-700 shadow-glass transition hover:bg-white/50 hover:border-white/60 focus:outline-none focus:ring-2 focus:ring-pastel-lavender/50 pr-8"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code} className="bg-white">
              {l.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
}
