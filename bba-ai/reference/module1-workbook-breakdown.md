# Module 1 Workbook — Annotated Breakdown

This document analyses the Module 1 workbook page by page, explaining the design decisions behind each section. Use this when generating workbook content for new modules — every structural choice here should be replicated.

---

## Cover Page

**Visual**: Abstract purple/lavender geometric illustration (circles, lines, hexagons) fills the right two-thirds of the page. Campus AI logo top-left. Dark purple band across bottom.

**Text hierarchy**:
- Eyebrow: "A student guide to" (small, regular weight)
- Headline: "**mastering Prompt Engineering with Campus AI**" (large, "mastering" and "Campus AI" in bold purple)
- Subtitle: "STUDENT WORKBOOK" (all caps, spaced, smaller)
- Footer strip: "BBA in Artificial Intelligence · Semester 1 · Module 1 · Prompt Engineering & Content Creation · 12 Contact Hours · Infinite Solutions"

**Why this works**: The illustration creates prestige — this feels like a premium product, not a photocopied worksheet. The bold on "mastering" is intentional: students are buying mastery, not just information.

---

## Ownership Page

```
Student Name: _________________________________
Enrollment No.: _______________________________
Section / Batch: ______________________________
Faculty: ______________________________________
Academic Year: ________________________________
```

**HOW TO USE THIS WORKBOOK** (numbered, in a tinted box):
1. Bring this workbook to every session of Module 1. It is your primary in-class tool.
2. Complete all response boxes during class — do not leave them for later. The thinking happens in the room.
3. The Boot Camp pages are reference material you will return to. Annotate them freely.
4. Case Study discussion questions are not meant to have "correct" answers. Push your thinking.
5. The Capstone is graded. Every other page is for your learning.

**Why this works**: The HOW TO USE box pre-empts the most common student mistake (treating the workbook as a take-home assignment). Instruction #5 is psychologically important — it removes anxiety from the exploratory sections.

---

## Index Page (Page 1)

**Title**: "Your 10-hour journey through Module 1"
**Subtitle**: *"Every page in this workbook maps to one of the five classroom sessions."*

**Session Map** (5 columns, colour-coded):

| SESSION 1 | SESSION 2 | SESSION 3 | SESSION 4 | SESSION 5 |
|-----------|-----------|-----------|-----------|-----------|
| Boot Camp 1 | Project 1 + Case Study 1 | Boot Camp 2 | Project 2 + Case Study 2 | Capstone |
| Pages 4–9 | Pages 10–18 | Pages 19–24 | Pages 25–33 | Pages 34–43 |

**Full Table of Contents** (two columns, purple page numbers):
- Introduction ............... 2
- Pedagogy ................... 3
- Boot Camp 1: Foundations .... 4
- Project 1: The Prompt Sprint .. 10
- [etc.]

**Why this works**: Students can orient themselves before each session by checking the Index. The page ranges mean a student who missed a session can catch up precisely. The colour coding matches the chip colours used throughout — visual continuity.

---

## Introduction Page (Page 2)

**Chip**: "INTRODUCTION" (dark navy background, white text)

**Title**: "Module 1 — Prompt Engineering & Content Creation"
**Subtitle**: *"12 hours · Five sessions · One professional skill you will carry for a career."*

**Opening paragraph**:
"Every business conversation with an AI system begins with a prompt. You are already doing this informally — typing requests into ChatGPT, asking Gemini for help with a document. This module teaches you to do it with craft, precision, and professional intent."

**Left column — Learning Outcomes**:
- LO1 (Remember): Recall the 6 core prompt engineering frameworks and their components
- LO2 (Understand): Explain how context windows and token limits shape prompt design
- LO3 (Apply): Apply RACE and AIDA to real business prompting scenarios
- LO4 (Analyse): Diagnose and fix broken prompts using the 9-mode failure taxonomy

**Right column — Course Outcomes**:
- CO1: A toolkit of 6 frameworks you can deploy in any professional context
- CO2: The ability to diagnose why an AI output failed and fix it in under 3 minutes
- CO3: Hands-on experience with 4 leading AI tools used in Indian businesses
- CO4: A portfolio entry — a complete AI-assisted project from brief to output

