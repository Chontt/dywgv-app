import { motion } from "framer-motion";

export default function SynthesisLoading() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10">
            <div className="relative">
                {/* Glowing Brain Core */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 bg-indigo-500 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <div className="w-24 h-24 bg-slate-900 border border-indigo-500/50 rounded-full flex items-center justify-center relative z-10 overflow-hidden">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-transparent opacity-20"
                    />
                    <span className="text-4xl">🧠</span>
                </div>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Synthesizing Your Brain...</h2>
                <div className="h-6 overflow-hidden relative">
                    <motion.div
                        animate={{ y: -60 }}
                        transition={{ duration: 6, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                        className="flex flex-col items-center text-slate-400 text-sm space-y-1"
                    >
                        <span>Analyzing psychological profile...</span>
                        <span>Calibrating voice authority...</span>
                        <span>Constructing content pillars...</span>
                        <span>Defining conversion logic...</span>
                        <span>Installing strategic brain...</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
