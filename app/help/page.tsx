"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    ArrowLeft,
    HelpCircle,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    Smile,
    Meh,
    Frown,
    Loader2
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import SideNav from "../dashboard/components/SideNav";
import { getSubscriptionStatus } from "@/lib/subscription";

/**
 * STRINGS & LOCALIZATION
 * Simplified dictionary for en, th, ja, ko.
 */
const DICTIONARY = {
    en: {
        back: "Back to Dashboard",
        help_tab: "Help",
        feedback_tab: "Feedback",
        // Help Section
        help_title: "How can we help?",
        actions_title: "What should I do now?",
        action_1: "Review today's focus to stay on track",
        action_2: "Generate new content in the Studio",
        action_3: "Refine your Brand Profile for better AI",
        goto_dashboard: "Go to Dashboard",
        goto_studio: "Go to Studio",
        goto_profiles: "Go to Profiles",
        steps_title: "How the app works",
        step_1: "1. Focus: Set your daily strategic goal.",
        step_2: "2. Studio: Generate content with your voice.",
        step_3: "3. Edit: Refine and polish the output.",
        step_4: "4. Scale: Consistency compounds into authority.",
        confusion_title: "Common Confusion",
        q1: "Where are my drafts?",
        a1: "All generated content is saved in your Library. You can access it via the Studio or Dashboard.",
        q2: "How do I change my voice?",
        a2: "Navigate to Profiles. Adjust your tone and authority level to guide the AI's personality.",
        q3: "Can I use multiple languages?",
        a3: "Yes. You can set a primary language in Profiles, but the Studio supports multi-lingual generation.",
        // Feedback Section
        feedback_title: "Help us improve",
        sentiment_prompt: "How is your experience today?",
        sentiment_pos: "This helped",
        sentiment_neu: "It's okay, but...",
        sentiment_neg: "I'm confused / frustrated",
        killer_question: "What almost stopped you from using this today?",
        details_label: "Any extra details? (Optional)",
        placeholder_killer: "Be honest. We value direct feedback.",
        placeholder_details: "Tell us more...",
        char_range: "Recommended: 20–300 characters",
        submit: "Send Feedback",
        submitting: "Sending...",
        success_msg: "Thanks — we read every message.",
        error_header: "Save failed",
    },
    th: {
        back: "กลับไปยังแดชบอร์ด",
        help_tab: "ความช่วยเหลือ",
        feedback_tab: "ข้อเสนอแนะ",
        help_title: "มีอะไรให้เราช่วยไหม?",
        actions_title: "ฉันควรทำอย่างไรตอนนี้?",
        action_1: "ตรวจสอบเป้าหมายวันนี้เพื่อให้ไม่หลุดโฟกัส",
        action_2: "สร้างคอนเทนต์ใหม่ใน Studio",
        action_3: "ปรับแต่งโปรไฟล์แบรนด์เพื่อให้ AI ทำงานได้ดีขึ้น",
        goto_dashboard: "ไปยังแดชบอร์ด",
        goto_studio: "ไปยัง Studio",
        goto_profiles: "ไปยังโปรไฟล์",
        steps_title: "แอปทำงานอย่างไร",
        step_1: "1. Focus: ตั้งเป้าหมายกลยุทธ์รายวัน",
        step_2: "2. Studio: สร้างคอนเทนต์ด้วยเสียงของคุณ",
        step_3: "3. Edit: ตรวจสอบและขัดเกลาผลลัพธ์",
        step_4: "4. Scale: ความสม่ำเสมอสร้างอำนาจในสายงาน",
        confusion_title: "คำถามที่พบบ่อย",
        q1: "แบบร่างของฉันอยู่ที่ไหน?",
        a1: "คอนเทนต์ที่สร้างทั้งหมดจะถูกเก็บไว้ใน Library เข้าถึงได้ผ่าน Studio หรือแดชบอร์ด",
        q2: "ฉันจะเปลี่ยนน้ำเสียง (Voice) ได้อย่างไร?",
        a2: "ไปที่หน้าโปรไฟล์ ปรับโทนและระดับ Authority เพื่อกำหนดบุคลิกของ AI",
        q3: "ใช้หลายภาษาได้ไหม?",
        a3: "ได้ คุณสามารถตั้งค่าภาษาหลักได้ในโปรไฟล์ แต่ Studio รองรับการสร้างหลายภาษา",
        feedback_title: "ช่วยเราพัฒนาให้ดีขึ้น",
        sentiment_prompt: "ประสบการณ์ของคุณวันนี้เป็นอย่างไร?",
        sentiment_pos: "มีประโยชน์มาก",
        sentiment_neu: "ก็ดีนะ แต่ว่า...",
        sentiment_neg: "ฉันสับสน / หงุดหงิด",
        killer_question: "อะไรที่เกือบทำให้คุณเลิกใช้แอปในวันนี้?",
        details_label: "รายละเอียดเพิ่มเติม (ไม่บังคับ)",
        placeholder_killer: "ติชมได้ตรงๆ เราให้ความสำคัญกับความจริงใจ",
        placeholder_details: "บอกเราเพิ่มเติม...",
        char_range: "แนะนำ: 20–300 ตัวอักษร",
        submit: "ส่งข้อเสนอแนะ",
        submitting: "กำลังส่ง...",
        success_msg: "ขอบคุณ — เราอ่านทุกข้อความ",
        error_header: "บันทึกล้มเหลว",
    },
    ja: {
        back: "ダッシュボードに戻る",
        help_tab: "ヘルプ",
        feedback_tab: "フィードバック",
        help_title: "どのようなサポートが必要ですか？",
        actions_title: "次は何をすべきですか？",
        action_1: "今日のフォーカスを確認して、軌道を維持しましょう",
        action_2: "Studioで新しいコンテンツを生成する",
        action_3: "AIの精度を高めるためにブランドプロフィールを調整する",
        goto_dashboard: "ダッシュボードへ",
        goto_studio: "Studioへ",
        goto_profiles: "プロフィールへ",
        steps_title: "アプリの仕組み",
        step_1: "1. フォーカス: 毎日の戦略目標を設定します。",
        step_2: "2. Studio: あなたの「声」でコンテンツを生成します。",
        step_3: "3. 編集: 出力を洗練させ、磨きをかけます。",
        step_4: "4. 拡大: 継続が権威へとつながります。",
        confusion_title: "よくあるご質問",
        q1: "下書きはどこにありますか？",
        a1: "生成されたすべてのコンテンツはライブラリに保存されます。Studioまたはダッシュボードからアクセスできます。",
        q2: "「声」を変更するにはどうすればよいですか？",
        a2: "プロフィールに移動します。トーンや権威レベルを調整して、AIの性格をガイドします。",
        q3: "複数の言語を使用できますか？",
        a3: "はい。プロフィールで主要言語を設定できますが、Studioは多言語生成をサポートしています。",
        feedback_title: "改善にご協力ください",
        sentiment_prompt: "今日の体験はいかがでしたか？",
        sentiment_pos: "役に立った",
        sentiment_neu: "まあまあだが...",
        sentiment_neg: "困っている / 不満がある",
        killer_question: "今日、使用を止めそうになった原因は何ですか？",
        details_label: "追加の詳細（任意）",
        placeholder_killer: "正直な意見をお聞かせください。",
        placeholder_details: "詳しく教えてください...",
        char_range: "推奨: 20–300 文字",
        submit: "フィードバックを送信",
        submitting: "送信中...",
        success_msg: "ありがとうございます。すべてのメッセージを拝読します。",
        error_header: "保存に失敗しました",
    },
    ko: {
        back: "대시보드로 돌아가기",
        help_tab: "도움말",
        feedback_tab: "피드백",
        help_title: "무엇을 도와드릴까요?",
        actions_title: "지금 무엇을 해야 할까요?",
        action_1: "오늘의 포커스를 확인하여 목표를 유지하세요",
        action_2: "Studio에서 새로운 콘텐츠 생성하기",
        action_3: "더 나은 AI 결과를 위해 브랜드 프로필 수정하기",
        goto_dashboard: "대시보드로 이동",
        goto_studio: "Studio로 이동",
        goto_profiles: "프로필로 이동",
        steps_title: "앱 작동 방식",
        step_1: "1. 포커스: 일일 전략 목표를 설정합니다.",
        step_2: "2. Studio: 나만의 목소리로 콘텐츠를 생성합니다.",
        step_3: "3. 편집: 결과를 정교하게 다듬습니다.",
        step_4: "4. 확장: 꾸준함이 권위로 이어집니다.",
        confusion_title: "자주 묻는 질문",
        q1: "내 초안은 어디에 있나요?",
        a1: "생성된 모든 콘텐츠는 라이브러리에 저장됩니다. Studio 또는 대시보드에서 찾을 수 있습니다.",
        q2: "목소리(Voice)를 어떻게 바꾸나요?",
        a2: "프로필로 이동하세요. 톤과 권위 수준을 조정하여 AI의 성격을 가이드할 수 있습니다.",
        q3: "여러 언어를 사용할 수 있나요?",
        a3: "네. 프로필에서 기본 언어를 설정할 수 있으며, Studio는 다국어 생성을 지원합니다.",
        feedback_title: "개선에 도움을 주세요",
        sentiment_prompt: "오늘의 경험은 어떠셨나요?",
        sentiment_pos: "도움이 되었음",
        sentiment_neu: "보통이지만...",
        sentiment_neg: "혼란스러움 / 불만족",
        killer_question: "오늘 이 앱을 사용하지 못하게 할 뻔한 이유는 무엇인가요?",
        details_label: "추가 상세 내용 (선택 사항)",
        placeholder_killer: "솔직한 의견을 부탁드립니다.",
        placeholder_details: "더 자세히 알려주세요...",
        char_range: "권장: 20–300자",
        submit: "피드백 전송",
        submitting: "전송 중...",
        success_msg: "감사합니다. 모든 메시지를 확인하고 있습니다.",
        error_header: "저장 실패",
    }
};

