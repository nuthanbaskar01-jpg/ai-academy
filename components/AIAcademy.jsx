import React, { useState, useMemo, useEffect, createContext, useContext, useRef } from "react";
import {
  Home, Map, Beaker, LayoutGrid, Network, Sparkles, Wand2, BarChart3,
  Flame, Zap, Lock, Check, Play, ArrowRight, ArrowLeft, Trophy, Star,
  GitFork, Heart, Send, Loader2, Rocket, Brain, Target, Lightbulb,
  ChevronRight, Plus, X, Hammer, GraduationCap, Compass, Bot, CircleDot,
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line,
} from "recharts";

/* ============================ THEME ============================ */
const C = {
  paper: "#F4EEE1", paper2: "#FBF7EE", card: "#FFFFFF", ink: "#1B1611",
  violet: "#5B3DF5", coral: "#FF5A3C", lime: "#C8F24A", sky: "#36C0F0",
  gold: "#FFC234", muted: "#8C8472", line: "#1B1611", green: "#2BB673",
};
const SH = `4px 4px 0 ${C.ink}`;
const SH_SM = `3px 3px 0 ${C.ink}`;
const SH_LG = `7px 7px 0 ${C.ink}`;
const card = (x = {}) => ({ background: C.card, border: `2.5px solid ${C.ink}`, borderRadius: 18, boxShadow: SH, ...x });
const chip = (bg, x = {}) => ({ background: bg, border: `2px solid ${C.ink}`, borderRadius: 999, padding: "3px 11px", fontWeight: 800, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 5, ...x });
const btn = (bg = C.violet, fg = "#fff", x = {}) => ({ background: bg, color: fg, border: `2.5px solid ${C.ink}`, borderRadius: 13, padding: "11px 18px", fontWeight: 800, cursor: "pointer", boxShadow: SH_SM, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontSize: 14, transition: "transform .08s, box-shadow .08s", ...x });
const D = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const M = { fontFamily: "'JetBrains Mono', monospace" };

/* ============================ DATA ============================ */
const SKILLS = [
  { key: "prompt", label: "Prompt Engineering", color: C.violet },
  { key: "rag", label: "RAG", color: C.coral },
  { key: "agents", label: "Agents", color: C.sky },
  { key: "workflows", label: "Workflows", color: C.gold },
  { key: "eval", label: "Evaluation", color: C.green },
  { key: "aiux", label: "AI UX", color: "#E84CC4" },
  { key: "strategy", label: "Product Strategy", color: "#7A5CFF" },
  { key: "automation", label: "Automation", color: "#FF8A3C" },
  { key: "founding", label: "Founding", color: "#1FA8A0" },
];
const SKILL_LABEL = Object.fromEntries(SKILLS.map((s) => [s.key, s.label]));

const TRACKS = [
  { id: "user", name: "AI User", icon: Compass, color: C.lime, fg: C.ink, blurb: "Get fluent with AI tools. Build assistants that save you hours.", level: "Beginner" },
  { id: "builder", name: "AI Builder", icon: Hammer, color: C.violet, fg: "#fff", blurb: "Build real LLM apps: critics, coaches, agents, and RAG.", level: "Intermediate" },
  { id: "pm", name: "AI Product Manager", icon: Target, color: C.coral, fg: "#fff", blurb: "Design AI products people trust. Evals, feedback loops, AI UX.", level: "Advanced" },
  { id: "founder", name: "AI Founder", icon: Rocket, color: C.sky, fg: C.ink, blurb: "Turn AI builds into a business. Distribution, GTM, growth.", level: "Expert" },
];

