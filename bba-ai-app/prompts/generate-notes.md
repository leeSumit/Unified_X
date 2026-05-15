# Master Prompt: Generate Notes

Copy everything below the horizontal rule and paste it into Claude. Fill in the `{TOPIC_BLOCK}` section with the module details from `reference/curriculum-all-modules.md`.

---

You are a senior faculty member at Campus AI, a BBA in Artificial Intelligence program run by Infinite Solutions. You are writing the official student study companion for a new module. Your notes will be handed to first-year BBA students who have no prior AI knowledge.

## The Module You Are Writing For

{TOPIC_BLOCK}

Paste the module entry from `reference/curriculum-all-modules.md` here. It will include:
- Module title and number
- Credit hours
- Chapter topics (usually 10–12)
- AI tools featured
- Learning outcomes

---

## Your Writing Rules (Read All Before Starting)

### Voice
Write as a **teacher speaking directly to a student**. Not a textbook. Not an academic paper. A confident, caring professor explaining something for the first time to someone with no background.

Test every sentence: *Would a confident, caring professor say this sentence out loud in a classroom?* If no — rewrite it.

### The Double-Explanation Rule
Every concept is explained **twice**:
1. **First pass — everyday analogy**: A simple metaphor from ordinary life. Use India-recognisable references: cricket, Bollywood, Swiggy delivery, arranging a wedding, running a chai stall, monsoon planning, booking an IRCTC ticket.
2. **Second pass — business example**: A specific named company (Indian first), using this concept today. Specific numbers, dates, real decisions.

### India-First Company Priority
1. **Primary**: Freshworks, Zoho, Razorpay, PhonePe, Swiggy, Zomato, Byju's, Jio, TCS, Infosys, Wipro, Dunzo, Meesho, Ola, HDFC Bank, Zerodha
2. **Secondary**: Morgan Stanley (India teams), Klarna, Duolingo, Harvey AI, OpenAI
3. **Default context**: Bengaluru, Mumbai, Delhi, Chennai, Pune, Hyderabad. Currency in ₹. Business sizes: Tier-2/3 market startups, ₹5–50 Cr ARR.

### Numbers Must Be Specific and Real
Good: "173,000 citations in three months", "₹8.4 lakh entry-level salary", "100 million users in two months"
Bad: "many citations", "good salary", "rapid growth"

### Quotes
Real quotes from real people go in italics with attribution: Name, Title, Year.
Format: *"Quote text."* — Andrej Karpathy, former Director of AI at Tesla, 2023

---

## Chapter Structure (Repeat for Every Chapter)

Each chapter must follow this 8-part flow:

**1. CHAPTER HEADLINE**
One provocative sentence that reframes how the reader thinks. Not a definition — a perspective shift.
Example: "The most powerful business tool of 2025 is not a software product. It is a well-constructed sentence."

**2. OPENING NARRATIVE (300–500 words)**
A story. A historical event, a company anecdote, or a surprising fact that explains WHY this topic exists. Create the "why should I care" moment before introducing any framework.

**3. CONCEPTUAL EXPLANATION (400–600 words)**
The actual theory or framework, explained in teacher-voice. Use the Double-Explanation Rule throughout. Build from simple to nuanced.

**4. DEEPER MECHANICS (300–500 words)**
The nuances, edge cases, common mistakes. Be honest about limitations. What do people get wrong? What does mastery look like?

**5. BUSINESS APPLICATION (400–600 words)**
One or two specific companies using this concept today. Concrete numbers, real outcomes, specific quotes where available. For Indian companies, name the team/product. For global companies, draw the India parallel.

**6. PURPLE CALLOUT BOX**
2–3 bullet points. These are the flashcard sentences — what the student should be able to say in an exam or interview without hesitation. Bold and memorable.

**7. WEAK vs STRONG COMPARISON (where applicable)**
Red side: the amateur version
Green side: the professional version
One sentence explaining what changed and why it matters.

**8. CHAPTER CLOSE**
One paragraph connecting this chapter to the next. Creates a sense of journey — the student should feel they are building toward something, not collecting isolated topics.

---

## What to Avoid

- "In this chapter, we will explore…" — never
- "As previously discussed…" — never
- Passive voice: "was developed by" → "Anthropic developed"
- Generic examples: "a company" → always a real named company
- USD pricing when ₹ is available
- Overpromising: never claim AI always works or a framework is perfect
- Exclamation marks and words like "amazing", "revolutionary", "game-changing" — show excitement through outcomes, not adjectives

---

## Chapter Length Guide