type Language = keyof typeof DICTIONARY;

export default function HelpPage() {
    const router = useRouter();
    const { locale } = useI18n();

    // State
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"help" | "feedback">("help");
    const [lang, setLang] = useState<Language>("en");
    const [isPro, setIsPro] = useState(false);

    // Feedback State
    const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);
    const [blocker, setBlocker] = useState("");
    const [details, setDetails] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = DICTIONARY[lang];

    useEffect(() => {
        async function loadData() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            setUser(session.user);

            const { data: profileData } = await supabase
                .from("brand_profiles")
                .select("*")
                .eq("user_id", session.user.id)
                .single();

            if (profileData) {
                const profile = profileData as any;
                setProfile(profile);

                // Check Subscription
                const { isPro: proStatus } = await getSubscriptionStatus(session.user.id);
                setIsPro(proStatus);

                // Priority: 1. Profile main_language, 2. Profile language, 3. Global i18n locale
                const profileLang = (profile.main_language || profile.language || locale || "en").toLowerCase();

                if (DICTIONARY[profileLang as Language]) {
                    setLang(profileLang as Language);
                }
            } else if (locale && DICTIONARY[locale as Language]) {
                setLang(locale as Language);
            }

            setLoading(false);
        }

        loadData();
    }, [router]);

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sentiment || !blocker || isSaving) return;

        setIsSaving(true);
        setError(null);

        const pageContext = {
            path: "/help",
            mode: profile?.mode || "unknown",
            created_at_client: new Date().toISOString(),
        };

        try {
            const { error: saveError } = await supabase
                .from("user_feedback")
                .insert({
                    user_id: user.id,
                    sentiment,
                    blocker,
                    details,
                    page_context: pageContext,
                });

            if (saveError) throw saveError;

            setSuccess(true);
            setSentiment(null);
            setBlocker("");
            setDetails("");
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <SideNav userEmail={user?.email} activeProfile={profile} isPro={isPro} />

            <main className="flex-1 lg:ml-64 min-h-screen">
                <div className="p-4 md:p-8 max-w-4xl mx-auto">
                    {/* Top Navigation */}
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        {t.back}
                    </button>

                    {/* Header & Tabs */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-heading">
                            {activeTab === "help" ? t.help_title : t.feedback_title}
                        </h1>

                        <div className="inline-flex p-1 bg-slate-200/50 rounded-lg">
                            <button
                                onClick={() => setActiveTab("help")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all text-sm font-medium ${activeTab === "help"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <HelpCircle className="h-4 w-4" />
                                {t.help_tab}
                            </button>
                            <button
                                onClick={() => setActiveTab("feedback")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all text-sm font-medium ${activeTab === "feedback"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <MessageSquare className="h-4 w-4" />
                                {t.feedback_tab}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="animate-in fade-in duration-500">
                        {activeTab === "help" ? (
                            <div className="grid gap-8">

                                {/* Actions Card */}
                                <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="font-semibold text-slate-900">{t.actions_title}</h2>
                                    </div>
                                    <div className="p-6 grid gap-4">
                                        {[
                                            { label: t.action_1, link: "/dashboard", btn: t.goto_dashboard },
                                            { label: t.action_2, link: "/studio", btn: t.goto_studio },
                                            { label: t.action_3, link: "/profiles", btn: t.goto_profiles },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                                                <p className="text-sm text-slate-600">{item.label}</p>
                                                <button
                                                    onClick={() => router.push(item.link)}
                                                    className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap inline-flex items-center gap-2"
                                                >
                                                    {item.btn}
                                                    <ExternalLink className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* How it Works / Steps */}
                                <section className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                        <h2 className="font-semibold text-slate-900 mb-4">{t.steps_title}</h2>
                                        <div className="space-y-4">
                                            {[t.step_1, t.step_2, t.step_3, t.step_4].map((step, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" />
                                                    <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                                        <p className="text-lg font-medium italic opacity-90 mb-4 relative z-10">
                                            “Small daily actions compound into authority.”
                                        </p>
                                        <p className="text-sm opacity-60 relative z-10">
                                            ContentBuddy is built to streamline your strategic thinking, not just write posts. Focus on the leverage.
                                        </p>
                                    </div>
                                </section>

                                {/* Common Confusion / FAQ */}
                                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-slate-900 mb-6">{t.confusion_title}</h2>
                                    <div className="grid gap-6">
                                        {[
                                            { q: t.q1, a: t.a1 },
                                            { q: t.q2, a: t.a2 },
                                            { q: t.q3, a: t.a3 },
                                        ].map((faq, i) => (
                                            <div key={i} className="group">
                                                <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                                    <ChevronRight className="h-3 w-3 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                                    {faq.q}
                                                </h3>
                                                <p className="text-sm text-slate-500 pl-5 leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto">
                                {success ? (
                                    <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center animate-in zoom-in duration-300">
                                        <div className="inline-flex p-3 bg-green-50 rounded-full mb-6">
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-2">{t.success_msg}</h2>
                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitFeedback} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                                        <div className="p-8 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-500 mb-6">{t.sentiment_prompt}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setSentiment("positive")}
                                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${sentiment === "positive"
                                                        ? "border-slate-900 bg-slate-50 scale-[0.98]"
                                                        : "border-slate-100 bg-white hover:border-slate-200"
                                                        }`}
                                                >
                                                    <Smile className={`h-6 w-6 ${sentiment === "positive" ? "text-slate-900" : "text-slate-400"}`} />
                                                    <span className="text-xs font-semibold">{t.sentiment_pos}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSentiment("neutral")}
                                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${sentiment === "neutral"
                                                        ? "border-slate-900 bg-slate-50 scale-[0.98]"
                                                        : "border-slate-100 bg-white hover:border-slate-200"
                                                        }`}
                                                >
                                                    <Meh className={`h-6 w-6 ${sentiment === "neutral" ? "text-slate-900" : "text-slate-400"}`} />
                                                    <span className="text-xs font-semibold">{t.sentiment_neu}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSentiment("negative")}
                                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${sentiment === "negative"
                                                        ? "border-slate-900 bg-slate-50 scale-[0.98]"
                                                        : "border-slate-100 bg-white hover:border-slate-200"
                                                        }`}
                                                >
                                                    <Frown className={`h-6 w-6 ${sentiment === "negative" ? "text-slate-900" : "text-slate-400"}`} />
                                                    <span className="text-xs font-semibold">{t.sentiment_neg}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {sentiment && (
                                            <div className="p-8 animate-in slide-in-from-top-4 duration-300">
                                                <div className="mb-6">
                                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                        {t.killer_question}
                                                    </label>
                                                    <textarea
                                                        required
                                                        value={blocker}
                                                        onChange={(e) => setBlocker(e.target.value)}
                                                        placeholder={t.placeholder_killer}
                                                        rows={3}
                                                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm resize-none"
                                                    />
                                                    <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                                        {blocker.length} {t.char_range}
                                                    </p>
                                                </div>

                                                <div className="mb-8">
                                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                        {t.details_label}
                                                    </label>
                                                    <textarea
                                                        value={details}
                                                        onChange={(e) => setDetails(e.target.value)}
                                                        placeholder={t.placeholder_details}
                                                        rows={2}
                                                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm resize-none"
                                                    />
                                                </div>

                                                {error && (
                                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                                                        <div className="text-xs text-red-600 font-medium">
                                                            <p className="font-bold">{t.error_header}</p>
                                                            <p className="opacity-80">{error}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isSaving || blocker.length < 5}
                                                    className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                                                >
                                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                                    {isSaving ? t.submitting : t.submit}
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    <footer className="mt-20 py-8 border-t border-slate-200">
                        <p className="text-xs text-slate-400 font-medium">
                            © 2024 Influence & Revenue Architect. All rights reserved.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

/**
 * IMPLEMENTATION NOTES
 * 
 * 1. SUPABASE SCHEMA (Run this in SQL Editor):
 * 
 * CREATE TABLE public.user_feedback (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid not null references auth.users(id) on delete cascade,
 *   sentiment text not null, -- 'positive' | 'neutral' | 'negative'
 *   blocker text not null,
 *   details text,
 *   page_context jsonb,
 *   created_at timestamp with time zone default now()
 * );
 * 
 * -- Enable RLS
 * ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
 * 
 * -- Policies
 * CREATE POLICY "Users can insert their own feedback" ON public.user_feedback
 *   FOR INSERT WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Admins can view all feedback" ON public.user_feedback
 *   FOR SELECT USING (false); -- Adjust as needed for admin roles
 * 
 * 
 * 2. FONTS CONFIGURATION (app/layout.tsx):
 * 
 * Ensure the following fonts are loaded and passed as CSS variables in layout.tsx:
 * 
 * import { Noto_Sans_Thai, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
 * 
 * const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"], variable: "--font-noto-thai" });
 * const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-jp" });
 * const notoSansKR = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto-kr" });
 * 
 * Then applied in the body className:
 * <body className={`${notoSansThai.variable} ${notoSansJP.variable} ${notoSansKR.variable} font-sans`}>
 * 
 * And in tailwind.config.ts:
 * theme: {
 *   extend: {
 *     fontFamily: {
 *       sans: [
 *         "var(--font-inter)", 
 *         "var(--font-noto-thai)", 
 *         "var(--font-noto-jp)", 
 *         "var(--font-noto-kr)", 
 *         "sans-serif"
 *       ],
 *     },
 *   },
 * }
 */