// Generic build engine: inputs -> Claude(system, template) -> artifact (markdown)
const MISSIONS = [
  /* ---------- TRACK: AI USER ---------- */
  {
    id: "meeting-assistant", track: "user", world: "Talk to AI", title: "Meeting Assistant", icon: "🗒️",
    tagline: "Turn messy notes into decisions, owners, and next steps.", est: 8, xp: 60,
    skills: [{ key: "prompt", amt: 14 }, { key: "automation", amt: 8 }],
    challenge: { problem: "Meeting notes are chaos. Decisions get lost, action items vanish.", why: "An AI that reliably extracts decisions + owners is a daily-use superpower.", deliverable: "A reusable Meeting Assistant prompt + a structured summary artifact." },
    build: {
      inputs: [{ id: "notes", label: "Paste raw meeting notes", placeholder: "we talked about pricing... Maya will check competitor... maybe ship next week... Raj unsure about API limits...", multiline: true }],
      system: "You are a precise meeting assistant. Always output clean markdown with these exact sections: ## Decisions, ## Action Items (as a table: Owner | Task | Due), ## Open Questions, ## TL;DR (1 line). Be concise. Infer owners only when stated.",
      template: (v) => `Summarize these raw notes into the required structure:\n\n${v.notes || "(no notes provided — invent a realistic 2-min standup to demonstrate)"}`,
      outputLabel: "Structured Meeting Summary",
    },
    exercise: { q: "Your assistant keeps inventing owners who weren't mentioned. Best fix?", options: ["Lower the temperature only", "Add an explicit instruction: 'only assign owners explicitly named'", "Ask it to be more creative", "Paste longer notes"], answer: 1, explain: "Constraining the instruction set is the cheapest, most reliable lever before touching parameters. This is prompt engineering: shaping behavior through clear rules." },
    reflection: [
      { c: "Outcome → Concept", b: "You built a useful tool first. The concept you just practiced is prompt engineering — steering a model with structure and constraints instead of hope." },
      { c: "Structured output", b: "Forcing exact sections (Decisions / Action Items table) is your first taste of structured outputs: predictable shape = something you can build on top of." },
    ],
  },
  {
    id: "research-assistant", track: "user", world: "Talk to AI", title: "Research Assistant", icon: "🔎",
    tagline: "Compress any topic into a decision-ready brief.", est: 10, xp: 70,
    skills: [{ key: "prompt", amt: 12 }, { key: "automation", amt: 10 }],
    challenge: { problem: "Researching a topic eats hours and ends in 30 open tabs.", why: "A research assistant that returns a structured, skeptical brief turns hours into minutes.", deliverable: "A topic brief with claims, counter-claims, and a confidence rating." },
    build: {
      inputs: [{ id: "topic", label: "What should it research?", placeholder: "Should an early-stage startup build on RAG or fine-tuning in 2025?", multiline: true }],
      system: "You are a skeptical research analyst. Output markdown: ## Bottom line, ## Key claims (bullets), ## Strongest counter-argument, ## What to verify, ## Confidence (Low/Med/High + why). Never bluff; flag uncertainty explicitly.",
      template: (v) => `Produce a decision brief on:\n\n${v.topic || "Whether to use RAG vs fine-tuning for a startup in 2025"}`,
      outputLabel: "Decision Brief",
    },
    exercise: { q: "Why force the model to give a 'Confidence' rating and 'What to verify'?", options: ["It looks professional", "It exposes the model's uncertainty so a human can judge — a basic evaluation + human-in-the-loop habit", "It makes outputs longer", "Models are always right"], answer: 1, explain: "Designing outputs that surface uncertainty is the seed of evaluation and human-in-the-loop design — you make the model auditable." },
    reflection: [
      { c: "Trust by design", b: "You didn't just get an answer — you got an answer that admits what it doesn't know. That's the foundation of trustworthy AI UX." },
      { c: "Concept unlocked", b: "Asking for 'what to verify' is a lightweight evaluation loop you can run by hand." },
    ],
  },
  {
    id: "personal-coach", track: "user", world: "Talk to AI", title: "Personal Coach", icon: "🎯",
    tagline: "A coach that asks before it advises.", est: 9, xp: 70,
    skills: [{ key: "prompt", amt: 12 }, { key: "aiux", amt: 10 }],
    challenge: { problem: "Most 'AI coaches' just dump generic advice.", why: "A great coach diagnoses first. You'll design a system prompt that creates a *persona* with a method.", deliverable: "A coaching system prompt + a sample first session." },
    build: {
      inputs: [{ id: "goal", label: "Your goal", placeholder: "Land an AI PM role in 90 days" }, { id: "context", label: "Your context (1-2 lines)", placeholder: "15 yrs UX design, pivoting to AI PM, in Bengaluru", multiline: true }],
      system: "You are an elite, warm-but-direct performance coach. Method: (1) reflect the goal back, (2) ask 2 sharp diagnostic questions, (3) propose ONE concrete next action for this week. Never lecture. Output markdown.",
      template: (v) => `Goal: ${v.goal || "Land an AI PM role in 90 days"}\nContext: ${v.context || "Designer pivoting to AI PM"}\n\nRun the first coaching session.`,
      outputLabel: "Coaching Session",
    },
    exercise: { q: "The coach's behavior is mostly controlled by...", options: ["The user's message", "The system prompt (its persona + method)", "The model's name", "Randomness"], answer: 1, explain: "The system prompt is where you encode persona, method, and constraints — the single highest-leverage surface in any AI product." },
    reflection: [
      { c: "System prompt = product", b: "You shaped an entire experience by writing a method into the system prompt. This is how most AI features actually differ." },
      { c: "AI UX", b: "Asking before advising is a UX decision, not a model one. The product is the interaction design." },
    ],
  },
  /* ---------- TRACK: AI BUILDER ---------- */
  {
    id: "prd-critic", track: "builder", world: "LLM Foundations", title: "PRD Critic", icon: "🧪", featured: true,
    tagline: "Build an AI that critiques product specs against a rubric.", est: 14, xp: 120,
    skills: [{ key: "prompt", amt: 16 }, { key: "eval", amt: 18 }, { key: "strategy", amt: 10 }],
    challenge: { problem: "PRDs ship vague. Reviewers give inconsistent, vibes-based feedback.", why: "A rubric-driven critic gives consistent, structured critique — your first real evaluation system.", deliverable: "A working PRD Critic that scores a spec and rewrites its weakest section." },
    build: {
      inputs: [{ id: "prd", label: "Paste a PRD (or a rough one)", placeholder: "Title: Smart Reminders. We want to add AI reminders to the app so users don't forget things. It will be smart. Success = more retention. We'll use AI.", multiline: true }],
      system: "You are a senior PM and PRD Critic. Score the PRD against this rubric (0-5 each): Problem Clarity, Target User, Success Metric, Scope/Non-goals, Risks. Output markdown: ## Scorecard (table: Criterion | Score | Why), ## Top 3 Gaps, ## Rewritten weakest section. Be specific and unsparing but constructive.",
      template: (v) => `Critique this PRD:\n\n${v.prd || "Title: Smart Reminders. Add AI reminders so users don't forget. It will be smart. Success = retention. We'll use AI."}`,
      outputLabel: "PRD Critique + Rewrite",
    },
    exercise: { q: "Why score against a fixed rubric instead of asking 'is this good?'", options: ["Rubrics are shorter", "A rubric makes critique consistent and comparable across runs — the core idea behind evals", "It uses fewer tokens", "Models prefer numbers"], answer: 1, explain: "A fixed rubric turns subjective vibes into a repeatable evaluation. Swap the PRD, keep the rubric → comparable scores. That's evals-driven thinking." },
    reflection: [
      { c: "You built an eval", b: "A rubric the model applies to any input is a lightweight evaluator. Real AI products live or die on evals like this." },
      { c: "Structured reasoning", b: "Forcing Scorecard → Gaps → Rewrite gives the model a reasoning scaffold, improving quality vs an open-ended ask." },
      { c: "Critique then act", b: "It doesn't just judge — it rewrites the weakest part. Diagnose + remediate is a powerful agent pattern." },
    ],
  },
  {
    id: "interview-coach", track: "builder", world: "LLM Foundations", title: "Interview Coach", icon: "🎤",
    tagline: "Convert a job description into a tailored prep plan.", est: 12, xp: 110,
    skills: [{ key: "prompt", amt: 14 }, { key: "strategy", amt: 12 }, { key: "aiux", amt: 8 }],
    challenge: { problem: "Generic interview prep ignores the actual role.", why: "Turn an unstructured JD into structured prep — practicing structured extraction.", deliverable: "A prep guide with likely questions mapped to your story bank." },
    build: {
      inputs: [{ id: "jd", label: "Paste a job description", placeholder: "AI Product Manager — own AI features, define evals, work with research, ship copilots...", multiline: true }, { id: "bg", label: "Your background (1 line)", placeholder: "UX leader pivoting to AI PM" }],
      system: "You are an interview coach. From the JD, output markdown: ## Role decoded (what they really want), ## 6 likely questions (by competency), ## Story angles for THIS candidate, ## One thing to ask them. Be specific to the JD, not generic.",
      template: (v) => `JD:\n${v.jd || "AI PM — own AI features, define evals, ship copilots."}\n\nCandidate: ${v.bg || "UX leader pivoting to AI PM"}`,
      outputLabel: "Tailored Prep Guide",
    },
    exercise: { q: "Turning a free-text JD into fixed sections is an example of...", options: ["Fine-tuning", "Structured extraction from unstructured input", "RAG", "Reinforcement learning"], answer: 1, explain: "Pulling typed structure (competencies, questions) out of messy text is structured extraction — a workhorse LLM pattern." },
    reflection: [
      { c: "Unstructured → structured", b: "The whole product is reshaping messy input into a typed, useful shape. Spot this pattern everywhere." },
      { c: "Personalization", b: "Conditioning on the candidate's background is cheap personalization without any training." },
    ],
  },
  {
    id: "startup-analyzer", track: "builder", world: "Going Agentic", title: "Startup Analyzer", icon: "📊",
    tagline: "Pressure-test a startup idea like a skeptical VC.", est: 13, xp: 120,
    skills: [{ key: "agents", amt: 10 }, { key: "strategy", amt: 16 }, { key: "eval", amt: 10 }],
    challenge: { problem: "Founders fall in love with ideas and skip the hard questions.", why: "Multi-lens analysis (market, moat, risk) mimics how an agent decomposes a task.", deliverable: "A VC-style memo with a go/no-go and the riskiest assumption." },
    build: {
      inputs: [{ id: "idea", label: "Describe the startup idea", placeholder: "An AI that turns Channapatna wooden-toy artisans into a premium global D2C brand", multiline: true }],
      system: "You are a sharp seed-stage investor. Analyze across lenses, output markdown: ## One-line thesis, ## Market & timing, ## Moat / why-now, ## Riskiest assumption, ## Go / No-go (+ what would change your mind). Be concrete, avoid platitudes.",
      template: (v) => `Analyze this idea:\n\n${v.idea || "AI that turns Channapatna artisans into a premium D2C toy brand"}`,
      outputLabel: "Investor Memo",
    },
    exercise: { q: "Breaking analysis into market/moat/risk lenses mirrors which AI pattern?", options: ["Lower temperature", "Task decomposition — how agents split a goal into sub-tasks", "Bigger context window", "Caching"], answer: 1, explain: "Decomposing a fuzzy goal into structured sub-tasks is exactly how agentic systems plan. You did it by prompt." },
    reflection: [
      { c: "Decomposition", b: "You manually decomposed a goal into lenses — the same move an agent makes autonomously with a planner." },
      { c: "Falsifiability", b: "'What would change your mind' forces a testable claim, the heart of good evaluation." },
    ],
  },
  {
    id: "research-agent", track: "builder", world: "Going Agentic", title: "Research Agent", icon: "🤖",
    tagline: "Design an agent loop: plan → act → reflect.", est: 16, xp: 150,
    skills: [{ key: "agents", amt: 20 }, { key: "workflows", amt: 14 }, { key: "rag", amt: 10 }],
    challenge: { problem: "One-shot answers miss nuance; you want a system that iterates.", why: "You'll specify a real agent loop and watch it reason in steps.", deliverable: "An agent that plans sub-questions, answers them, then synthesizes." },
    build: {
      inputs: [{ id: "q", label: "Research question", placeholder: "What does it take to make an AI coding tool sticky?", multiline: true }],
      system: "You are a research AGENT. Think in an explicit loop and SHOW it in markdown: ## Plan (3 sub-questions), ## Findings (answer each sub-question briefly), ## Reflection (what's still uncertain), ## Synthesis (final answer). Make the loop visible.",
      template: (v) => `Run your research loop on:\n\n${v.q || "What makes an AI coding tool sticky?"}`,
      outputLabel: "Agent Run (visible loop)",
    },
    exercise: { q: "What distinguishes an 'agent' from a single prompt?", options: ["It uses a bigger model", "It plans, acts in steps, and can reflect/iterate toward a goal", "It is always correct", "It never needs a human"], answer: 1, explain: "Agency = a goal pursued over multiple steps with planning and self-correction, not a one-shot reply." },
    reflection: [
      { c: "The agent loop", b: "Plan → Act → Reflect → Synthesize is the skeleton under most agent frameworks. You just specified one in plain English." },
      { c: "Workflows vs agents", b: "When you fix the steps, it's a workflow. When the model chooses the steps, it's an agent. You blended both." },
    ],
  },
  /* ---------- TRACK: AI BUILDER · World 3: Production AI ---------- */
  {
    id: "rag-builder", track: "builder", world: "Production AI", title: "RAG Builder", icon: "📚",
    tagline: "Make the model answer only from your sources — and admit when it can't.", est: 15, xp: 140,
    skills: [{ key: "rag", amt: 22 }, { key: "prompt", amt: 10 }, { key: "eval", amt: 8 }],
    challenge: { problem: "LLMs confidently make things up. Real apps must answer from YOUR data, not the model's memory.", why: "Grounding generation on retrieved context — and refusing when context is missing — is the heart of RAG and the #1 hallucination defense.", deliverable: "A grounded Q&A engine that cites its source lines and says 'not in the provided context' when it should." },
    build: {
      inputs: [
        { id: "context", label: "Paste your knowledge source (the 'retrieved' context)", placeholder: "Enterprise plans get a 30-day refund window. Pro plans get 14 days. Refunds are processed within 5 business days...", multiline: true },
        { id: "question", label: "User question", placeholder: "What's the refund window for enterprise plans?" },
      ],
      system: "You are a strict RAG answer engine. Answer the question USING ONLY the provided context. Rules: (1) quote the exact supporting line(s) as evidence, (2) if the answer is NOT in the context, reply exactly 'Not in the provided context.' and do NOT use outside knowledge, (3) never invent facts. Output markdown: ## Answer, ## Evidence (quoted lines), ## Grounding check (Fully grounded / Partial / Not found).",
      template: (v) => `CONTEXT:\n"""${v.context || "(no context provided — your answer must be 'Not in the provided context.')"}"""\n\nQUESTION: ${v.question || "What is the refund window for enterprise plans?"}`,
      outputLabel: "Grounded Answer + Evidence",
    },
    exercise: { q: "Your RAG bot answers a question that ISN'T in the retrieved context by using its training data. Core failure?", options: ["The model is too small", "It ignored grounding — it should have said 'not in context' instead of using outside knowledge", "The context was too long", "Temperature was too low"], answer: 1, explain: "RAG's whole promise is grounded, attributable answers. Falling back to parametric memory when context is missing reintroduces the exact hallucination RAG exists to prevent." },
    reflection: [
      { c: "Generation, grounded", b: "You built the generation half of RAG: condition the answer on retrieved context and constrain it to that. Faithful grounding beats fluent guessing." },
      { c: "The other half: retrieval", b: "Here you pasted context by hand. In production a retriever (embeddings + vector search) fetches the right chunks first — same generation contract, automated lookup." },
      { c: "Refusal is a feature", b: "'Not in the provided context' is designed behavior, not a bug. Knowing when NOT to answer is what makes RAG trustworthy." },
    ],
  },
  {
    id: "eval-harness", track: "builder", world: "Production AI", title: "Eval Harness", icon: "⚖️",
    tagline: "Build the judge that grades your AI — and grows a regression test set.", est: 16, xp: 150,
    skills: [{ key: "eval", amt: 24 }, { key: "prompt", amt: 10 }, { key: "workflows", amt: 8 }],
    challenge: { problem: "You 'improved' a prompt. Is it actually better, or did you silently break something? Vibes don't scale.", why: "Automated evals (LLM-as-judge + golden test sets) turn 'seems fine' into a repeatable score you can trust on every change.", deliverable: "A scored eval report on an AI output, plus a new golden test case to add to your suite." },
    build: {
      inputs: [
        { id: "task", label: "The task the AI was given", placeholder: "Summarize a support ticket into intent + urgency" },
        { id: "out", label: "The AI output to grade", placeholder: "Paste an output (or leave blank for a flawed sample to grade)", multiline: true },
      ],
      system: "You are an LLM-as-judge evaluator. Grade the AI output against the task on a rubric (0-5 each): Correctness, Completeness, Format adherence, Hallucination-safety. Output markdown: ## Scores (table: Dimension | Score | Reason), ## Verdict (PASS/FAIL + the threshold you used), ## Failure category (if any), ## Suggested golden test case (a fixed input + expected behavior to add to the regression suite). Be strict and consistent.",
      template: (v) => `TASK: ${v.task || "Summarize a support ticket into intent + urgency"}\n\nAI OUTPUT TO GRADE:\n"""${v.out || "Customer seems upset. Intent: maybe billing? Urgency: high probably. They mentioned a refund and also asked about login but I'm not totally sure."}"""`,
      outputLabel: "Eval Report + Golden Test",
    },
    exercise: { q: "Why use an LLM-as-judge with a fixed rubric instead of eyeballing outputs?", options: ["It's cheaper than reading", "Consistency + scale: the same rubric grades every version, so regressions surface automatically", "LLMs never make mistakes when judging", "It removes the need for humans entirely"], answer: 1, explain: "A fixed-rubric judge gives comparable scores across prompt versions, enabling automated regression detection. You still spot-check the judge against human labels — judges can be wrong, which is exactly why golden sets matter." },
    reflection: [
      { c: "Evals are the moat", b: "Anyone can write a prompt. Teams that win build evals that tell them, on every change, whether quality went up or down." },
      { c: "Golden test sets", b: "Each fixed input + expected behavior you save becomes a regression test. Your suite is an asset that compounds over time." },
      { c: "Judge the judge", b: "LLM-as-judge is powerful but fallible. Calibrate it against a few human-labeled cases before you trust its scores." },
    ],
  },
  {
    id: "workflow-orchestrator", track: "builder", world: "Production AI", title: "Workflow Orchestrator", icon: "🔗",
    tagline: "Chain prompts into a pipeline: draft → critique → revise, running for real.", est: 18, xp: 170,
    skills: [{ key: "workflows", amt: 24 }, { key: "agents", amt: 12 }, { key: "prompt", amt: 10 }],
    challenge: { problem: "One mega-prompt that does everything is brittle. Real systems split work into steps with clean contracts between them.", why: "Prompt chaining — each step does one job and passes typed output to the next — is how you get reliable, debuggable AI pipelines.", deliverable: "A live 3-stage pipeline (draft → critique → revise) that actually runs each step in sequence." },
    build: {
      inputs: [{ id: "brief", label: "What should the pipeline produce?", placeholder: "A cold outreach email to a VP of Product for an AI eval tool", multiline: true }],
      chain: [
        { label: "Stage 1 · Draft", system: "You are a fast drafter. Produce a tight first draft of what the user asks for. Output ONLY the draft, no preamble.", template: (v) => `Produce a first draft: ${v.brief || "A cold outreach email to a VP of Product for an AI eval tool"}` },
        { label: "Stage 2 · Critique", system: "You are a ruthless editor. Given a draft, list its 3 biggest, most specific, actionable weaknesses as bullets. Output ONLY the critique bullets.", template: (v, prev) => `Critique this draft:\n\n${prev}` },
        { label: "Stage 3 · Revise", system: "You are an editor. Given the goal and the critique, produce a final improved version that fixes every critique point. Output ONLY the final version.", template: (v, prev) => `GOAL: ${v.brief || "cold outreach email"}\n\nCRITIQUE TO ADDRESS:\n${prev}\n\nRewrite to fix every point above.` },
      ],
      outputLabel: "3-Stage Pipeline Run",
    },
    exercise: { q: "In a draft→critique→revise chain, why split into 3 calls instead of one prompt?", options: ["Three calls are faster", "Each step is simpler, testable, and swappable — and you can inspect/fix the output between steps", "It deliberately uses more tokens", "Models can't revise in a single call"], answer: 1, explain: "Decomposing into single-responsibility steps with inspectable intermediate outputs makes the system reliable and debuggable — and lets you improve or gate one stage without touching the others." },
    reflection: [
      { c: "You ran a real pipeline", b: "This wasn't a description — each stage was a separate model call, with the previous output feeding the next. That's prompt chaining / orchestration." },
      { c: "Workflows vs agents", b: "You FIXED the steps (draft→critique→revise) → that's a workflow: predictable and reliable. When the model chooses the next step itself, it becomes an agent. Production systems lean on workflows for the parts that must be reliable." },
      { c: "Contracts between steps", b: "Each stage had a clear input/output contract. Clean contracts are what let you test, cache, and swap steps independently." },
    ],
  },
  {
    id: "builder-capstone", track: "builder", world: "Production AI", title: "Capstone: Ship an AI Microservice", icon: "🏗️", featured: true,
    tagline: "Tie it together: prompt + RAG + evals + workflow into one spec — then stress-test it.", est: 22, xp: 220,
    skills: [{ key: "rag", amt: 12 }, { key: "eval", amt: 14 }, { key: "workflows", amt: 14 }, { key: "agents", amt: 10 }, { key: "prompt", amt: 8 }, { key: "strategy", amt: 6 }],
    challenge: { problem: "Knowing each piece isn't shipping a system. The capstone integrates everything into a real, defensible build spec.", why: "This is the builder's exit exam: turn an idea into a spec with grounding, evals, a workflow, and a self-critique of its failure modes.", deliverable: "A production-style AI microservice spec + an adversarial self-critique that hardens it before you'd ever ship." },
    build: {
      inputs: [{ id: "idea", label: "The AI feature / microservice to build", placeholder: "An API that turns raw customer interviews into a ranked list of product insights", multiline: true }],
      chain: [
        { label: "Stage 1 · Build spec", system: "You are a staff AI engineer. Produce a concise build spec in markdown for the requested AI microservice with sections: ## Job, ## Inputs/Outputs contract, ## Prompt & grounding strategy (note if RAG is needed and why), ## Workflow steps, ## Eval plan (rubric + golden set), ## Failure modes. Concrete and shippable.", template: (v) => `Design a build spec for: ${v.idea || "An API that turns raw customer interviews into a ranked list of product insights"}` },
        { label: "Stage 2 · Adversarial review", system: "You are a skeptical staff reviewer. Attack the given build spec: find its 3 weakest assumptions, the single most likely production failure, and the eval that's missing. End with a one-line ship-readiness verdict. Output markdown: ## Weakest assumptions, ## Most likely failure, ## Missing eval, ## Ship readiness.", template: (v, prev) => `Stress-test this build spec before launch:\n\n${prev}` },
      ],
      outputLabel: "Microservice Spec + Hardening Review",
    },
    exercise: { q: "What best signals a builder is ready to ship an AI feature?", options: ["It demos well once", "A defined eval/quality bar, a grounding strategy, and a plan for the known failure modes", "It uses the newest model", "The prompt is very long and detailed"], answer: 1, explain: "Ship-readiness is managed risk: a measurable quality bar, grounded/attributable answers, and explicit handling for failure modes — not a single impressive demo." },
    reflection: [
      { c: "Integration is the skill", b: "Prompting, RAG, evals, and workflows are useful alone but powerful combined. Shipping means weaving them into one coherent system." },
      { c: "Plan, then attack your plan", b: "The self-critique stage is the agent pattern plan→reflect, turned on your own design. Adversarial review before launch beats incident review after." },
      { c: "You're an AI Builder", b: "You can now take a fuzzy idea to a grounded, evaluated, orchestrated spec. That's the entire track, in one artifact." },
    ],
  },
  /* ---------- TRACK: AI PM ---------- */
  {
    id: "ai-feature-designer", track: "pm", world: "Designing AI", title: "AI Feature Designer", icon: "✦",
    tagline: "Spec an AI feature with evals and a feedback loop baked in.", est: 14, xp: 130,
    skills: [{ key: "strategy", amt: 18 }, { key: "eval", amt: 14 }, { key: "aiux", amt: 12 }],
    challenge: { problem: "Teams bolt 'AI' onto features with no way to know if it works.", why: "PMs who ship AI must define success + a feedback loop on day one.", deliverable: "An AI feature one-pager: job, eval, failure modes, HITL plan." },
    build: {
      inputs: [{ id: "feature", label: "The AI feature idea", placeholder: "Auto-categorize support tickets by intent and urgency", multiline: true }],
      system: "You are a senior AI PM. Output a one-pager in markdown: ## Job-to-be-done, ## How we'll measure quality (offline eval + online metric), ## Top 3 failure modes, ## Human-in-the-loop plan, ## What 'good enough to ship' means. Concrete and shippable.",
      template: (v) => `Design this AI feature:\n\n${v.feature || "Auto-categorize support tickets by intent and urgency"}`,
      outputLabel: "AI Feature One-Pager",
    },
    exercise: { q: "Best definition of 'good enough to ship' for an AI feature?", options: ["100% accuracy", "A measurable quality bar plus a safety net for the cases it gets wrong", "Whatever the demo shows", "When the model is the newest version"], answer: 1, explain: "AI features ship at a quality bar with a fallback for errors. Perfection isn't the gate — managed risk is." },
    reflection: [
      { c: "Define quality first", b: "You set the eval and ship bar before building. This is the PM superpower in AI." },
      { c: "Failure-mode thinking", b: "Naming top failure modes drives the HITL design — where humans catch what the model misses." },
    ],
  },
  {
    id: "copilot-experience", track: "pm", world: "Designing AI", title: "Copilot Experience", icon: "🪄",
    tagline: "Design the interaction model for an in-product copilot.", est: 13, xp: 120,
    skills: [{ key: "aiux", amt: 20 }, { key: "strategy", amt: 12 }, { key: "workflows", amt: 8 }],
    challenge: { problem: "Copilots that interrupt or over-promise erode trust fast.", why: "The interaction model — when it suggests, how it shows confidence — is the product.", deliverable: "A copilot interaction spec: triggers, affordances, trust signals, undo." },
    build: {
      inputs: [{ id: "app", label: "What app is this copilot inside?", placeholder: "A spreadsheet app for finance teams", multiline: true }],
      system: "You are an AI UX lead. Spec a copilot in markdown: ## When it shows up (triggers), ## How users invoke vs ignore it, ## Showing confidence & sources, ## Undo / control, ## Failure & escalation. Focus on trust and user control.",
      template: (v) => `Design the copilot interaction model for:\n\n${v.app || "A spreadsheet app for finance teams"}`,
      outputLabel: "Copilot Interaction Spec",
    },
    exercise: { q: "Which most builds user trust in a copilot?", options: ["Hiding when it's unsure", "Showing confidence/sources and giving easy undo + control", "Auto-applying changes silently", "More animations"], answer: 1, explain: "Trust comes from transparency (confidence, sources) and control (undo, opt-in). Silent automation breaks trust on the first miss." },
    reflection: [
      { c: "Interaction is the product", b: "Same model, different interaction model = totally different product. AI UX is where PMs win." },
      { c: "Trust mechanics", b: "Confidence, sources, undo, escalation — these are concrete, designable trust levers." },
    ],
  },
  /* ---------- TRACK: AI FOUNDER ---------- */
  {
    id: "ai-startup-ideas", track: "founder", world: "Zero to Launch", title: "AI Startup Ideas", icon: "💡",
    tagline: "Generate + filter AI startup ideas against real moats.", est: 11, xp: 110,
    skills: [{ key: "founding", amt: 18 }, { key: "strategy", amt: 12 }],
    challenge: { problem: "Most AI ideas are thin wrappers with no defensibility.", why: "You'll generate ideas then filter them through moat + distribution lenses.", deliverable: "3 ideas ranked by defensibility and unfair distribution." },
    build: {
      inputs: [{ id: "domain", label: "A domain you know well", placeholder: "Enterprise UX design for regulated industries", multiline: true }],
      system: "You are a startup studio partner. Output markdown: ## 3 AI startup ideas in this domain, then a ## Ranking table (Idea | Moat | Distribution edge | Wedge) and ## Pick one + why. Favor defensibility over novelty.",
      template: (v) => `Generate and rank AI startup ideas in:\n\n${v.domain || "Enterprise UX for regulated industries"}`,
      outputLabel: "Ranked Idea Memo",
    },
    exercise: { q: "What usually makes an AI startup defensible?", options: ["Using the newest model", "Proprietary data, workflow lock-in, or unfair distribution — not the model itself", "A nicer UI only", "Lower price"], answer: 1, explain: "Models commoditize. Moats come from data, workflow integration, and distribution — the things competitors can't copy overnight." },
    reflection: [
      { c: "Moats > models", b: "The model is rarely the moat. Distribution and proprietary data are. This reframes idea selection." },
      { c: "Wedge thinking", b: "A sharp wedge (one painful job, one segment) beats a broad 'platform' on day one." },
    ],
  },
  {
    id: "mvp-launch", track: "founder", world: "Zero to Launch", title: "MVP Launch Plan", icon: "🚀",
    tagline: "Plan a launch that produces signal, not just applause.", est: 12, xp: 120,
    skills: [{ key: "founding", amt: 18 }, { key: "automation", amt: 8 }, { key: "strategy", amt: 10 }],
    challenge: { problem: "Launches get likes but no learning or revenue.", why: "Design a launch around an activation event and a clear learning goal.", deliverable: "A 2-week launch plan with channels, the one metric, and a kill/scale rule." },
    build: {
      inputs: [{ id: "product", label: "Your MVP in one line", placeholder: "AI PRD Critic for product teams", multiline: true }, { id: "aud", label: "Who's it for?", placeholder: "Early-stage PMs" }],
      system: "You are a GTM advisor. Output markdown: ## The ONE activation metric, ## 2-week plan (week 1 / week 2), ## 3 distribution channels (specific), ## What signal = scale vs kill. Bias to cheap, fast learning.",
      template: (v) => `Plan the launch for: ${v.product || "AI PRD Critic"}\nAudience: ${v.aud || "early-stage PMs"}`,
      outputLabel: "Launch Plan",
    },
    exercise: { q: "Best primary metric for a learning-focused MVP launch?", options: ["Total signups", "An activation event that proves real value was delivered", "Social media likes", "Press mentions"], answer: 1, explain: "Activation (the moment users get real value) predicts retention far better than vanity signups or likes." },
    reflection: [
      { c: "Activation > signups", b: "Define the moment of value and measure that. It's the metric that compounds." },
      { c: "Kill/scale rules", b: "Pre-committing to a signal threshold beats post-hoc rationalization." },
    ],
  },
  {
    id: "first-customers", track: "founder", world: "Zero to Launch", title: "First Customers", icon: "🤝",
    tagline: "Find and convert your first 10 paying users.", est: 12, xp: 130,
    skills: [{ key: "founding", amt: 20 }, { key: "strategy", amt: 10 }],
    challenge: { problem: "'Build it and they'll come' is a myth. The first 10 are hand-won.", why: "You'll script outreach and a conversation that uncovers willingness to pay.", deliverable: "A target list profile + outreach message + discovery questions." },
    build: {
      inputs: [{ id: "product", label: "Product + who it's for", placeholder: "AI interview coach for career switchers", multiline: true }],
      system: "You are a founder-led sales coach. Output markdown: ## Ideal first-10 profile (specific), ## Where to find them, ## A short outreach DM (no fluff), ## 4 discovery questions that reveal willingness to pay, ## The ask. Be direct and human.",
      template: (v) => `Help land first 10 customers for:\n\n${v.product || "AI interview coach for career switchers"}`,
      outputLabel: "First-Customers Playbook",
    },
    exercise: { q: "What's the real goal of first-customer discovery calls?", options: ["Pitch as hard as possible", "Learn the problem deeply + test willingness to pay", "Get a testimonial", "Demo every feature"], answer: 1, explain: "Early calls are research. Understanding the problem and whether they'll pay beats pitching features they didn't ask for." },
    reflection: [
      { c: "Sell by listening", b: "Discovery > demo. The first 10 teach you the product as much as buy it." },
      { c: "Willingness to pay", b: "Asking about budget/urgency early saves months building for non-buyers." },
    ],
  },
];

