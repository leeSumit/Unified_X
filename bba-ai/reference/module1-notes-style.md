# Module 1 Notes — Annotated Style Reference

This file contains real excerpts from the Module 1 notes with annotations explaining exactly what makes the writing effective. Use these as few-shot examples when prompting Claude to generate new module notes.

---

## Excerpt 1 — Chapter 1 Opening Narrative

**From**: Chapter 1 — The AI Revolution

> The year is 1950. Alan Turing, a 38-year-old British mathematician who has already helped win a world war by breaking Nazi codes, publishes a paper in the journal *Mind*. In it, he asks a question so simple it sounds naïve: *"Can machines think?"*
>
> He does not try to answer it. Instead, he proposes a test. Sit a human judge at a keyboard. In two separate rooms — one with a human, one with a machine — the judge types questions and receives typed answers. If, after sustained conversation, the judge cannot reliably tell which room contains the human, the machine has passed. Turing called this the Imitation Game. We now call it the Turing Test.
>
> What Turing understood — seventy-five years before the rest of the business world caught up — is that intelligence is not about processing speed or memory capacity. It is about **communication**. A machine that could converse convincingly was, for all practical purposes, thinking.

**Annotations:**

- ✅ **Opens with a scene, not a definition.** The reader is placed in 1950 before any explanation starts. This is the Kolb "concrete experience" entry point.
- ✅ **Specific details**: "38-year-old", "journal *Mind*", "Imitation Game" — not vague historical gestures but precise facts that create credibility
- ✅ **Short punchy sentence after longer ones**: "He does not try to answer it." A single sentence. Rhythm-breaking. Forces the reader to pause.
- ✅ **The "so what" is earned**: The final paragraph's insight ("it is about communication") lands harder because we've been in the scene first
- ✅ **No jargon**: No "Natural Language Processing", no "large language models" — those come later. This is the emotional hook, not the technical explanation.

---

## Excerpt 2 — The Double-Explanation Rule in Action

**From**: Chapter 3 — Anatomy of a Prompt

> Think of context like the briefing packet you give a new intern on their first day. The more complete your briefing — company history, current project status, who the difficult client is, which formatting the manager hates — the better their work on Day One. An intern handed a single sticky note that says "Write the proposal" will produce something generic and probably wrong.
>
> An LLM operates the same way. Its context window is the briefing packet. What you put in it determines what comes out.
>
> Freshworks discovered this the hard way when building Freddy AI, their customer-support assistant. Early versions of Freddy were generating technically correct but contextually useless replies — the kind of answer that resolves a ticket on paper but leaves the customer more frustrated. The root cause was context starvation: the prompts were not including customer history, account tier, or prior resolution attempts. Once the team engineered richer context into every Freddy query, first-contact resolution rates climbed from 31% to 45% within a quarter.

**Annotations:**

- ✅ **Analogy first**: The "intern briefing" image is universally relatable — any student who has ever worked a part-time job or internship has experienced this
- ✅ **One-sentence bridge**: "An LLM operates the same way." Short transition that snaps the analogy onto the concept.
- ✅ **Named company, named product**: "Freshworks" and "Freddy AI" — not "a large SaaS company"
- ✅ **Specific number**: 31% to 45% — not "significant improvement"
- ✅ **Specific cause**: "context starvation" — a named diagnosis, not vague explanation
- ✅ **Timeline**: "within a quarter" — the outcome has a timeline
- ✅ **The failure is named before the fix**: "technically correct but contextually useless" — honest about the failure mode

---

## Excerpt 3 — Career Anchor Paragraph

**From**: Chapter 1 — The AI Revolution

> Entry-level prompt engineers in India earn ₹5–10 lakhs per annum. These are not speculative numbers — they are from Glassdoor, Naukri, and LinkedIn listings as of early 2026. Mid-level roles at companies like Freshworks, Zoho, and Jio advertise ₹12–20 lakhs for "AI Product Specialists" whose primary job is designing, testing, and iterating prompts. At the senior level, "Head of AI Content" or "Prompt Architect" roles at funded startups are reaching ₹30–45 lakhs.
>
> Andrej Karpathy, former Director of AI at Tesla, captured the moment: *"The hottest new programming language is English."* He was right. And in India, fluency in this new language is currently undersupplied relative to demand.

**Annotations:**

- ✅ **Sources named explicitly**: "Glassdoor, Naukri, and LinkedIn" — not "industry sources"
- ✅ **Three salary levels given**: Entry, mid, senior — gives students a career progression picture, not just one data point
- ✅ **Job titles are exact strings**: "AI Product Specialists", "Prompt Architect" — the exact search terms students can use on Naukri
- ✅ **Real quote with attribution**: Karpathy quote is in italics, attributed with title and year
- ✅ **The India-specific insight**: "undersupplied relative to demand" — this is the takeaway that connects to the student's personal decision to be in this room
- ✅ **No hedging on the numbers**: "These are not speculative" — directly addresses the reader's potential skepticism

---

## Excerpt 4 — Framework Explanation (RACE)

**From**: Chapter 4 — RACE Framework