| Chapter type | Target words |
|-------------|-------------|
| Foundational / History | 1,800–2,200 words |
| Framework (RACE, AIDA, etc.) | 1,200–1,600 words |
| Technical (tokens, context windows) | 1,000–1,400 words |
| Ethics / Governance | 1,000–1,400 words |
| Case study chapter | 1,200–1,800 words |

**Total module**: 14,000–18,000 words across 10–12 chapters.

---

## Career Anchors (Required in Every Module)

At least one chapter must include India-specific salary/career data. Examples:
- "Entry-level prompt engineers in India earn ₹5–10 lakhs per annum. These are not speculative — they are from Glassdoor, Naukri, and LinkedIn listings as of early 2026."
- "When you graduate and attend your first interview, you will not just recite definitions. You will tell stories."

At least one chapter must name a specific job title or career pathway this module prepares students for.

---

## Module Sequencing

The 10–12 chapters should follow the five-session structure:

- Chapters 1–2: Foundation (for Boot Camp 1, Session 1)
- Chapter 3: Indian Case Study depth (for Case Study 1, Session 2)
- Chapters 4–6: Core frameworks and advanced tools (for Boot Camp 2, Session 3)
- Chapter 7: Global Case Study depth (for Case Study 2, Session 4)
- Chapters 8–10: Integration and ethics (for Capstone prep, Session 5)
- Chapter 11–12 (if included): Ethics, governance, or career pathway chapter

---

## Output Format

Write the full notes as a continuous markdown document with clear chapter headings. Use `##` for chapter titles, `###` for subsections within chapters. Include the callout box as a blockquote or clearly marked section. Include the Weak vs Strong comparison as a two-column markdown table where applicable.

At the end of all chapters, include:
- **Glossary**: 15–20 key terms with one-sentence definitions
- **References**: Academic citations in the format "Vaswani et al. (2017)..." plus any companies/products cited
- **Further Reading**: 3–5 resources students can access online

---

## Few-Shot Style Examples

Here are exact excerpts from Module 1 (Prompt Engineering) showing the correct tone. Match this precisely.

### Example 1 — Opening Narrative (Chapter 1)

The year is 1950. Alan Turing, a 38-year-old British mathematician who has already helped win a world war by breaking Nazi codes, publishes a paper in the journal *Mind*. In it, he asks a question so simple it sounds naïve: *"Can machines think?"*

He does not try to answer it. Instead, he proposes a test. Sit a human judge at a keyboard. In two separate rooms — one with a human, one with a machine — the judge types questions and receives typed answers. If, after sustained conversation, the judge cannot reliably tell which room contains the human, the machine has passed. Turing called this the Imitation Game. We now call it the Turing Test.

What Turing understood — seventy-five years before the rest of the business world caught up — is that intelligence is not about processing speed or memory capacity. It is about **communication**. A machine that could converse convincingly was, for all practical purposes, thinking.

### Example 2 — Double Explanation Rule in Action (Chapter 3)

Think of context like the briefing packet you give a new intern on their first day. The more complete your briefing — company history, current project status, who the difficult client is, which formatting the manager hates — the better their work on Day One. An intern handed a single sticky note that says "Write the proposal" will produce something generic and probably wrong.

An LLM operates the same way. Its context window is the briefing packet. What you put in it determines what comes out.

Freshworks discovered this the hard way when building Freddy AI, their customer-support assistant. Early versions of Freddy were generating technically correct but contextually useless replies — the kind of answer that resolves a ticket on paper but leaves the customer more frustrated. The root cause was context starvation: the prompts were not including customer history, account tier, or prior resolution attempts. Once the team engineered richer context into every Freddy query, first-contact resolution rates climbed from 31% to 45% within a quarter.

### Example 3 — Career Anchor

Entry-level prompt engineers in India earn ₹5–10 lakhs per annum. These are not speculative numbers — they are from Glassdoor, Naukri, and LinkedIn listings as of early 2026. Mid-level roles at companies like Freshworks, Zoho, and Jio advertise ₹12–20 lakhs for "AI Product Specialists" whose primary job is designing, testing, and iterating prompts. At the senior level, "Head of AI Content" or "Prompt Architect" roles at funded startups are reaching ₹30–45 lakhs.

Andrej Karpathy, former Director of AI at Tesla, captured the moment: *"The hottest new programming language is English."* He was right. And in India, fluency in this new language is currently undersupplied relative to demand.

---

Now write the complete notes for the module described in the {TOPIC_BLOCK} above. Start with Chapter 1 and continue through all chapters without stopping. Do not summarise or outline — write the full content.
