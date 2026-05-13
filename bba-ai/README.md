# BBA AI Content Generation System

This system lets you generate new module content (Notes, Workbook, PPTX outline) that matches the exact tone, structure, and quality of the existing Module 1 materials.

## How it works

```
Curriculum topic input
        │
        ▼
┌───────────────────┐
│  Claude Prompt    │  ← uses style-guide/ + reference/
│  (generate-notes) │
└────────┬──────────┘
         │
    Notes.docx (same teacher-voice, India-first, story-driven)
         │
         ├──────────────────────────────────────────────┐
         ▼                                              ▼
┌─────────────────────┐                    ┌──────────────────────┐
│ generate-workbook   │                    │ generate-pptx-outline│
│ Claude prompt       │                    │ Claude prompt        │
└──────────┬──────────┘                    └──────────┬───────────┘
           │                                          │
    Workbook content.md                     PPTX slide outline.md
    (Boot Camps, Projects,                  (50-slide structure
     Case Studies, Capstone)                 for Kimi/Moonshot)
           │                                          │
           └──────────────┬───────────────────────────┘
                          ▼
                   open-design
              (final visual templates)
```

## Workflow to generate a new module

1. **Read the curriculum** — open `reference/curriculum-all-modules.md`, find your module
2. **Generate Notes** — copy `prompts/generate-notes.md`, fill in `{TOPIC_BLOCK}`, run in Claude
3. **Generate Workbook** — copy `prompts/generate-workbook.md`, paste your notes, run in Claude
4. **Generate PPTX outline** — copy `prompts/generate-pptx-outline.md`, paste your notes, run in Claude
5. **Build PPTX** — paste the outline into Kimi Moonshot (or similar AI slide tool)
6. **Design pass** — feed workbook content + PPTX into open-design for final templating

## File map

| File | Purpose |
|------|---------|
| `style-guide/notes-voice.md` | Exact writing rules for the notes |
| `style-guide/workbook-structure.md` | Workbook layout patterns with annotated examples |
| `style-guide/content-principles.md` | The pedagogical philosophy driving all content |
| `templates/notes-chapter.md` | Blank chapter template for notes |
| `templates/workbook-session.md` | Blank workbook session template |
| `templates/pptx-outline.md` | Blank slide outline template |
| `prompts/generate-notes.md` | Master Claude prompt for notes |
| `prompts/generate-workbook.md` | Master Claude prompt for workbook |
| `prompts/generate-pptx-outline.md` | Master Claude prompt for PPTX outline |
| `reference/module1-notes-style.md` | Annotated excerpts showing notes style |
| `reference/module1-workbook-breakdown.md` | Module 1 workbook fully annotated |
| `reference/curriculum-all-modules.md` | Full 6-semester curriculum reference |

## Quality bar

Generated content should match these Module 1 benchmarks:
- Notes: ~12,000–16,000 words per module, 10–12 chapters
- Workbook: ~35 pages, 5 sessions, 2 Boot Camps + 2 Projects + 2 Case Studies + Capstone
- PPTX: ~50 slides, one major topic per slide cluster
