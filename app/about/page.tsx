export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">About PROMPTY</h1>
        <p className="text-sm text-slate-600 mb-4">
          PROMPTY is an AI-powered studio for planning and generating
          social media content across multiple platforms.
        </p>
        <p className="text-sm text-slate-600">
          This is an MVP version focused on:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          <li>Business / Seller onboarding</li>
          <li>Content creator onboarding</li>
          <li>Content Studio for post & video ideas</li>
          <li>Basic dashboard and pricing pages</li>
        </ul>
      </div>
    </main>
  );
}
