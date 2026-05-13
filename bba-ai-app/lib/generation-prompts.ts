import path from 'path';
import fs from 'fs';
import type { ParsedModule, ArtifactType } from './types';

const BBA_AI_ROOT = path.join(process.cwd(), '..', 'bba-ai');

function readPrompt(filename: string): string {
  const filePath = path.join(BBA_AI_ROOT, 'prompts', filename);
  return fs.readFileSync(filePath, 'utf-8');
}

export function formatTopicBlock(module: ParsedModule): string {
  const topics = module.topics.length > 0
    ? module.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')
    : '(Topics to be determined)';

  const tools = module.tools.length > 0
    ? module.tools.join(', ')
    : '(Tools to be determined)';

  const outcomes = module.learningOutcomes && module.learningOutcomes.length > 0
    ? module.learningOutcomes.map(lo => `- ${lo}`).join('\n')
    : '- LO1 (Remember): Recall core concepts from this module\n- LO2 (Understand): Explain frameworks and their applications\n- LO3 (Apply): Apply frameworks to real business scenarios\n- LO4 (Analyse): Diagnose problems and recommend solutions';

  return `**Semester**: ${module.semester}
**Module**: ${module.module}
**Title**: ${module.title}
**Contact Hours**: ${module.hours}
**Session Structure**: 5 sessions × 2 hours

**Chapter Topics**:
${topics}

**AI Tools Featured**: ${tools}

${module.indianCaseStudy ? `**Indian Case Study**: ${module.indianCaseStudy}` : ''}
${module.globalCaseStudy ? `**Global Case Study**: ${module.globalCaseStudy}` : ''}

**Learning Outcomes**:
${outcomes}`;
}

export function buildPrompt(artifactType: ArtifactType, module: ParsedModule): string {
  const topicBlock = formatTopicBlock(module);

  let template: string;
  if (artifactType === 'notes') {
    template = readPrompt('generate-notes.md');
    // Strip the file header (everything before the first ---)
    const dividerIdx = template.indexOf('\n---\n');
    const body = dividerIdx !== -1 ? template.slice(dividerIdx + 5) : template;
    return body.replace('{TOPIC_BLOCK}', topicBlock);
  }

  if (artifactType === 'workbook') {
    template = readPrompt('generate-workbook.md');
    const dividerIdx = template.indexOf('\n---\n');
    const body = dividerIdx !== -1 ? template.slice(dividerIdx + 5) : template;
    return body
      .replace('{TOPIC_BLOCK}', topicBlock)
      .replace('{PASTE_NOTES_HERE}', '(Notes not yet generated — derive everything directly from the topic block and your knowledge of the Campus AI style.)');
  }

  if (artifactType === 'pptx') {
    template = readPrompt('generate-pptx-outline.md');
    const dividerIdx = template.indexOf('\n---\n');
    const body = dividerIdx !== -1 ? template.slice(dividerIdx + 5) : template;
    return body
      .replace('{TOPIC_BLOCK}', topicBlock)
      .replace('{PASTE_NOTES_HERE}', '(Notes not yet generated — derive everything directly from the topic block and your knowledge of the Campus AI style.)');
  }

  throw new Error(`Unknown artifact type: ${artifactType}`);
}