const MISSIONS_BY_TRACK = (t) => MISSIONS.filter((m) => m.track === t);

// Seed gallery
const SEED_PROJECTS = [
  { id: "p1", title: "RecruitLens — JD → Prep", author: "Aanya", mission: "Interview Coach", skill: "prompt", likes: 42, forks: 9, remixed: false, blurb: "Tuned the coach to grill on system design. Brutal but fair." },
  { id: "p2", title: "SpecSheriff", author: "Marco", mission: "PRD Critic", skill: "eval", likes: 88, forks: 23, remixed: false, blurb: "Added a 6th rubric row: 'AI-readiness'. Catches fake AI features." },
  { id: "p3", title: "Toy Brand Memo", author: "Prabhakar", mission: "Startup Analyzer", skill: "strategy", likes: 31, forks: 4, remixed: false, blurb: "Channapatna artisans → premium D2C. Riskiest assumption: logistics." },
  { id: "p4", title: "Standup Whisperer", author: "Lena", mission: "Meeting Assistant", skill: "automation", likes: 19, forks: 2, remixed: false, blurb: "Outputs Slack-ready action items. Zero invented owners now." },
  { id: "p5", title: "DocGround", author: "Priya", mission: "RAG Builder", skill: "rag", likes: 64, forks: 17, remixed: false, blurb: "Refuses to answer off-doc. Cut hallucinated policy answers to near zero." },
  { id: "p6", title: "RegressionRadar", author: "Tom", mission: "Eval Harness", skill: "eval", likes: 51, forks: 12, remixed: false, blurb: "LLM-judge + 40 golden cases. Catches prompt regressions before deploy." },
];