**Left column — Before you begin**:
- ☐ Laptop or tablet with internet access
- ☐ ChatGPT account (free tier is fine) or Claude account
- ☐ Read the one-page brief on Freshworks in the Case Study section before Session 2

**Right column — AI tools used**:
- **ChatGPT (OpenAI)**: General-purpose prompting, long-form content generation
- **Claude (Anthropic)**: Analysis, nuanced writing, document Q&A
- **Gemini (Google)**: Research, Workspace integration
- **Jasper AI**: Marketing-specific content, brand voice

**Why this works**: LOs use Bloom's taxonomy verbs explicitly — this is not an accident. It signals to students that the learning progression is intentional. CO4 (portfolio entry) directly addresses the career-conscious student's primary question: "What do I get from this?"

---

## Pedagogy Page (Page 3)

**Chip**: "OUR TEACHING PHILOSOPHY" (dark navy)

**Title**: "The Campus AI Pedagogy"
**Subtitle**: *"Why your classroom time is structured the way it is."*

**Opening**: "Most BBA programmes teach frameworks in theory and hope students figure out the application. Campus AI does the opposite: we put you inside a real business problem before we hand you the framework. You discover why the framework exists by experiencing the problem it solves."

**3-Column Grid**:

1. **Design Thinking** (IDEO / Stanford d.school)
   "In this module: every project and capstone follows the five design thinking stages — Empathise, Define, Ideate, Prototype, Test. You are not completing assignments. You are running a consulting sprint."