> **RACE stands for Role, Action, Context, Execute.** It is a four-component prompt structure designed to eliminate the most common cause of poor AI output: ambiguity. Each component eliminates a different source of ambiguity.
>
> **Role** tells the AI who it is supposed to be. Not "you are an AI assistant" — that is redundant. Role means: "You are a senior financial analyst at an Indian fintech startup. You have worked at Razorpay for three years. You write internal memos, not public-facing copy."
>
> When you define Role this way, the AI does not just shift its vocabulary — it shifts its assumptions. It will assume knowledge of Indian fintech regulations, assume ₹ as the default currency, assume a B2B audience.
>
> **Action** is the task — precise, specific, verb-led. "Write" is too vague. "Write a 150-word email explaining a 0.2% fee increase to a Tier-3 merchant, framing it as a service improvement" is an Action.
>
> A useful test: can two different people read your Action and produce the same output? If not, you need to add specificity.

**Annotations:**

- ✅ **Starts with a bold definition**: RACE is defined first, in plain language, then unpacked
- ✅ **Shows the bad version first**: "Not 'you are an AI assistant'" — the reader needs to see the wrong way before they can appreciate the right way
- ✅ **Shows the effect of doing it right**: "It will assume knowledge of Indian fintech regulations" — the student understands WHY the component matters, not just WHAT it is
- ✅ **The "useful test"**: A practical heuristic the student can actually apply. Not theory — procedure.
- ✅ **"Verb-led" instruction**: Gives students an easy check (does my Action start with a verb that is specific?)

---

## Excerpt 5 — Failure Taxonomy Entry

**From**: Chapter 10 — Error Analysis & Prompt Debugging

> **Mode 1: Hallucination**
>
> The model states something false with complete confidence. Not vague, not hedged — specifically wrong. You ask for the founding year of Freshworks and it tells you 2009 with a citation. Freshworks was founded in 2010.
>
> *Symptom*: Specific facts, statistics, quotes, or citations that are incorrect.
>
> *Root cause*: The model interpolates plausibly from its training distribution. If 2009 is the founding year of many similar SaaS companies, 2009 becomes a tempting completion.
>
> *Fix*: For any factual claim that matters, prompt the model to cite sources and then verify those sources independently. Never use an LLM as the primary source for a number, date, or quote that will appear in customer-facing or regulatory documents.
>
> *What mastery looks like*: You build a verification step into your workflow by default. You treat LLM-generated facts the way a journalist treats a source: promising but unverified until confirmed.

**Annotations:**

- ✅ **Named taxonomy**: "Mode 1: Hallucination" — students can reference this by name in class and exams
- ✅ **Concrete example before the definition**: The Freshworks founding year example happens before "root cause" — feel the problem before you understand it
- ✅ **Four-part structure**: Symptom → Root cause → Fix → What mastery looks like. Every failure mode has the same structure, so students can learn the pattern.
- ✅ **"What mastery looks like"**: This is the key differentiator — it tells students not just how to avoid the mistake but what a professional's workflow looks like

---

## Excerpt 6 — Chapter Close

**From**: Chapter 5 — AIDA Framework

> You now have two frameworks — RACE and AIDA — that solve different problems. RACE is architecture: it builds the structure of a prompt. AIDA is psychology: it sequences the reader's emotional journey. Used together, they cover both the craft of the input and the science of the output.
>
> The next chapter introduces Chain-of-Thought prompting, which solves a different problem entirely. RACE and AIDA tell the AI what to produce. Chain-of-Thought tells the AI *how to think before it produces*. It is the difference between handing a deliverable spec to a junior employee and handing a thinking framework to a senior one.

**Annotations:**

- ✅ **Recaps both frameworks in one sentence**: "RACE is architecture. AIDA is psychology." Memorable, contrast-driven, exam-ready
- ✅ **Creates forward tension**: "The next chapter introduces…" gives the reader a reason to keep going
- ✅ **The teaser uses an analogy**: "junior employee" vs "senior one" — frames the new concept before it is introduced so the student arrives at Chapter 6 with a prediction to test against
- ✅ **Short, punchy close**: Does not summarise everything. One forward-looking paragraph.

---

## Common Mistakes to Avoid (From Module 1 Editing Notes)

| Mistake | Example | Fix |
|---------|---------|-----|
| Opening with a definition | "RACE is an acronym that stands for…" | Open with the problem the framework solves |
| Passive voice | "The model was trained on…" | "OpenAI trained the model on…" |
| Vague company reference | "A major Indian bank used AI to…" | "HDFC Bank deployed its AI credit scoring in 2023, reducing defaults by 12%…" |
| USD instead of INR | "$50M revenue" | "₹415 crore revenue" |
| Hedged career data | "Some prompt engineers can earn good salaries" | "Entry-level prompt engineers earn ₹5–10L (Naukri, early 2026)" |
| Missing stakes | "This is why prompt engineering matters" | "Klarna eliminated 700 customer service jobs. The people who survived were prompt engineers." |
| Exclamation marks | "This is incredible!" | Describe the outcome concretely — let the fact do the work |
| Explaining what the next chapter will cover | "In the next chapter, we will explain…" | Tease the concept, don't announce the chapter |
