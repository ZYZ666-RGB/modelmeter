"use client";

import { ArrowUpRight, Calculator, Check, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Workload = {
  inputTokens: number;
  outputTokens: number;
  requestsPerDay: number;
  daysPerMonth: number;
};

type Provider = "OpenAI" | "Anthropic" | "Google";

type ModelPrice = {
  provider: Provider;
  model: string;
  input: number;
  output: number;
  note?: string;
};

const DEFAULTS: Workload = {
  inputTokens: 1500,
  outputTokens: 500,
  requestsPerDay: 1000,
  daysPerMonth: 30,
};

const PRESETS: Array<{ label: string; values: Workload }> = [
  { label: "Prototype", values: { inputTokens: 1000, outputTokens: 300, requestsPerDay: 50, daysPerMonth: 30 } },
  { label: "Growing app", values: DEFAULTS },
  { label: "Agent workload", values: { inputTokens: 6000, outputTokens: 1500, requestsPerDay: 300, daysPerMonth: 30 } },
];

const MODELS: ModelPrice[] = [
  { provider: "OpenAI", model: "GPT-5.6 Luna", input: 0.2, output: 1.2 },
  { provider: "OpenAI", model: "GPT-5.6 Terra", input: 2, output: 12 },
  { provider: "Anthropic", model: "Claude Haiku 4.5", input: 1, output: 5 },
  { provider: "Anthropic", model: "Claude Sonnet 5", input: 2, output: 10 },
  { provider: "Google", model: "Gemini 3.1 Flash-Lite", input: 0.25, output: 1.5 },
  { provider: "Google", model: "Gemini 3.8 Flash", input: 0.75, output: 3.75, note: "Promotional rate through Dec 31, 2026" },
];

function clamp(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), max);
}

