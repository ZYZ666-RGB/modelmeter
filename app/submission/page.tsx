import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ModelMeter — Project Submission",
  description: "Technical internship screening project submission by ZYZ666-RGB.",
};

const siteUrl = "https://modelmeter-ai-cost.fuzzy-krill-5067.chatgpt.site";

export default function SubmissionPage() {
  return (
    <main className="submission-shell">
      <nav className="article-nav">
        <a href="/">← Open ModelMeter</a>
        <span>Submitted Sep 17, 2026</span>
      </nav>
      <header className="submission-title">
        <p className="article-kicker">TECHNICAL INTERN SCREENING PROJECT</p>
        <h1>ModelMeter submission</h1>
        <p>AI API pricing calculator · built, verified, documented, and deployed.</p>
      </header>

      <section className="submission-card">
        <h2>0. Digital identity</h2>
        <dl>
          <div><dt>GitHub</dt><dd><a href="https://github.com/ZYZ666-RGB">github.com/ZYZ666-RGB ↗</a></dd></div>
          <div><dt>Blog / writing</dt><dd><a href="/retrospective">ModelMeter build retrospective ↗</a></dd></div>
          <div><dt>X / other community</dt><dd>None</dd></div>
          <div><dt>Featured work</dt><dd><a href={siteUrl}>ModelMeter ↗</a></dd></div>
        </dl>
      </section>

      <section className="submission-card">
        <h2>1. Project links</h2>
        <div className="submission-links">
          <a href={siteUrl}><span>Live product</span><strong>{siteUrl}</strong></a>
          <a href="https://github.com/ZYZ666-RGB/modelmeter"><span>Public repository</span><strong>github.com/ZYZ666-RGB/modelmeter</strong></a>
        </div>
      </section>

      <section className="submission-card">
        <h2>2. AI collaboration record</h2>
        <ol className="submission-list">
          <li>I used ChatGPT Work/Codex for MVP scoping, implementation, build checks, and browser QA.</li>
          <li>Web search verified prices only against official provider pages.</li>
          <li>AI drafted the first React structure, calculation flow, responsive CSS, and README outline.</li>
          <li>One AI-assisted choice was wrong: Lucide does not export the GitHub brand icon I initially imported.</li>
          <li>The production build exposed it; I replaced the icon and rebuilt successfully.</li>
          <li>Browser QA doubled request volume to confirm the cost doubled and tested the 31-day boundary.</li>
          <li>I am still not fully certain how future provider price changes should be synchronized automatically.</li>
          <li>Cross-provider quality is intentionally excluded because token price alone cannot support that conclusion.</li>
        </ol>
      </section>

      <section className="submission-card">
        <h2>3. Retrospective blog</h2>
        <a className="blog-link" href="/retrospective">
          <span>在四小时小项目里，我为什么先删功能</span>
          <strong>Read the public retrospective →</strong>
        </a>
      </section>

      <section className="submission-card">
        <h2>4. Five-line self-assessment</h2>
        <ol className="self-review">
          <li><strong>Most satisfied:</strong> The pricing assumptions are explicit, sourced, and reflected in a genuinely usable calculator.</li>
          <li><strong>Least confident:</strong> Pricing is still a manual snapshot instead of an automatically refreshed dataset.</li>
          <li><strong>With 8 more hours:</strong> I would add provider-aware token estimation, cache/batch modes, and regression tests.</li>
          <li><strong>Longest blocker:</strong> Normalizing three providers’ pricing rules took about 35 minutes.</li>
          <li><strong>What I would want in week one:</strong> A clear target user, success criteria, and production constraints—without prescribing the solution.</li>
        </ol>
      </section>
    </main>
  );
}
