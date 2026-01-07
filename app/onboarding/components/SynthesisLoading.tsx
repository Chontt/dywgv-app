import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function SynthesisLoading() {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center space-y-10 py-10">
            <div className="relative">
                {/* Glowing Brain Core - Digital Calm Periwinkle */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-40 h-40 bg-primary/30 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <div className="w-28 h-28 bg-foreground dark:bg-surface border border-primary/20 rounded-[40px] flex items-center justify-center relative z-10 overflow-hidden shadow-bubble shadow-primary/10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-transparent opacity-30"
                    />
                    <span className="text-4xl relative z-20">🧠</span>
                </div>
            </div>

            <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-foreground tracking-tight">{t('onboarding_subtitle_loading')}</h2>
                <div className="h-6 overflow-hidden relative">
                    <motion.div
                        animate={{ y: -120 }}
                        transition={{ duration: 10, times: [0, 0.2, 0.4, 0.6, 0.8, 1], repeat: Infinity }}
                        className="flex flex-col items-center text-muted font-bold text-[10px] uppercase tracking-[0.3em] space-y-2"
                    >
                        <span>Analyzing psychological profile...</span>
                        <span>Calibrating voice authority...</span>
                        <span>Constructing content pillars...</span>
                        <span>Defining conversion logic...</span>
                        <span>Installing strategic brain...</span>
                        <span>Synchronizing Digital Calm...</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