function money(value: number) {
  if (value > 0 && value < 0.01) return "$" + value.toFixed(4);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function compact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function Home() {
  const [workload, setWorkload] = useState<Workload>(DEFAULTS);

  useEffect(() => {
    type ModelContext = {
      registerTool: (
        tool: {
          name: string;
          title: string;
          description: string;
          inputSchema: object;
          annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
          execute: (input: unknown) => Workload;
        },
        options: { signal: AbortSignal },
      ) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const validate = (input: unknown): Workload => {
      if (!input || typeof input !== "object") throw new Error("A workload object is required.");
      const value = input as Record<string, unknown>;
      const keys: Array<keyof Workload> = [
        "inputTokens",
        "outputTokens",
        "requestsPerDay",
        "daysPerMonth",
      ];
      for (const key of keys) {
        if (typeof value[key] !== "number" || !Number.isFinite(value[key]) || Number(value[key]) < 0) {
          throw new Error(key + " must be a non-negative number.");
        }
      }
      if (Number(value.daysPerMonth) > 31) throw new Error("daysPerMonth cannot exceed 31.");
      return {
        inputTokens: clamp(Number(value.inputTokens), 100_000_000),
        outputTokens: clamp(Number(value.outputTokens), 100_000_000),
        requestsPerDay: clamp(Number(value.requestsPerDay), 100_000_000),
        daysPerMonth: clamp(Number(value.daysPerMonth), 31),
      };
    };

    void Promise.resolve(
      context.registerTool(
        {
          name: "configure_cost_estimate",
          title: "Configure cost estimate",
          description:
            "Set the visible ModelMeter workload inputs and recalculate monthly API costs.",
          inputSchema: {
            type: "object",
            properties: {
              inputTokens: { type: "number", minimum: 0 },
              outputTokens: { type: "number", minimum: 0 },
              requestsPerDay: { type: "number", minimum: 0 },
              daysPerMonth: { type: "number", minimum: 0, maximum: 31 },
            },
            required: ["inputTokens", "outputTokens", "requestsPerDay", "daysPerMonth"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input) {
            const next = validate(input);
            setWorkload(next);
            return next;
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);

    return () => lifecycle.abort();
  }, []);

  const totals = useMemo(() => {
    const requests = workload.requestsPerDay * workload.daysPerMonth;
    const input = workload.inputTokens * requests;
    const output = workload.outputTokens * requests;
    const results = MODELS.map((item) => ({
      ...item,
      cost: (input / 1_000_000) * item.input + (output / 1_000_000) * item.output,
    })).sort((a, b) => a.cost - b.cost);
    return {
      requests,
      input,
      output,
      results,
      max: Math.max(...results.map((item) => item.cost), 0.01),
    };
  }, [workload]);

  function update(key: keyof Workload, value: number) {
    setWorkload((current) => ({
      ...current,
      [key]: clamp(value, key === "daysPerMonth" ? 31 : 100_000_000),
    }));
  }

  const cheapest = totals.results[0];
  const runnerUp = totals.results[1];

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ModelMeter home">
          <span className="brand-mark"><Calculator size={19} /></span>
          <strong>ModelMeter</strong>
        </a>
        <div className="header-actions">
          <span className="verified"><i /> Prices checked Sep 17, 2026</span>
          <a className="icon-link" href="https://github.com/ZYZ666-RGB/modelmeter" target="_blank" rel="noreferrer" aria-label="GitHub repository">
            <span aria-hidden="true">GH</span>
          </a>
        </div>
      </header>

      <div className="shell" id="top">
        <section className="intro">
          <div>
            <p className="eyebrow"><Sparkles size={14} /> Cost planning for builders</p>
            <h1>Know the bill<span>before you ship.</span></h1>
          </div>
          <p className="intro-copy">
            Estimate and compare monthly text-generation costs across six current
            models. No sign-up, no API key, no hidden assumptions.
          </p>
        </section>

        <section className="workspace">
          <aside className="controls">
            <div className="controls-title">
              <div>
                <p className="eyebrow lime">Your workload</p>
                <h2>Monthly usage</h2>
              </div>
              <button className="reset" type="button" onClick={() => setWorkload(DEFAULTS)} aria-label="Reset workload" title="Reset workload">
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="presets" aria-label="Workload presets">
              {PRESETS.map((preset) => {
                const active = Object.keys(preset.values).every(
                  (key) => workload[key as keyof Workload] === preset.values[key as keyof Workload],
                );
                return (
                  <button className={active ? "preset active" : "preset"} type="button" key={preset.label} onClick={() => setWorkload(preset.values)}>
                    {active && <Check size={12} />} {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="fields">
              <NumberField label="Input tokens / request" hint="Prompt and context" value={workload.inputTokens} onChange={(value) => update("inputTokens", value)} />
              <NumberField label="Output tokens / request" hint="Generated response" value={workload.outputTokens} onChange={(value) => update("outputTokens", value)} />
              <NumberField label="Requests / day" hint="Successful model calls" value={workload.requestsPerDay} onChange={(value) => update("requestsPerDay", value)} />
              <NumberField label="Days / month" hint="Maximum 31" value={workload.daysPerMonth} onChange={(value) => update("daysPerMonth", value)} />
            </div>

            <div className="usage-summary">
              <div><span>Monthly requests</span><strong>{compact(totals.requests)}</strong></div>
              <div><span>Total tokens</span><strong>{compact(totals.input + totals.output)}</strong></div>
            </div>
          </aside>

          <div className="results">
            <section className="winner">
              <div>
                <p className="eyebrow">Lowest estimate</p>
                <div className="winner-price">{money(cheapest.cost)} <span>/ month</span></div>
                <p className="winner-model">{cheapest.model} <span>by {cheapest.provider}</span></p>
              </div>
              <p className="saving">
                At this workload, it is <strong>{money(Math.max(runnerUp.cost - cheapest.cost, 0))}</strong> cheaper than the next option each month.
              </p>
            </section>

            <section className="comparison">
              <div className="section-heading">
                <div>
                  <p className="eyebrow muted">Ranked comparison</p>
                  <h2>Estimated monthly cost</h2>
                </div>
                <span>USD · standard processing · no cache</span>
              </div>

              <div className="model-list">
                {totals.results.map((item, index) => (
                  <article className="model-row" key={item.provider + item.model}>
                    <div className="model-main">
                      <span className="rank">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <span className={"provider " + item.provider.toLowerCase()}>{item.provider}</span>
                        <h3>{item.model}</h3>
                      </div>
                    </div>
                    <Rate label="Input / 1M" value={item.input} />
                    <Rate label="Output / 1M" value={item.output} />
                    <div className="model-cost"><span>Monthly estimate</span><strong>{money(item.cost)}</strong></div>
                    <div className="bar"><i style={{ width: Math.max((item.cost / totals.max) * 100, 0.8).toFixed(2) + "%" }} /></div>
                    {item.note && <p className="model-note">{item.note}</p>}
                  </article>
                ))}
              </div>
            </section>

            <section className="explainer-grid">
              <article className="explainer">
                <h2>How the estimate works</h2>
                <code>(monthly input ÷ 1M × input rate)<br />+ (monthly output ÷ 1M × output rate)</code>
                <p>Token counts are provided by you. This tool does not estimate tokens from raw text and never sends data to a model provider.</p>
              </article>
              <article className="explainer blue">
                <h2>A clean baseline, not a billing quote</h2>
                <ul>
                  <li>Text-token pricing only</li>
                  <li>No cache, batch, regional, tool, or search fees</li>
                  <li>OpenAI short-context standard rates</li>
                  <li>Model quality and latency are not compared</li>
                </ul>
              </article>
            </section>

            <section className="sources">
              <p className="eyebrow muted">Official sources</p>
              <h2>Pricing checked on September 17, 2026</h2>
              <div className="source-grid">
                <SourceLink label="OpenAI" href="https://developers.openai.com/api/docs/pricing" />
                <SourceLink label="Anthropic" href="https://platform.claude.com/docs/en/models/overview" />
                <SourceLink label="Google Gemini" href="https://ai.google.dev/gemini-api/docs/pricing" />
              </div>
            </section>
          </div>
        </section>

        <footer>
          <span>Built for transparent AI cost planning.</span>
          <span className="footer-links">
            <a href="/retrospective">Build retrospective</a>
            <a href="/submission">Submission</a>
          </span>
        </footer>
      </div>
    </main>
  );
}

function NumberField({ label, hint, value, onChange }: { label: string; hint: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="field">
      <span><strong>{label}</strong><small>{hint}</small></span>
      <input type="number" inputMode="numeric" min={0} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Rate({ label, value }: { label: string; value: number }) {
  const digits = Number.isInteger(value) ? 0 : 2;
  return <div className="rate"><span>{label}</span><strong>{"$" + value.toFixed(digits)}</strong></div>;
}

function SourceLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}<ArrowUpRight size={15} />
    </a>
  );
}