2. **Experiential Learning** (Kolb's cycle, 1984)
   "We open every Boot Camp with the problem before the solution. You will feel stuck before you feel capable. That discomfort is the learning — it is where new knowledge sticks."

3. **Industry-First Content** (No framework without a company)
   "Three companies appear throughout this module: **Freshworks** (Indian, SaaS, CX AI), **Klarna** (global, fintech, customer service AI), **Bharat Bazaar** (fictional, e-commerce — your Capstone client). Every framework we teach, these companies use."

**"The big picture" callout box**:
"Prompt engineering is a leverage skill. One person who prompts well outperforms a team that prompts poorly. The highest-paid professionals in your graduating cohort will not be those who know the most — they will be those who can communicate most precisely with AI. That is what this module builds."

**Why this works**: The three-column pedagogy grid is not decoration — it is a promise to students about how class will feel. "You will feel stuck before you feel capable" is honest in a way that builds trust. The callout box reframes the module from a course requirement to a career investment.

---

## Boot Camp 1 (Pages 4–9)

**Opening spread — Page 4**:
Chip: "BOOT CAMP 1" (filled purple)
Title: "The Foundations of Effective Prompting"
Subtitle: *"Session 1 · Two hours · Context, RACE, AIDA."*

**Introduction** (2 paragraphs):
Para 1: The "why this matters" paragraph — what happens to businesses that prompt poorly
Para 2: The session plan — what three things students will be able to do by the end of two hours

**Framework Cards**:

*Card 1: The Anatomy of a Prompt*
- **COMPONENTS**: Context · Task · Format · Constraints
- **WHEN TO USE**: Every prompt, always. This is not a framework — it is the baseline.
- **MINI EXAMPLE**:
```
CONTEXT: You are a customer service agent at Swiggy. A customer
has received the wrong order and is upset.
TASK: Write a de-escalation response that offers a replacement
order and a ₹100 coupon.
FORMAT: 3 sentences, maximum.
CONSTRAINTS: Do not mention "processing time". Do not promise
delivery in under 30 minutes.
```

*Card 2: The RACE Framework*
- **COMPONENTS**: Role · Action · Context · Execute
- **WHEN TO USE**: When your output needs to sound like it came from a specific professional role or expertise level
- **MINI EXAMPLE**:
```
ROLE: Senior content strategist, 7 years in Indian edtech
ACTION: Write a LinkedIn post announcing a new AI course
CONTEXT: Audience = edtech founders; tone = authoritative but
approachable; goal = 50+ comments
EXECUTE: [the prompt now runs]
```

**Page 5 — Boot Camp 1 Continued**:

*Card 3: The AIDA Framework*
- **COMPONENTS**: Attention · Interest · Desire · Action
- **WHEN TO USE**: Marketing copy, sales emails, product announcements — any content designed to move a reader from awareness to action
- **MINI EXAMPLE**: (email subject lines + body structure example)

*Card 4: Context Windows and Token Limits*
- **COMPONENTS**: Input tokens · Output tokens · Total context window
- **WHEN TO USE**: When working on long documents, multi-turn conversations, or batch processing
- **MINI EXAMPLE**: Token counter comparison (short vs long prompt)

**"Reflect before you leave class" prompt**:
"Describe one moment today where you felt like you understood something you hadn't before. What made it click?"
[Large response box]

---

## Project 1: The Prompt Sprint (Pages 10–13)

**Opening Page (Page 10)**:
Chip: "PROJECT 1" (orange)
Title: "The Prompt Sprint"
Subtitle: *"Session 2 · 60 minutes in class · Analyse, build, and compare prompts for a real business brief."*

**Briefing** (2 paragraphs):
Para 1: Why you can't just learn frameworks in theory — you have to run them under time pressure
Para 2: What "real business brief" means — the difference between a classroom exercise and a professional scenario

**Left column**:
- **Your mission**: Choose one scenario from the list below. Design the best possible prompt using RACE or AIDA. Run it. Evaluate the output. Improve it.
- **Concepts applied**: Prompt anatomy, RACE, AIDA, context window management
- **Deliverable**: 3 prompt iterations + written evaluation of each

**Right column — How to run it**:
1. Choose your scenario (5 minutes)
2. Write your first prompt using the framework of your choice (10 minutes)
3. Run it and document the output (5 minutes)
4. Identify what failed. Rewrite. Run again. (15 minutes)
5. Write your three insights — what changed between iteration 1 and iteration 3? (10 minutes)

**Scenarios list** (all India-context):
- You are a marketing intern at Zerodha. Write an Instagram caption for a new zero-commission trading feature targeting 25-year-olds in Bengaluru.
- You are a customer support team lead at Swiggy. Write a template response to "My order is 45 minutes late."
- You are an HR manager at a 200-person startup in Pune. Write a rejection email to a candidate that is warm, honest, and does not invite negotiation.
- You are a product manager at PhonePe. Write the push notification copy for a new UPI feature for Tier-3 merchants.
- You are a social media manager at Meesho. Write the caption for a Diwali sale post targeting first-time online shoppers in Tier-2 cities.

**Page 11 — Worksheet**:

| | Prompt 1 | Prompt 2 | Prompt 3 |
|---|---------|---------|---------|
| Framework used | | | |
| Word count | | | |
| Output quality (1–5) | | | |
| What I changed | | | |

"Your three insights" (3 response boxes, one per insight)

---

## Case Study 1: Freshworks (Pages 14–18)

**Opening (Page 14)**:
Chip: "CASE STUDY 1 · INDIA" (dark navy)
Title: "Freshworks' Freddy AI: Turning Customer Service into a Competitive Advantage"
Subtitle: *"How a Chennai-born SaaS company turned AI-powered support into a ₹700-crore revenue driver."*

**Hook paragraph**:
"In 2023, a customer service manager at a Mumbai-based logistics firm made a decision that saved his company ₹38 lakh per year. He did not hire fewer people. He did not cut support hours. He changed the prompts his team used to brief their AI system. The company was using Freshworks' Freddy AI. The difference was not the software — it was how the software was instructed."

**4-metric dashboard**:
- **$838.8M** — FY2025 Revenue
- **$25M+** — Freddy AI Annualised Revenue Run Rate
- **75,000+** — Customers across 120 countries
- **45%** — Customer queries resolved by AI (target: 60% by FY2026)

**"The company" section**:
Para 1: Origin story — Girish Mathrubootham founding in Chennai 2010, bootstrapped early years, why India building for the world matters
Para 2: Current scale — listed on NASDAQ 2021, enterprise pivot, Freddy AI as the growth engine

**Pages 15–16 — The AI Story**:

"The Transformation" section:
- How Freddy AI was built (named engineer/PM where available, timeline)
- The prompt engineering challenge: making a B2B support tool sound human at scale
- The specific decision that turned the numbers

"Results" table:
| Metric | Before Freddy AI | After Freddy AI |
|--------|-----------------|-----------------|
| First-contact resolution | 31% | 45% |
| Average handling time | [X minutes] | [X minutes] |
| CSAT score | [X] | [X] |

Real quote (italic, left-border):
*"We didn't build Freddy to replace support agents. We built Freddy to make support agents superhuman."*
— Girish Mathrubootham, CEO, Freshworks, 2023

"The Lesson" section:
- The India context: why Indian SaaS companies face unique CX challenges (language diversity, payment disputes, delivery density)
- How Freshworks' approach differs from Salesforce Einstein or Zendesk AI

**Page 17 — Discussion Questions**:
Q1 (Recall): "What was the specific bottleneck that Freddy AI was designed to address?"
[Response box]

Q2 (Analysis): "Why did improving the prompts — not the AI model itself — produce the performance gains? What does this tell you about the relationship between prompt quality and AI output quality?"
[Response box]

Q3 (Judgment): "If you were the Head of CX at Freshworks in 2022, what three constraints would you put on Freddy AI's responses before deploying to enterprise clients?"
[Response box]

Q4 (Personal stance): "A junior support agent at Freshworks is told their role will change significantly because of Freddy AI. How should the company handle this transition, and what does it mean for someone with your skills entering the workforce?"
[Response box]

---

## Boot Camp 2 (Pages 19–24) — Same Pattern as Boot Camp 1

Covers: Chain-of-Thought, Few-Shot/Zero-Shot, Role-Based, Meta-Prompting

Notable additions on Boot Camp 2:

**"Combining frameworks is where craft begins" (Page 23)**:
A visual diagram showing how RACE + Chain-of-Thought + Few-Shot can be layered into a single prompt. Three-layer diagram: RACE provides structure → CoT provides reasoning → Few-Shot provides tone calibration.

**Failure Taxonomy (Page 24 — full table)**:

| Mode | Symptom | Root Cause | Fix |
|------|---------|-----------|-----|
| Hallucination | Specific false facts stated with confidence | Training distribution interpolation | Verify all facts; use citation prompts |
| Tone mismatch | Output sounds too formal/informal for audience | Role not specified, or Role too generic | Strengthen Role component of RACE |
| Context loss | Multi-turn conversation loses coherence | Context window not managed | Summarise and re-inject context periodically |
| Escalation failure | AI attempts to resolve a case it shouldn't | No escalation trigger defined | Explicit "If X, stop and say Y" instructions |
| Brand voice drift | Output sounds generic, not on-brand | Brand voice not captured in prompt | Provide 3–5 example outputs as few-shot samples |
| Insufficient grounding | AI invents company-specific details | No company context provided | Front-load company brief in system prompt |
| Prompt injection | User input overrides your instructions | Inputs not sanitised | Wrap user inputs, never concatenate directly |
| Over-promising | AI commits to things outside its authority | No constraints on claims/commitments | Add explicit "Do not promise" constraints |
| Bias | Output reflects stereotypes | Training data bias | Test with diverse scenarios; flag for human review |

---

## Capstone: The Bharat Bazaar Brief (Pages 34–42)

**Chip**: "CAPSTONE" (teal/green)
**Title**: "The Bharat Bazaar Turnaround"
**Opening**: "For the next two hours you are not a student. You are an AI Strategy Consultant brought in to rescue a broken e-commerce business."

**The Scenario (3 paragraphs)**:
- Company: Bharat Bazaar — an e-commerce startup in Gurgaon, Haryana
- Scale: ₹22 Cr ARR, 700 employees, serves Tier-2 and Tier-3 markets across UP, Bihar, MP
- Problem: Their customer support chatbot is destroying CSAT. 40% of customers rate chatbot interactions 1 or 2 out of 5. Escalation to human agents has tripled in 6 months.
- Stakes: The board has given the AI team 90 days to fix this before outsourcing the entire support operation. The cost of outsourcing: 200 jobs.

**What you will deliver**:
"By the end of Session 5, your team will present a 5-minute briefing using an 8-slide turnaround deck. You will diagnose what is broken, design a fix, prototype the new prompts, and present a measurement plan."

**Diagnosis Page (Page 35)**:
Table of 8 broken chatbot transcripts — each labelled only by a case number. Students must identify which failure mode each represents before they can begin designing fixes.

| Case | Transcript excerpt | Your diagnosis |
|------|-------------------|----------------|
| 001 | "Your order #A4391 was delivered on October 3. Our records confirm this." [Order was not delivered] | |
| 002 | "As an AI, I cannot discuss compensation. Please hold for a human agent." [Escalation was available but AI did not use it] | |
| ... | | |

**5 Design Thinking Stage Pages (Pages 36–40)**:
Each page has a full-page response area with stage-specific prompts.

EMPATHISE: "You have interviewed 5 Bharat Bazaar customers who gave 1-star chatbot ratings. Write their perspective. What did they expect? What did they get? What does it feel like to be this customer?"

DEFINE: "Complete this statement: 'Bharat Bazaar's customers are experiencing _____ because _____. They need _____.' Now frame this as a 'How might we…' question that your team will spend the next stage answering."

IDEATE: "Generate 8 possible prompt fixes — at least one per failure mode you identified in the Diagnosis page. Do not evaluate yet. Just generate."

PROTOTYPE: "Choose 3 of your best ideas. Write the actual revised prompts. Run them with your AI tool. Paste the outputs here."

TEST: "Design a 30-day A/B test for your best prompt fix. What is the control? What is the variant? What metric are you measuring? What result would convince you it is working?"

**Turnaround Deck Structure (Page 41)**:

| Slide | Title | Purpose |
|-------|-------|---------|
| 1 | The Situation | Brief the audience: company, problem, stakes |
| 2 | The Diagnosis | Which failure modes did you find and how prevalent are each? |
| 3 | Root Cause Analysis | Why did these failures happen? Team, process, or prompt? |
| 4 | Our Solution | The revised prompt architecture |
| 5 | Evidence | Prototype outputs — before vs after |
| 6 | The Test Plan | How you will prove it works at scale |
| 7 | Risk Register | What could still go wrong |
| 8 | Ask | What you need from the board to execute |

**Evaluation Rubric (Page 41, continued)**:
| Criterion | Weight | What 5/5 looks like |
|-----------|--------|---------------------|
| Diagnosis accuracy | 20% | All failure modes correctly identified and labelled |
| Solution quality | 30% | Revised prompts directly address root causes; not generic improvements |
| Prototype evidence | 25% | Real AI output shown; before/after comparison is meaningful |
| Test plan rigour | 15% | Metric is measurable; control/variant are clearly defined |
| Presentation clarity | 10% | Deck is structured; argument is easy to follow |

---

## Key Design Lessons from Module 1

1. **The India context is not decoration**: Every scenario uses Indian companies, Indian cities, Indian currencies. Students should never feel like they are doing "Western" content with Indian stickers applied.

2. **The Capstone fictional company is grounded in reality**: Bharat Bazaar is fictional, but Gurgaon Tier-2/3 e-commerce is real. Students in Delhi/NCR will have family who shops this way. The stakes feel real.

3. **Discussion Questions Q4 is always personal**: Students deflect from personal stance questions when given the option. Q4 forces it. The response box is large enough to demand a full paragraph.

4. **Framework cards have a third section**: COMPONENTS and WHEN TO USE are standard. MINI EXAMPLE is the most important one — it shows the framework applied to an Indian business scenario, not an abstract "company X" example.

5. **The workbook is not a summary document**: Students should not be able to fill in the workbook from reading the notes. The workbook demands in-class experience and in-the-moment thinking. The notes explain. The workbook requires.
