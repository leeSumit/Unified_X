# Notes Voice & Style Guide

This document captures the exact writing rules for the Campus AI BBA notes. Every note generated for any module must follow these rules to maintain the consistent voice students expect.

---

## Core Voice Principle: Teacher-Voice

The notes are written as if a faculty member is **speaking directly to a first-year BBA student sitting in front of them**. This is not an academic paper. It is not a textbook summary. It is a senior mentor explaining something for the first time, with full awareness that the student has no background.

**Test every sentence with this question:** *Would a confident, caring professor say this sentence out loud in a classroom?* If the answer is no, rewrite it.

---

## The Double-Explanation Rule

Every concept is explained **twice**:

1. **First pass — everyday analogy**: A simple metaphor or comparison from ordinary life (cooking, cricket, Bollywood, arranging a wedding, running a chai stall, ordering on Swiggy)
2. **Second pass — business-world example**: A specific named company, ideally Indian, using this concept today

**Example of the rule in action (from Module 1 Chapter 2):**

> Imagine hiring a brilliant freelancer who forgets everything between meetings. They are capable of excellent work, but you must brief them fully every time. They do not know your company, your customer, or yesterday's decision. This is not a limitation to work around — it is the frame that makes every prompt engineering rule make sense.
>
> Freshworks discovered this the hard way when building Freddy AI...

---

## India-First Example Priority

When choosing companies and scenarios, follow this hierarchy:

1. **Primary**: Indian companies students will recognise and aspire to join
   - Freshworks, Zoho, Razorpay, PhonePe, Swiggy, Zomato, Byju's, Jio, TCS, Infosys, Wipro, Dunzo, Meesho, Ola, HDFC Bank, Zerodha
2. **Secondary**: Global companies with significant India presence or relevance
   - Morgan Stanley (large India teams), Klarna (direct AI lesson), Duolingo (EdTech parallel), Harvey AI, OpenAI
3. **Scenario defaults**: When inventing examples, default to Indian context
   - Cities: Bengaluru, Mumbai, Delhi, Chennai, Pune, Hyderabad, Jaipur, Indore
   - Currencies: Rs. / ₹ (not $)
   - Business sizes: Tier-2/Tier-3 markets, ₹5–50 Cr ARR startups, 700-employee companies

---

## Structural Pattern Per Chapter

Each chapter follows this exact flow:

```
1. CHAPTER HEADLINE
   One-sentence provocative statement that reframes how the reader 
   thinks about the topic (not a definition)

2. OPENING NARRATIVE (300–500 words)
   A story: historical event, company anecdote, or surprising fact
   that explains WHY this topic exists. Creates the "why should I care"
   before any framework is introduced.

3. CONCEPTUAL EXPLANATION (400–600 words)
   The actual theory/framework, explained in teacher-voice.
   Uses the Double-Explanation Rule throughout.

4. DEEPER MECHANICS (300–500 words)
   The nuances, edge cases, common mistakes.
   Honest about limitations.

5. BUSINESS APPLICATION (400–600 words)
   One or two specific companies using this TODAY.
   Concrete numbers, real outcomes, specific quotes where available.

6. PURPLE CALLOUT BOX
   2–3 bullet points: "The most important things to remember"
   These are the flashcard sentences for exam prep.

7. WEAK vs STRONG COMPARISON (when applicable)
   Red side: the amateur version
   Green side: the professional version
   Brief explanation of what changed and why

8. CHAPTER CLOSE
   1 paragraph connecting this chapter to the next.
   Creates a sense of journey through the notes.
```

---

## Tone Rules

| Rule | Correct | Wrong |
|------|---------|-------|
| Sentence length | Varied — short punches followed by longer explanations | All long or all short |
| First person | "you will", "you can", "your prompt" — direct address | "students should", "one must" |
| Jargon | Introduced with plain-English definition in same sentence | Jargon without explanation |
| Numbers | Specific and cited ("173,000 citations", "100 million users in two months") | Vague ("many citations", "huge growth") |
| Analogies | Concrete, everyday, India-recognisable | Abstract or Western-only |
| Hedging | "In most cases...", "The research suggests..." | "Always", "Never" (unless truly absolute) |
| Excitement | Implied through strong verbs and concrete outcomes | Exclamation marks, "Amazing!", "Revolutionary!" |

---

## Career Anchor Rule

Every chapter should include **at least one salary/career relevance anchor**. This keeps BBA students engaged by connecting theory to job market reality.

Examples from Module 1:
- "Entry-level prompt engineers in India earn ₹5–10 lakhs per annum. These are not speculative numbers — they are from Glassdoor, Naukri, and LinkedIn listings as of early 2026."
- "When you graduate and attend your first interview, you will not just recite definitions. You will tell stories."
- "Andrej Karpathy, former Director of AI at Tesla, captured the moment: 'The hottest new programming language is English.'"

---

## Quotation Style

Real quotes from real people should be:
- In **italics**
- Indented with a left border
- Attributed with full name, title, and context

```
"The hottest new programming language is English."
— Andrej Karpathy, former Director of AI at Tesla, 2023
```

Academic citations follow this format:
- "Vaswani et al. (2017) showed that..."
- "(Brown et al., 2020, 31 co-authors)"

---

## What to Avoid

- **Textbook language**: "In this chapter, we will explore...", "As previously discussed..."
- **Passive voice overuse**: Prefer "Freshworks built" over "was built by Freshworks"
- **Missing stakes**: Every concept needs a real-world consequence. Why does it matter if you get this wrong?
- **Generic examples**: "A company" or "a startup" — always name the company
- **Western defaults**: Pricing in USD only, examples only from Silicon Valley
- **Overpromising**: Never claim AI is perfect or that a framework always works

---

## Chapter Length Guide

| Chapter type | Target word count |
|-------------|------------------|
| Foundational/History chapter | 1,800–2,200 words |
| Framework chapter (RACE, AIDA, etc.) | 1,200–1,600 words |
| Technical chapter (tokens, context windows) | 1,000–1,400 words |
| Ethics/Governance chapter | 1,000–1,400 words |
| Case study chapter | 1,200–1,800 words |

Total notes per 12-hour module: **~14,000–18,000 words** across 10–12 chapters.