/* ============================ STORE ============================ */
const Ctx = createContext(null);
const useAcademy = () => useContext(Ctx);

async function callClaude({ system, messages, max_tokens = 1000 }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens, system, messages }),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

/* ---- Persistence: real KV via the artifact's window.storage, in-memory fallback ----
   In the Claude.ai artifact, window.storage persists across reloads/sessions.
   Run this file in a plain browser/Next app and it transparently falls back to in-memory
   (swap in the localStorage/Supabase adapter from lib/storage.ts for true prod persistence). */
const SAVE_KEY = "aiacademy:v1";
const _mem = {};
const kv = {
  get available() { try { return typeof window !== "undefined" && !!window.storage && typeof window.storage.get === "function"; } catch { return false; } },
  async get(key) {
    if (this.available) { try { const r = await window.storage.get(key); return r ? r.value : null; } catch { return key in _mem ? _mem[key] : null; } }
    return key in _mem ? _mem[key] : null;
  },
  async set(key, value) {
    if (this.available) { try { await window.storage.set(key, value); return; } catch {} }
    _mem[key] = value;
  },
  async del(key) {
    if (this.available) { try { await window.storage.delete(key); return; } catch {} }
    delete _mem[key];
  },
};

/* ---- Analytics bridge: forwards every capture() to a real PostHog if one is on window
   (i.e. your deployed Next.js app with lib/analytics.ts installed). In the sandbox there's
   no posthog, so events flow only to the in-app feed. Same call sites, both environments. */
const ph = {
  present() { try { return typeof window !== "undefined" && !!window.posthog; } catch { return false; } },
  capture(name, props) { try { if (this.present() && window.posthog.capture) window.posthog.capture(name, props); } catch {} },
  identify(id) { try { if (this.present() && window.posthog.identify) window.posthog.identify(id); } catch {} },
};

