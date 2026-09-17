# ModelMeter

ModelMeter is a focused AI API cost calculator for developers who need a quick,
transparent monthly estimate before choosing a model provider. It compares six
text-generation models from OpenAI, Anthropic, and Google using the same
workload assumptions.

The calculator runs entirely in the browser. It does not call provider APIs,
collect user data, or require an API key.

**Live site:** [modelmeter-ai-cost.hksbsjdidn.chatgpt.site](https://modelmeter-ai-cost.hksbsjdidn.chatgpt.site)

## What it does

- Accepts input tokens, output tokens, requests per day, and active days per month
- Calculates monthly input/output token volume
- Ranks six models by estimated monthly cost
- Shows input and output rates alongside each result
- Includes presets for prototype, growing application, and agent workloads
- Links every price to an official provider source
- Works across desktop and mobile layouts

## Calculation

ModelMeter uses the following baseline:

    monthly input cost =
      monthly input tokens / 1,000,000 * input rate

    monthly output cost =
      monthly output tokens / 1,000,000 * output rate

    estimated monthly cost =
      monthly input cost + monthly output cost

All displayed rates are USD per one million tokens.

## Pricing data

Prices were manually verified on **September 17, 2026**.

| Provider | Models included | Official source |
| --- | --- | --- |
| OpenAI | GPT-5.6 Luna, GPT-5.6 Terra | [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) |
| Anthropic | Claude Haiku 4.5, Claude Sonnet 5 | [Claude models overview](https://platform.claude.com/docs/en/models/overview) |
| Google | Gemini 3.1 Flash-Lite, Gemini 3.8 Flash | [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) |

Gemini 3.8 Flash uses the official promotional rate available through
December 31, 2026. The interface labels this temporary rate.

## Run locally

### Prerequisites

- Node.js 22.13 or newer
- pnpm 11

### Setup

    git clone https://github.com/ZYZ666-RGB/modelmeter.git
    cd modelmeter
    pnpm install
    pnpm dev

Open the local URL printed by the development server.

To create a production build:

    pnpm build

## Tech stack

- React 19
- TypeScript
- Vinext / Vite
- CSS with responsive media queries
- Lucide icons
- Cloudflare Workers-compatible deployment

## Data and security

- No API keys are needed
- No environment variables are required
- No user input leaves the browser
- The repository ignores environment files by default

## Known limitations

- Prices are a dated snapshot and are not refreshed automatically.
- The estimate covers standard, non-cached text processing only.
- Batch, cache, regional processing, search, tool, image, and audio fees are excluded.
- OpenAI estimates use short-context standard rates.
- Provider tokenizers differ, so the same raw text may produce different token counts.
- The tool compares price, not model quality, latency, reliability, or rate limits.
- It is an estimate rather than a provider billing quote.

## Project notes

- [AI collaboration record](docs/AI_COLLABORATION.md)
- [Retrospective source](docs/RETROSPECTIVE.md)

## Author

[ZYZ666-RGB](https://github.com/ZYZ666-RGB)