function Provider({ children }) {
  const [view, setView] = useState("home");
  const [activeTrack, setActiveTrack] = useState("builder");
  const [activeMission, setActiveMission] = useState(null);
  const [completed, setCompleted] = useState({}); // missionId -> true
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(3);
  const [skills, setSkills] = useState(Object.fromEntries(SKILLS.map((s) => [s.key, 0])));
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [events, setEvents] = useState([]);
  const [customMissions, setCustomMissions] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved
  const [anonId, setAnonId] = useState(null);

  const capture = (name, props = {}) => {
    setEvents((e) => [{ name, props, t: Date.now() }, ...e].slice(0, 200));
    ph.capture(name, props); // -> real PostHog when deployed; no-op in sandbox
  };

  // Hydrate persisted progress on mount (real KV in artifact; in-memory otherwise)
  useEffect(() => {
    let alive = true;
    (async () => {
      let id = await kv.get(SAVE_KEY + ":uid");
      if (!id) { id = "learner_" + Math.random().toString(36).slice(2, 10); await kv.set(SAVE_KEY + ":uid", id); }
      if (alive) { setAnonId(id); ph.identify(id); }
      const raw = await kv.get(SAVE_KEY);
      if (raw && alive) {
        try {
          const s = JSON.parse(raw);
          if (s.completed) setCompleted(s.completed);
          if (typeof s.xp === "number") setXp(s.xp);
          if (typeof s.streak === "number") setStreak(s.streak);
          if (s.skills) setSkills((cur) => ({ ...cur, ...s.skills }));
          if (Array.isArray(s.userProjects) && s.userProjects.length)
            setProjects((ps) => [...s.userProjects, ...ps.filter((p) => !s.userProjects.find((u) => u.id === p.id))]);
        } catch {}
      }
      if (alive) { setHydrated(true); capture("app_opened", { restored: !!raw, backend: kv.available ? "kv" : "memory" }); }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line
  }, []);

  // Persist on change (debounced), only after hydration so we don't clobber saved state
  useEffect(() => {
    if (!hydrated) return;
    setSaveStatus("saving");
    const blob = JSON.stringify({ completed, xp, streak, skills, userProjects: projects.filter((p) => p.author === "You") });
    const t = setTimeout(async () => { await kv.set(SAVE_KEY, blob); setSaveStatus("saved"); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [completed, xp, streak, skills, projects, hydrated]);

  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;

  const isUnlocked = (m) => {
    const list = MISSIONS_BY_TRACK(m.track);
    const idx = list.findIndex((x) => x.id === m.id);
    if (idx <= 0) return true;
    return !!completed[list[idx - 1].id];
  };

  const completeMission = (m) => {
    if (completed[m.id]) return;
    setCompleted((c) => ({ ...c, [m.id]: true }));
    setXp((x) => x + m.xp);
    setSkills((s) => {
      const n = { ...s };
      m.skills.forEach((sk) => { n[sk.key] = Math.min(100, (n[sk.key] || 0) + sk.amt); });
      return n;
    });
    capture("mission_completed", { mission: m.title, track: m.track, xp: m.xp });
  };

  const publishProject = (m, blurb) => {
    const p = { id: "u" + Date.now(), title: m.title + " (yours)", author: "You", mission: m.title, skill: m.skills[0].key, likes: 0, forks: 0, remixed: false, blurb: blurb || "Built in AI Academy." };
    setProjects((ps) => [p, ...ps]);
    capture("project_published", { mission: m.title });
    return p;
  };

  const resetProgress = async () => {
    await kv.del(SAVE_KEY);
    setCompleted({}); setXp(0); setStreak(3);
    setSkills(Object.fromEntries(SKILLS.map((s) => [s.key, 0])));
    setProjects(SEED_PROJECTS);
    capture("progress_reset");
  };

  const value = {
    view, setView, activeTrack, setActiveTrack, activeMission, setActiveMission,
    completed, completeMission, xp, level, xpInLevel, streak, setStreak, skills,
    projects, setProjects, publishProject, events, capture, isUnlocked,
    customMissions, setCustomMissions,
    hydrated, saveStatus, anonId, resetProgress,
    phConnected: ph.present(), storageBackend: kv.available ? "window.storage" : "in-memory",
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ============================ SMALL UI ============================ */
function Press({ children, style, onClick, disabled, title }) {
  return (
    <button title={title} disabled={disabled} onClick={onClick}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "translate(2px,2px)", e.currentTarget.style.boxShadow = "1px 1px 0 " + C.ink)}
      onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = "", e.currentTarget.style.boxShadow = SH_SM)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = "", e.currentTarget.style.boxShadow = SH_SM)}
      style={{ ...style, opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}

function Markdown({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let list = [];
  const flush = (k) => { if (list.length) { out.push(<ul key={"u" + k} style={{ margin: "6px 0 10px", paddingLeft: 20 }}>{list}</ul>); list = []; } };
  const inline = (s) => {
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((p, i) => {
      if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
      if (/^`[^`]+`$/.test(p)) return <code key={i} style={{ ...M, background: C.paper, padding: "1px 5px", borderRadius: 5, fontSize: 12.5 }}>{p.slice(1, -1)}</code>;
      return <span key={i}>{p}</span>;
    });
  };
  lines.forEach((ln, i) => {
    if (/^\s*[-*]\s+/.test(ln)) { list.push(<li key={i} style={{ marginBottom: 3, lineHeight: 1.5 }}>{inline(ln.replace(/^\s*[-*]\s+/, ""))}</li>); return; }
    flush(i);
    if (/^###?\s/.test(ln)) out.push(<div key={i} style={{ ...D, fontWeight: 800, fontSize: 15, margin: "12px 0 4px", color: C.violet }}>{ln.replace(/^#+\s/, "")}</div>);
    else if (/^\|.*\|/.test(ln)) {
      if (/^\|[\s\-:|]+\|$/.test(ln)) return;
      const cells = ln.split("|").slice(1, -1).map((c) => c.trim());
      out.push(<div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${cells.length},1fr)`, gap: 6, padding: "4px 0", borderBottom: `1px solid ${C.paper}` }}>{cells.map((c, j) => <div key={j} style={{ fontSize: 12.5 }}>{inline(c)}</div>)}</div>);
    } else if (ln.trim() === "") out.push(<div key={i} style={{ height: 6 }} />);
    else out.push(<p key={i} style={{ margin: "3px 0", lineHeight: 1.55, fontSize: 13.5 }}>{inline(ln)}</p>);
  });
  flush("end");
  return <div>{out}</div>;
}

/* ============================ HUD / NAV ============================ */
function HUD() {
  const { xp, level, xpInLevel, streak, setStreak, capture } = useAcademy();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div style={chip(C.gold)}><Trophy size={13} /> Lv {level}</div>
      <div style={{ ...chip("#fff"), padding: "3px 6px 3px 11px", gap: 8 }}>
        <Zap size={13} fill={C.violet} color={C.violet} /> {xp} XP
        <div style={{ width: 70, height: 8, background: C.paper, borderRadius: 99, overflow: "hidden", border: `1.5px solid ${C.ink}` }}>
          <div style={{ width: `${(xpInLevel / 200) * 100}%`, height: "100%", background: C.violet }} />
        </div>
      </div>
      <Press onClick={() => { setStreak((s) => s + 1); capture("streak_extended", { streak: streak + 1 }); }}
        style={chip(C.coral, { color: "#fff", boxShadow: SH_SM })} title="Practice today (+1 streak)">
        <Flame size={13} fill="#fff" /> {streak}
      </Press>
    </div>
  );
}

function SaveChip() {
  const { saveStatus, hydrated, storageBackend } = useAcademy();
  const persistent = storageBackend === "window.storage";
  const label = !hydrated ? "Loading…" : saveStatus === "saving" ? "Saving…" : "Saved";
  const color = !hydrated ? C.muted : saveStatus === "saving" ? C.gold : C.green;
  return (
    <div title={persistent ? "Progress persists across sessions (window.storage)" : "Session-only (in-memory fallback)"}
      style={{ ...M, fontSize: 10.5, color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: color, border: `1.5px solid ${C.ink}` }} />
      {label}{!persistent && hydrated ? " · session only" : ""}
    </div>
  );
}

const NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "tracks", label: "Learning Paths", icon: Map },
  { id: "playground", label: "AI Playground", icon: Beaker },
  { id: "gallery", label: "Project Gallery", icon: LayoutGrid },
  { id: "skills", label: "Skill Graph", icon: Network },
  { id: "coach", label: "AI Coach", icon: Sparkles },
  { id: "realworld", label: "Real-World Mode", icon: Wand2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

function Sidebar() {
  const { view, setView, capture } = useAcademy();
  return (
    <div style={{ width: 232, flexShrink: 0, padding: 16, display: "flex", flexDirection: "column", gap: 6, borderRight: `2.5px solid ${C.ink}`, background: C.paper2, height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14, padding: "2px 4px" }}>
        <div style={{ width: 38, height: 38, background: C.violet, border: `2.5px solid ${C.ink}`, borderRadius: 11, display: "grid", placeItems: "center", boxShadow: SH_SM }}>
          <Brain size={21} color="#fff" />
        </div>
        <div>
          <div style={{ ...D, fontWeight: 800, fontSize: 17, lineHeight: 1 }}>AI Academy</div>
          <div style={{ ...M, fontSize: 9.5, color: C.muted, letterSpacing: 0.5 }}>BUILD TO LEARN</div>
        </div>
      </div>
      {NAV.map((n) => {
        const on = view === n.id;
        return (
          <Press key={n.id} onClick={() => { setView(n.id); capture("nav", { to: n.id }); }}
            style={{ ...btn(on ? C.ink : "transparent", on ? "#fff" : C.ink, { boxShadow: on ? SH_SM : "none", border: on ? `2.5px solid ${C.ink}` : "2.5px solid transparent", justifyContent: "flex-start", width: "100%", padding: "9px 12px" }) }}>
            <n.icon size={17} /> <span style={{ fontSize: 13.5 }}>{n.label}</span>
          </Press>
        );
      })}
      <div style={{ marginTop: "auto", fontSize: 10.5, color: C.muted, lineHeight: 1.5, padding: 6 }}>
        <span style={M}>The goal isn't teaching concepts.<br />It's creating people who build with AI.</span>
      </div>
    </div>
  );
}

/* ============================ HOME ============================ */
function Home_() {
  const { setView, setActiveTrack, completed, projects, skills } = useAcademy();
  const done = Object.keys(completed).length;
  const topSkill = SKILLS.map((s) => ({ ...s, v: skills[s.key] })).sort((a, b) => b.v - a.v)[0];
  return (
    <Scroll>
      <div style={{ ...card({ padding: 28, background: C.violet, color: "#fff", boxShadow: SH_LG, position: "relative", overflow: "hidden" }) }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, borderRadius: "50%", background: C.lime, opacity: 0.25 }} />
        <div style={chip(C.lime, { color: C.ink, marginBottom: 12 })}>⚡ Learn by building, not watching</div>
        <div style={{ ...D, fontSize: 38, fontWeight: 800, lineHeight: 1.04, maxWidth: 640 }}>
          Don't learn AI concepts.<br />Build AI products — <span style={{ color: C.lime }}>then</span> learn why they work.
        </div>
        <p style={{ maxWidth: 560, marginTop: 12, opacity: 0.92, lineHeight: 1.55 }}>
          Every mission ships a real artifact: a prompt, a tool, an agent, a launch plan. You leave each lesson with something usable.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Press onClick={() => setView("tracks")} style={btn(C.lime, C.ink, { fontSize: 15, padding: "13px 22px" })}>
            <Play size={17} fill={C.ink} /> Start building
          </Press>
          <Press onClick={() => setView("playground")} style={btn("#fff", C.ink, { fontSize: 15, padding: "13px 22px" })}>
            <Beaker size={17} /> Open Playground
          </Press>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 16 }}>
        {[
          { label: "Projects Built", v: projects.filter((p) => p.author === "You").length, sub: "Primary KPI", icon: Hammer, bg: C.lime, fg: C.ink },
          { label: "Missions Completed", v: done, sub: `of ${MISSIONS.length}`, icon: Check, bg: "#fff", fg: C.ink },
          { label: "Strongest Skill", v: topSkill.v > 0 ? topSkill.label : "—", sub: topSkill.v > 0 ? topSkill.v + "%" : "build to grow", icon: Star, bg: "#fff", fg: C.ink, small: true },
        ].map((s, i) => (
          <div key={i} style={card({ padding: 18, background: s.bg })}>
            <s.icon size={20} />
            <div style={{ ...D, fontWeight: 800, fontSize: s.small ? 19 : 34, marginTop: 6, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{s.label}</div>
            <div style={{ ...M, fontSize: 11, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <SectionTitle icon={Map}>Choose a learning path</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {TRACKS.map((t) => {
          const ms = MISSIONS_BY_TRACK(t.id);
          const dc = ms.filter((m) => completed[m.id]).length;
          return (
            <Press key={t.id} onClick={() => { setActiveTrack(t.id); setView("tracks"); }}
              style={card({ padding: 18, textAlign: "left", cursor: "pointer" })}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, background: t.color, color: t.fg, border: `2.5px solid ${C.ink}`, borderRadius: 12, display: "grid", placeItems: "center", boxShadow: SH_SM }}><t.icon size={24} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...D, fontWeight: 800, fontSize: 18 }}>{t.name}</div>
                  <div style={{ ...M, fontSize: 10.5, color: C.muted }}>{t.level} · {dc}/{ms.length} missions</div>
                </div>
                <ChevronRight size={20} />
              </div>
              <p style={{ fontSize: 12.5, color: "#5c554a", marginTop: 10, lineHeight: 1.5 }}>{t.blurb}</p>
              <div style={{ height: 8, background: C.paper, borderRadius: 99, marginTop: 10, overflow: "hidden", border: `1.5px solid ${C.ink}` }}>
                <div style={{ width: `${(dc / ms.length) * 100}%`, height: "100%", background: t.color }} />
              </div>
            </Press>
          );
        })}
      </div>
    </Scroll>
  );
}

/* ============================ TRACKS (Duolingo map) ============================ */
function Tracks() {
  const { activeTrack, setActiveTrack, setActiveMission, setView, completed, isUnlocked, capture } = useAcademy();
  const track = TRACKS.find((t) => t.id === activeTrack);
  const missions = MISSIONS_BY_TRACK(activeTrack);
  const worlds = [...new Set(missions.map((m) => m.world))];
  return (
    <Scroll>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {TRACKS.map((t) => (
          <Press key={t.id} onClick={() => setActiveTrack(t.id)}
            style={btn(activeTrack === t.id ? t.color : "#fff", activeTrack === t.id ? t.fg : C.ink, { padding: "8px 14px", fontSize: 13 })}>
            <t.icon size={15} /> {t.name}
          </Press>
        ))}
      </div>

      <div style={card({ padding: 20, background: track.color, color: track.fg, marginBottom: 22 })}>
        <div style={chip("#fff", { color: C.ink, marginBottom: 8 })}>{track.level}</div>
        <div style={{ ...D, fontWeight: 800, fontSize: 26 }}>{track.name}</div>
        <p style={{ marginTop: 4, fontSize: 13.5, maxWidth: 600, opacity: 0.92 }}>{track.blurb}</p>
      </div>

      {worlds.map((w) => {
        const wm = missions.filter((m) => m.world === w);
        return (
          <div key={w} style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ ...M, fontSize: 11, color: C.muted, letterSpacing: 1 }}>WORLD</div>
              <div style={{ ...D, fontWeight: 800, fontSize: 20 }}>{w}</div>
              <div style={{ flex: 1, height: 2.5, background: C.ink, opacity: 0.15 }} />
            </div>
            <div style={{ position: "relative", paddingLeft: 8 }}>
              {wm.map((m, i) => {
                const unlocked = isUnlocked(m);
                const done = completed[m.id];
                const offset = [0, 70, 35, 90, 20][i % 5];
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", marginBottom: 18, marginLeft: offset }}>
                    <Press disabled={!unlocked}
                      onClick={() => { setActiveMission(m); setView("mission"); capture("mission_opened", { mission: m.title }); }}
                      style={{ display: "flex", alignItems: "center", gap: 16, background: "transparent", border: "none", textAlign: "left", padding: 0 }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 30,
                        border: `3px solid ${C.ink}`, position: "relative",
                        background: done ? C.green : unlocked ? "#fff" : "#E7E1D4",
                        boxShadow: unlocked ? SH : "none", transition: "transform .1s",
                      }}>
                        {done ? <Check size={32} color="#fff" /> : unlocked ? m.icon : <Lock size={24} color={C.muted} />}
                        {m.featured && <div style={{ position: "absolute", top: -8, right: -8, ...chip(C.gold, { padding: "1px 7px", fontSize: 9 }) }}>★ FEATURED</div>}
                      </div>
                      <div style={{ maxWidth: 360 }}>
                        <div style={{ ...D, fontWeight: 800, fontSize: 16, color: unlocked ? C.ink : C.muted }}>{m.title}</div>
                        <div style={{ fontSize: 12, color: unlocked ? "#5c554a" : C.muted, lineHeight: 1.4, marginTop: 2 }}>{m.tagline}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                          <span style={{ ...M, fontSize: 10.5, color: C.muted }}>~{m.est} min</span>
                          <span style={{ ...M, fontSize: 10.5, color: C.violet, fontWeight: 700 }}>+{m.xp} XP</span>
                          {done && <span style={{ ...chip(C.lime, { padding: "0px 7px", fontSize: 9 }) }}>DONE</span>}
                        </div>
                      </div>
                    </Press>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Scroll>
  );
}

/* ============================ MISSION FLOW ============================ */
const STEPS = ["Challenge", "Guided Build", "Exercise", "Artifact", "Reflection"];

function Mission() {
  const { activeMission: m, setView, completeMission, completed, publishProject, capture } = useAcademy();
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [picked, setPicked] = useState(null);
  const [published, setPublished] = useState(false);

  if (!m) { setView("tracks"); return null; }
  const built = !!output;
  const exercisePassed = picked === m.exercise.answer;

  const runBuild = async () => {
    setLoading(true); setErr(""); setOutput("");
    capture("build_run", { mission: m.title, chained: !!m.build.chain });
    try {
      if (m.build.chain) {
        // Real multi-step pipeline: each stage is its own model call, fed the previous output.
        let acc = "", prev = "";
        for (const stage of m.build.chain) {
          const text = await callClaude({ system: stage.system, messages: [{ role: "user", content: stage.template(inputs, prev) }] });
          prev = text;
          acc += `## ${stage.label}\n${text}\n\n`;
          setOutput(acc.trim()); // progressive reveal so you watch the chain run stage by stage
        }
      } else {
        const text = await callClaude({ system: m.build.system, messages: [{ role: "user", content: m.build.template(inputs) }] });
        setOutput(text);
      }
    } catch (e) { setErr("Couldn't reach the model. Try again in a moment."); }
    setLoading(false);
  };

  const goNext = () => { capture("mission_step", { mission: m.title, step: STEPS[step] }); setStep((s) => Math.min(STEPS.length - 1, s + 1)); };

  return (
    <Scroll>
      <Press onClick={() => setView("tracks")} style={{ ...btn("#fff", C.ink, { padding: "7px 12px", fontSize: 12.5, marginBottom: 14 }) }}>
        <ArrowLeft size={15} /> Back to path
      </Press>

      <div style={card({ padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 })}>
        <div style={{ fontSize: 34 }}>{m.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...D, fontWeight: 800, fontSize: 22 }}>{m.title}</div>
          <div style={{ fontSize: 13, color: "#5c554a" }}>{m.tagline}</div>
        </div>
        <div style={chip(C.violet, { color: "#fff" })}><Zap size={12} fill="#fff" /> +{m.xp}</div>
      </div>

      {/* stepper */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 7, borderRadius: 99, background: i <= step ? C.violet : C.paper, border: `1.5px solid ${C.ink}` }} />
            <div style={{ ...M, fontSize: 9.5, marginTop: 4, color: i === step ? C.ink : C.muted, fontWeight: i === step ? 800 : 500 }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <div style={card({ padding: 24, minHeight: 300 })}>
        {/* STEP 0: CHALLENGE */}
        {step === 0 && (
          <div>
            <StepHead n="1" title="The Challenge" sub="Outcome first. Here's what you're about to build." />
            <Box label="The problem" color={C.coral}>{m.challenge.problem}</Box>
            <Box label="Why it matters" color={C.gold}>{m.challenge.why}</Box>
            <Box label="You'll walk away with" color={C.green}>{m.challenge.deliverable}</Box>
            <div style={{ ...M, fontSize: 11.5, color: C.muted, marginTop: 14, lineHeight: 1.5 }}>
              Concepts trained: {m.skills.map((s) => SKILL_LABEL[s.key]).join(" · ")} — but you'll <b>build first</b>, learn the theory in the Reflection.
            </div>
            <Press onClick={goNext} style={{ ...btn(C.violet, "#fff", { marginTop: 20 }) }}>Start building <ArrowRight size={16} /></Press>
          </div>
        )}

        {/* STEP 1: GUIDED BUILD (live Claude) */}
        {step === 1 && (
          <div>
            <StepHead n="2" title="Guided Build" sub="This runs a real model. You're shipping a working tool right now." />
            {m.build.inputs.map((inp) => (
              <div key={inp.id} style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 700, fontSize: 13, display: "block", marginBottom: 5 }}>{inp.label}</label>
                {inp.multiline ? (
                  <textarea value={inputs[inp.id] || ""} onChange={(e) => setInputs({ ...inputs, [inp.id]: e.target.value })}
                    placeholder={inp.placeholder} rows={4}
                    style={{ width: "100%", border: `2px solid ${C.ink}`, borderRadius: 11, padding: 11, fontFamily: "inherit", fontSize: 13, resize: "vertical", background: C.paper2, boxSizing: "border-box" }} />
                ) : (
                  <input value={inputs[inp.id] || ""} onChange={(e) => setInputs({ ...inputs, [inp.id]: e.target.value })}
                    placeholder={inp.placeholder}
                    style={{ width: "100%", border: `2px solid ${C.ink}`, borderRadius: 11, padding: 11, fontFamily: "inherit", fontSize: 13, background: C.paper2, boxSizing: "border-box" }} />
                )}
              </div>
            ))}
            {m.build.chain && (
              <div style={{ ...chip(C.sky, { marginBottom: 12 }) }}>🔗 Live pipeline · {m.build.chain.length} chained model calls, watch each stage appear</div>
            )}
            <Press disabled={loading} onClick={runBuild} style={btn(C.ink, "#fff")}>
              {loading ? <><Loader2 size={16} className="spin" /> {m.build.chain ? "Running pipeline…" : "Building…"}</> : <><Play size={16} fill="#fff" /> {m.build.chain ? "Run pipeline" : "Run build"}</>}
            </Press>
            {err && <div style={{ ...chip(C.coral, { color: "#fff", marginTop: 12 }) }}>{err}</div>}
            {output && (
              <div style={{ marginTop: 16 }}>
                <div style={chip(C.lime, { marginBottom: 8 })}>✓ {m.build.outputLabel} — your artifact</div>
                <div style={card({ padding: 16, background: C.paper2 })}><Markdown text={output} /></div>
                <Press onClick={goNext} style={{ ...btn(C.violet, "#fff", { marginTop: 16 }) }}>It works — next <ArrowRight size={16} /></Press>
              </div>
            )}
            {!output && !loading && <div style={{ ...M, fontSize: 11.5, color: C.muted, marginTop: 14 }}>Tip: leave inputs blank to see a demo run.</div>}
          </div>
        )}

        {/* STEP 2: EXERCISE */}
        {step === 2 && (
          <div>
            <StepHead n="3" title="Interactive Exercise" sub="Lock in the lesson hiding inside what you just built." />
            <div style={{ ...D, fontWeight: 800, fontSize: 16, marginBottom: 14 }}>{m.exercise.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {m.exercise.options.map((o, i) => {
                const isPicked = picked === i;
                const correct = i === m.exercise.answer;
                const show = picked !== null;
                let bg = "#fff";
                if (show && correct) bg = C.lime;
                else if (show && isPicked && !correct) bg = "#FFD9D0";
                return (
                  <Press key={i} disabled={picked !== null}
                    onClick={() => { setPicked(i); capture("exercise_answered", { mission: m.title, correct: i === m.exercise.answer }); }}
                    style={{ ...btn(bg, C.ink, { justifyContent: "flex-start", textAlign: "left", boxShadow: SH_SM, fontWeight: 600 }) }}>
                    <span style={{ ...M, fontWeight: 800, marginRight: 6 }}>{String.fromCharCode(65 + i)}</span> {o}
                    {show && correct && <Check size={16} style={{ marginLeft: "auto" }} />}
                  </Press>
                );
              })}
            </div>
            {picked !== null && (
              <div style={{ marginTop: 16 }}>
                <Box label={exercisePassed ? "Correct" : "Not quite"} color={exercisePassed ? C.green : C.coral}>{m.exercise.explain}</Box>
                <Press onClick={goNext} style={{ ...btn(C.violet, "#fff", { marginTop: 6 }) }}>Continue <ArrowRight size={16} /></Press>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ARTIFACT / PUBLISH */}
        {step === 3 && (
          <div>
            <StepHead n="4" title="Artifact Generation" sub="Every mission ends with something real you can keep, ship, or publish." />
            {!built && <Box label="Heads up" color={C.coral}>You skipped the build. Go back to step 2 and run it to generate an artifact.</Box>}
            {built && (
              <>
                <div style={chip(C.lime, { marginBottom: 10 })}>📦 {m.build.outputLabel}</div>
                <div style={card({ padding: 16, background: C.paper2, maxHeight: 240, overflow: "auto" })}><Markdown text={output} /></div>
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <Press disabled={published} onClick={() => { publishProject(m, (inputs[m.build.inputs[0].id] || "").slice(0, 90)); setPublished(true); }}
                    style={btn(C.coral, "#fff")}>
                    {published ? <><Check size={16} /> Published to Gallery</> : <><Rocket size={16} /> Publish to Gallery</>}
                  </Press>
                  <Press onClick={() => { navigator.clipboard && navigator.clipboard.writeText(output); }} style={btn("#fff", C.ink)}>Copy artifact</Press>
                </div>
              </>
            )}
            <Press onClick={goNext} style={{ ...btn(C.violet, "#fff", { marginTop: 20 }) }}>Now the theory <ArrowRight size={16} /></Press>
          </div>
        )}

        {/* STEP 4: REFLECTION */}
        {step === 4 && (
          <div>
            <StepHead n="5" title="Reflection — now the concepts" sub="You built it. Here's the theory you just used without realizing." />
            {m.reflection.map((r, i) => (
              <Box key={i} label={r.c} color={C.violet}>{r.b}</Box>
            ))}
            <div style={{ ...M, fontSize: 11.5, color: C.muted, marginTop: 8, marginBottom: 14 }}>
              Skills leveled up: {m.skills.map((s) => `${SKILL_LABEL[s.key]} +${s.amt}`).join(" · ")}
            </div>
            {completed[m.id] ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={chip(C.green, { color: "#fff", padding: "10px 16px", fontSize: 14 })}><Trophy size={16} /> Mission complete · +{m.xp} XP</div>
                <Press onClick={() => setView("tracks")} style={btn(C.violet, "#fff")}>Next mission <ArrowRight size={16} /></Press>
              </div>
            ) : (
              <Press disabled={!exercisePassed || !built}
                onClick={() => completeMission(m)}
                title={!built ? "Run the build first" : !exercisePassed ? "Pass the exercise first" : ""}
                style={btn(C.lime, C.ink, { fontSize: 15, padding: "13px 22px" })}>
                <Trophy size={18} /> Complete mission (+{m.xp} XP)
              </Press>
            )}
            {(!exercisePassed || !built) && !completed[m.id] && (
              <div style={{ ...M, fontSize: 11, color: C.muted, marginTop: 8 }}>
                {!built && "• Run the build · "}{!exercisePassed && "• Pass the exercise"} to complete.
              </div>
            )}
          </div>
        )}
      </div>
    </Scroll>
  );
}

function StepHead({ n, title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, background: C.ink, color: "#fff", borderRadius: 9, display: "grid", placeItems: "center", ...D, fontWeight: 800 }}>{n}</div>
        <div style={{ ...D, fontWeight: 800, fontSize: 20 }}>{title}</div>
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{sub}</div>
    </div>
  );
}
function Box({ label, color, children }) {
  return (
    <div style={{ borderLeft: `5px solid ${color}`, background: C.paper2, borderRadius: 10, padding: "10px 14px", margin: "8px 0", border: `2px solid ${C.ink}` }}>
      <div style={{ ...M, fontSize: 10.5, fontWeight: 800, color, letterSpacing: 0.5, marginBottom: 3, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

/* ============================ PLAYGROUND ============================ */
const PG_MODES = {
  balanced: { label: "Balanced", system: "You are a helpful, balanced assistant. Be clear and concise." },
  concise: { label: "Ruthlessly concise", system: "Answer in the fewest words possible. No preamble. Bullet points or one line only." },
  creative: { label: "Creative & vivid", system: "You are a bold, imaginative writer. Use vivid metaphors and unexpected angles." },
  rigorous: { label: "Rigorous & skeptical", system: "You are a rigorous analyst. Show reasoning, flag assumptions, and rate your confidence." },
};
function Playground() {
  const { capture } = useAcademy();
  const [prompt, setPrompt] = useState("Explain what a context window is, to a smart 12-year-old.");
  const [modes, setModes] = useState(["balanced", "concise"]);
  const [outs, setOuts] = useState({});
  const [loading, setLoading] = useState(false);

  const toggle = (k) => setModes((m) => m.includes(k) ? m.filter((x) => x !== k) : m.length < 3 ? [...m, k] : m);
  const run = async () => {
    setLoading(true); setOuts({}); capture("playground_run", { modes });
    const results = {};
    await Promise.all(modes.map(async (k) => {
      try { results[k] = await callClaude({ system: PG_MODES[k].system, messages: [{ role: "user", content: prompt }] }); }
      catch { results[k] = "⚠️ error reaching model"; }
    }));
    setOuts(results); setLoading(false);
  };
  return (
    <Scroll>
      <SectionTitle icon={Beaker}>AI Playground</SectionTitle>
      <p style={{ fontSize: 13.5, color: "#5c554a", marginTop: -8, marginBottom: 16, maxWidth: 640 }}>
        Same prompt, different <b>system prompts & behaviors</b> — run them side by side to feel how steering changes output. (Live Claude. Connecting GPT / Gemini / open models needs their API keys.)
      </p>
      <div style={card({ padding: 18, marginBottom: 16 })}>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
          style={{ width: "100%", border: `2px solid ${C.ink}`, borderRadius: 11, padding: 12, fontFamily: "inherit", fontSize: 14, resize: "vertical", boxSizing: "border-box", background: C.paper2 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {Object.entries(PG_MODES).map(([k, v]) => (
            <Press key={k} onClick={() => toggle(k)} style={btn(modes.includes(k) ? C.violet : "#fff", modes.includes(k) ? "#fff" : C.ink, { padding: "7px 13px", fontSize: 12.5 })}>
              {modes.includes(k) && <Check size={13} />} {v.label}
            </Press>
          ))}
        </div>
        <Press disabled={loading || !modes.length} onClick={run} style={{ ...btn(C.ink, "#fff", { marginTop: 14 }) }}>
          {loading ? <><Loader2 size={16} className="spin" /> Running…</> : <><Play size={16} fill="#fff" /> Compare ({modes.length})</>}
        </Press>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, modes.length)},1fr)`, gap: 14 }}>
        {modes.map((k) => (
          <div key={k} style={card({ padding: 16 })}>
            <div style={chip(C.gold, { marginBottom: 10 })}>{PG_MODES[k].label}</div>
            {loading && !outs[k] ? <div style={{ ...M, fontSize: 12, color: C.muted }}>thinking…</div> : <Markdown text={outs[k] || "Run to see output."} />}
          </div>
        ))}
      </div>
    </Scroll>
  );
}

/* ============================ GALLERY ============================ */
function Gallery() {
  const { projects, setProjects, capture } = useAcademy();
  const like = (id) => { setProjects((ps) => ps.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p)); capture("project_liked", { id }); };
  const fork = (p) => {
    const np = { ...p, id: "f" + Date.now(), title: p.title + " (fork)", author: "You", likes: 0, forks: 0, remixed: true };
    setProjects((ps) => [np, ...ps.map((x) => x.id === p.id ? { ...x, forks: x.forks + 1 } : x)]);
    capture("project_forked", { from: p.title });
  };
  return (
    <Scroll>
      <SectionTitle icon={LayoutGrid}>Project Gallery</SectionTitle>
      <p style={{ fontSize: 13.5, color: "#5c554a", marginTop: -8, marginBottom: 16 }}>Real builds from real learners. Fork one, remix it, make it better.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {projects.map((p) => {
          const sk = SKILLS.find((s) => s.key === p.skill);
          return (
            <div key={p.id} style={card({ padding: 18 })}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={chip(sk?.color || C.violet, { color: "#fff" })}>{sk?.label}</div>
                {p.remixed && <div style={chip(C.lime)}><GitFork size={11} /> remix</div>}
              </div>
              <div style={{ ...D, fontWeight: 800, fontSize: 17, marginTop: 10 }}>{p.title}</div>
              <div style={{ ...M, fontSize: 11, color: C.muted }}>by {p.author} · {p.mission}</div>
              <p style={{ fontSize: 13, color: "#5c554a", marginTop: 8, lineHeight: 1.5 }}>{p.blurb}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <Press onClick={() => like(p.id)} style={btn("#fff", C.ink, { padding: "7px 12px", fontSize: 12.5 })}><Heart size={14} /> {p.likes}</Press>
                <Press onClick={() => fork(p)} style={btn("#fff", C.ink, { padding: "7px 12px", fontSize: 12.5 })}><GitFork size={14} /> Fork ({p.forks})</Press>
              </div>
            </div>
          );
        })}
      </div>
    </Scroll>
  );
}

/* ============================ SKILL GRAPH ============================ */
function SkillGraph() {
  const { skills } = useAcademy();
  const data = SKILLS.map((s) => ({ skill: s.label.replace(" Engineering", "").replace("Product ", ""), v: skills[s.key], full: 100 }));
  const total = Object.values(skills).reduce((a, b) => a + b, 0);
  return (
    <Scroll>
      <SectionTitle icon={Network}>Skill Graph</SectionTitle>
      <p style={{ fontSize: 13.5, color: "#5c554a", marginTop: -8, marginBottom: 16 }}>Mastery grows only by building. Complete missions to expand your reach.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
        <div style={card({ padding: 16 })}>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke={C.muted} />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10.5, fill: C.ink, fontWeight: 600 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="v" stroke={C.violet} fill={C.violet} fillOpacity={0.45} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={card({ padding: 18 })}>
          <div style={{ ...D, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Mastery breakdown</div>
          <div style={{ ...M, fontSize: 11, color: C.muted, marginBottom: 14 }}>Total mastery points: {total}</div>
          {SKILLS.map((s) => (
            <div key={s.key} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>
                <span>{s.label}</span><span style={M}>{skills[s.key]}%</span>
              </div>
              <div style={{ height: 9, background: C.paper, borderRadius: 99, overflow: "hidden", border: `1.5px solid ${C.ink}` }}>
                <div style={{ width: `${skills[s.key]}%`, height: "100%", background: s.color, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scroll>
  );
}

/* ============================ AI COACH ============================ */
function Coach() {
  const { skills, completed, xp, level, capture, setView, setActiveTrack } = useAcademy();
  const [assessment, setAssessment] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [chatting, setChatting] = useState(false);

  const profile = () => {
    const done = Object.keys(completed).map((id) => MISSIONS.find((m) => m.id === id)?.title).filter(Boolean);
    const weak = SKILLS.filter((s) => skills[s.key] < 25).map((s) => s.label);
    const strong = SKILLS.filter((s) => skills[s.key] >= 40).map((s) => s.label);
    return { level, xp, completed: done, strengths: strong, gaps: weak, all_missions: MISSIONS.map((m) => m.title) };
  };
  const assess = async () => {
    setLoading(true); capture("coach_opened");
    try {
      const text = await callClaude({
        system: "You are the AI Academy coach. Given a learner's profile JSON, write a short, warm, specific assessment in markdown: ## Where you are, ## Your edge, ## Your gap, ## Your next mission (pick ONE from all_missions and say why). Max ~140 words. Be direct and encouraging, not generic.",
        messages: [{ role: "user", content: JSON.stringify(profile()) }],
      });
      setAssessment(text);
    } catch { setAssessment("Couldn't reach the coach right now."); }
    setLoading(false);
  };
  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const next = [...msgs, userMsg];
    setMsgs(next); setInput(""); setChatting(true);
    try {
      const text = await callClaude({
        system: "You are a sharp, supportive AI learning coach inside AI Academy. The learner is building AI products to learn. Be concise, concrete, and push them toward building. Learner profile: " + JSON.stringify(profile()),
        messages: next,
      });
      setMsgs([...next, { role: "assistant", content: text }]);
    } catch { setMsgs([...next, { role: "assistant", content: "Connection hiccup — try again." }]); }
    setChatting(false);
  };
  return (
    <Scroll>
      <SectionTitle icon={Sparkles}>AI Coach</SectionTitle>
      <p style={{ fontSize: 13.5, color: "#5c554a", marginTop: -8, marginBottom: 16 }}>Your personal mentor reads your real progress and tells you exactly what to build next.</p>
      <div style={card({ padding: 20, marginBottom: 16, background: C.paper2 })}>
        {!assessment && !loading && (
          <Press onClick={assess} style={btn(C.violet, "#fff")}><Brain size={16} /> Assess my progress</Press>
        )}
        {loading && <div style={{ ...M, color: C.muted }}><Loader2 size={15} className="spin" /> Reading your skill graph…</div>}
        {assessment && (
          <>
            <div style={chip(C.lime, { marginBottom: 10 })}><Bot size={13} /> Coach assessment</div>
            <Markdown text={assessment} />
            <Press onClick={assess} style={{ ...btn("#fff", C.ink, { marginTop: 12, fontSize: 12.5, padding: "7px 12px" }) }}>Re-assess</Press>
          </>
        )}
      </div>

      <div style={card({ padding: 16 })}>
        <div style={{ ...D, fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Ask your coach</div>
        <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.length === 0 && <div style={{ ...M, fontSize: 12, color: C.muted }}>e.g. "I keep failing prompt exercises — what should I drill?"</div>}
          {msgs.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", background: m.role === "user" ? C.violet : C.paper2, color: m.role === "user" ? "#fff" : C.ink, border: `2px solid ${C.ink}`, borderRadius: 12, padding: "8px 12px", fontSize: 13, lineHeight: 1.5 }}>
              {m.role === "user" ? m.content : <Markdown text={m.content} />}
            </div>
          ))}
          {chatting && <div style={{ ...M, fontSize: 12, color: C.muted }}><Loader2 size={13} className="spin" /> …</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything about your learning…"
            style={{ flex: 1, border: `2px solid ${C.ink}`, borderRadius: 11, padding: 10, fontFamily: "inherit", fontSize: 13, background: C.paper2 }} />
          <Press disabled={chatting} onClick={send} style={btn(C.ink, "#fff", { padding: "10px 14px" })}><Send size={15} /></Press>
        </div>
      </div>
    </Scroll>
  );
}

/* ============================ REAL-WORLD MODE ============================ */
function RealWorld() {
  const { capture, setView } = useAcademy();
  const [text, setText] = useState("");
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const gen = async () => {
    if (!text.trim()) return;
    setLoading(true); setMission(null); capture("realworld_submitted");
    try {
      const out = await callClaude({
        system: "You convert a learner's REAL work problem into a hands-on AI Academy mission. Output STRICT JSON only (no markdown fences): {\"title\":\"...\",\"why\":\"one line on the AI skill it builds\",\"steps\":[\"5 short build steps\"],\"skills\":[\"2-3 skill names\"],\"artifact\":\"what they'll walk away with\"}",
        messages: [{ role: "user", content: "My real problem/idea: " + text }],
      });
      const clean = out.replace(/```json|```/g, "").trim();
      setMission(JSON.parse(clean));
    } catch { setMission({ title: "Custom Mission", why: "Couldn't parse — try rephrasing.", steps: ["Try again"], skills: [], artifact: "" }); }
    setLoading(false);
  };
  return (
    <Scroll>
      <SectionTitle icon={Wand2}>Real-World Mode</SectionTitle>
      <p style={{ fontSize: 13.5, color: "#5c554a", marginTop: -8, marginBottom: 16, maxWidth: 640 }}>
        Bring a real work problem, product idea, or business challenge. The system turns it into a custom build mission — so you learn AI on <b>your</b> actual work.
      </p>
      <div style={card({ padding: 18, marginBottom: 16 })}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
          placeholder="e.g. My team drowns in customer feedback and we can't spot themes fast enough."
          style={{ width: "100%", border: `2px solid ${C.ink}`, borderRadius: 11, padding: 12, fontFamily: "inherit", fontSize: 14, resize: "vertical", boxSizing: "border-box", background: C.paper2 }} />
        <Press disabled={loading} onClick={gen} style={{ ...btn(C.coral, "#fff", { marginTop: 12 }) }}>
          {loading ? <><Loader2 size={16} className="spin" /> Designing your mission…</> : <><Wand2 size={16} /> Turn into a mission</>}
        </Press>
      </div>
      {mission && (
        <div style={card({ padding: 22, background: C.paper2 })}>
          <div style={chip(C.lime, { marginBottom: 10 })}>✨ Custom mission generated</div>
          <div style={{ ...D, fontWeight: 800, fontSize: 22 }}>{mission.title}</div>
          <div style={{ fontSize: 13, color: "#5c554a", marginTop: 4 }}>{mission.why}</div>
          {mission.skills?.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>{mission.skills.map((s, i) => <span key={i} style={chip(C.violet, { color: "#fff" })}>{s}</span>)}</div>}
          <div style={{ ...D, fontWeight: 800, fontSize: 14, marginTop: 16, marginBottom: 6 }}>Your build steps</div>
          {(mission.steps || []).map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, background: C.ink, color: "#fff", borderRadius: 7, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, paddingTop: 2 }}>{s}</div>
            </div>
          ))}
          {mission.artifact && <Box label="You'll walk away with" color={C.green}>{mission.artifact}</Box>}
          <Press onClick={() => setView("playground")} style={{ ...btn(C.violet, "#fff", { marginTop: 14 }) }}>Build it in the Playground <ArrowRight size={16} /></Press>
        </div>
      )}
    </Scroll>
  );
}

/* ============================ ANALYTICS (PostHog-style) ============================ */
const FUNNEL_STEPS = [
  { name: "Mission opened", ev: "mission_opened" },
  { name: "Build run", ev: "build_run" },
  { name: "Exercise answered", ev: "exercise_answered" },
  { name: "Mission completed", ev: "mission_completed" },
  { name: "Project published", ev: "project_published" },
];
function Analytics() {
  const { events, phConnected, storageBackend, anonId, resetProgress } = useAcademy();
  const [confirmReset, setConfirmReset] = useState(false);
  const persistent = storageBackend === "window.storage";
  const counts = (ev) => events.filter((e) => e.name === ev).length;
  const funnel = FUNNEL_STEPS.map((s) => ({ name: s.name, v: counts(s.ev) }));
  const maxF = Math.max(1, funnel[0].v);
  // simulated weekly retention curve (illustrative)
  const retention = [{ d: "D0", v: 100 }, { d: "D1", v: 58 }, { d: "D3", v: 41 }, { d: "D7", v: 33 }, { d: "D14", v: 27 }, { d: "D30", v: 22 }];
  const tiles = [
    { label: "Daily Active Learners", v: "1,284", sub: "+12% wk", c: C.violet },
    { label: "Weekly Retention", v: "33%", sub: "D7", c: C.coral },
    { label: "Project Completion", v: "61%", sub: "of starts", c: C.green },
    { label: "Learning Velocity", v: "2.4", sub: "missions/wk", c: C.gold },
  ];
  return (
    <Scroll>
      <SectionTitle icon={BarChart3}>Analytics</SectionTitle>
      <div style={card({ padding: 14, marginTop: -6, marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" })}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: persistent ? C.green : C.gold, border: `1.5px solid ${C.ink}` }} />
          <span style={{ ...M, fontSize: 11.5 }}><b>Persistence:</b> {persistent ? "window.storage (saved across sessions)" : "in-memory (session only)"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: phConnected ? C.green : C.muted, border: `1.5px solid ${C.ink}` }} />
          <span style={{ ...M, fontSize: 11.5 }}><b>PostHog:</b> {phConnected ? "connected — events forwarding live" : "not detected — in-app feed only (forwards live once deployed)"}</span>
        </div>
        {anonId && <span style={{ ...M, fontSize: 11, color: C.muted }}>id: {anonId}</span>}
        <div style={{ marginLeft: "auto" }}>
          {!confirmReset ? (
            <Press onClick={() => setConfirmReset(true)} style={btn("#fff", C.ink, { padding: "6px 12px", fontSize: 12 })}>↺ Reset progress</Press>
          ) : (
            <span style={{ display: "inline-flex", gap: 6 }}>
              <Press onClick={() => { resetProgress(); setConfirmReset(false); }} style={btn(C.coral, "#fff", { padding: "6px 12px", fontSize: 12 })}>Confirm reset</Press>
              <Press onClick={() => setConfirmReset(false)} style={btn("#fff", C.ink, { padding: "6px 12px", fontSize: 12 })}>Cancel</Press>
            </span>
          )}
        </div>
      </div>
      <div style={{ ...M, fontSize: 11, color: C.muted, marginBottom: 16, marginTop: -6 }}>
        Funnel below is live from your real session events; dashboard tiles & the retention curve are illustrative sample data.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {tiles.map((t, i) => (
          <div key={i} style={card({ padding: 16 })}>
            <div style={{ ...M, fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.label}</div>
            <div style={{ ...D, fontWeight: 800, fontSize: 28, color: t.c, marginTop: 4 }}>{t.v}</div>
            <div style={{ ...M, fontSize: 11, color: C.muted }}>{t.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginBottom: 18 }}>
        <div style={card({ padding: 18 })}>
          <div style={{ ...D, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Activation funnel <span style={{ ...M, fontSize: 10.5, color: C.green }}>● live this session</span></div>
          <div style={{ ...M, fontSize: 11, color: C.muted, marginBottom: 12 }}>Open a mission → build → complete → publish</div>
          {funnel.map((f, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>
                <span>{f.name}</span><span style={M}>{f.v}{i > 0 && funnel[0].v > 0 ? `  (${Math.round((f.v / maxF) * 100)}%)` : ""}</span>
              </div>
              <div style={{ height: 22, background: C.paper, borderRadius: 7, overflow: "hidden", border: `1.5px solid ${C.ink}` }}>
                <div style={{ width: `${(f.v / maxF) * 100}%`, height: "100%", background: [C.violet, C.sky, C.gold, C.green, C.coral][i], minWidth: f.v ? 3 : 0, transition: "width .4s" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={card({ padding: 18 })}>
          <div style={{ ...D, fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Retention curve <span style={{ ...M, fontSize: 10, color: C.muted }}>(illustrative)</span></div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={retention}>
              <XAxis dataKey="d" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="v" stroke={C.coral} strokeWidth={3} dot={{ r: 4, fill: C.coral }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={card({ padding: 18 })}>
        <div style={{ ...D, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Live event stream</div>
        <div style={{ ...M, fontSize: 11, color: C.muted, marginBottom: 12 }}>Every action you take fires a typed event (this is what gets sent to PostHog in production).</div>
        <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
          {events.length === 0 && <div style={{ ...M, fontSize: 12, color: C.muted }}>No events yet.</div>}
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, padding: "5px 10px", background: i % 2 ? C.paper2 : "transparent", borderRadius: 7 }}>
              <span style={{ ...M, color: C.muted, fontSize: 10.5 }}>{new Date(e.t).toLocaleTimeString()}</span>
              <span style={{ ...M, fontWeight: 800, color: C.violet }}>{e.name}</span>
              {Object.keys(e.props).length > 0 && <span style={{ ...M, color: C.muted, fontSize: 10.5 }}>{JSON.stringify(e.props)}</span>}
            </div>
          ))}
        </div>
      </div>
    </Scroll>
  );
}

/* ============================ LAYOUT HELPERS ============================ */
function Scroll({ children }) {
  return <div style={{ padding: "26px 30px", maxWidth: 940, margin: "0 auto" }} className="fadein">{children}</div>;
}
function SectionTitle({ icon: Icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0 14px" }}>
      <div style={{ width: 34, height: 34, background: C.ink, borderRadius: 10, display: "grid", placeItems: "center", boxShadow: SH_SM }}><Icon size={18} color="#fff" /></div>
      <div style={{ ...D, fontWeight: 800, fontSize: 24 }}>{children}</div>
    </div>
  );
}

/* ============================ ROOT ============================ */
function Shell() {
  const { view } = useAcademy();
  const Body = { home: Home_, tracks: Tracks, mission: Mission, playground: Playground, gallery: Gallery, skills: SkillGraph, coach: Coach, realworld: RealWorld, analytics: Analytics }[view] || Home_;
  return (
    <div style={{ display: "flex", height: "100%", background: C.paper, color: C.ink, ...{ fontFamily: "'Hanken Grotesk', sans-serif" } }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 26px", borderBottom: `2.5px solid ${C.ink}`, background: C.paper2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...M, fontSize: 11.5, color: C.muted }}>build → ship → understand</div>
            <SaveChip />
          </div>
          <HUD />
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}><Body /></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-thumb { background: ${C.ink}; border-radius: 99px; }
        ::-webkit-scrollbar-track { background: ${C.paper}; }
        textarea, input { outline: none; }
        textarea:focus, input:focus { box-shadow: ${SH_SM}; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fadein { animation: fadein .35s ease; }
        @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
      <div style={{ position: "fixed", inset: 0, fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <Shell />
      </div>
    </Provider>
  );
}
