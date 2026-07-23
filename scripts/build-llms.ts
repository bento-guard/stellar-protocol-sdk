import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = process.cwd();
const DOCS_DIR = join(REPO_ROOT, 'docs');
const LLMS_OUT = join(REPO_ROOT, 'llms.txt');
const LLMS_FULL_OUT = join(REPO_ROOT, 'llms-full.txt');
const CHANGELOG_PATH = join(REPO_ROOT, 'CHANGELOG.md');

function parseFrontmatter(content: string): { fm: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { fm: {}, body: content };

  const fm: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      fm[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
    }
  });
  return { fm, body: match[2].trim() };
}

interface DocPage {
  path: string;
  url: string;
  title: string;
  description: string;
  body: string;
}

function readDoc(relPath: string): DocPage {
  const fullPath = join(DOCS_DIR, relPath);
  const content = readFileSync(fullPath, 'utf8');
  const { fm, body } = parseFrontmatter(content);
  return {
    path: `docs/${relPath}`,
    url: `/docs/${relPath}`,
    title: fm.title || relPath,
    description: fm.description || '',
    body,
  };
}

function main() {
  console.log('Building llms.txt and llms-full.txt bundles...');

  const indexPage = readDoc('index.md');
  const agentsPage = readDoc('agents.md');
  
  const guideFiles = readdirSync(join(DOCS_DIR, 'guides')).filter(f => f.endsWith('.md')).sort();
  const guides = guideFiles.map(f => readDoc(`guides/${f}`));

  let referenceFiles: string[] = [];
  try {
    referenceFiles = readdirSync(join(DOCS_DIR, 'reference')).filter(f => f.endsWith('.md')).sort();
  } catch (e) {
    // Ignore if reference dir doesn't exist
  }
  const references = referenceFiles.map(f => readDoc(`reference/${f}`));

  // Generate llms.txt
  const llmsTxtLines = [
    '# Bento Stellar SDK',
    '> ' + indexPage.description,
    '',
    '## Guides',
    ...guides.map(g => `- [${g.title}](${g.url}): ${g.description}`),
    '',
    '## Reference',
    ...references.map(r => `- [${r.title}](${r.url}): ${r.description}`),
    '',
    '## Other',
    `- [${agentsPage.title}](${agentsPage.url}): ${agentsPage.description}`,
    '- [Full bundle](/llms-full.txt): All guide and reference content, in one file.'
  ];
  
  writeFileSync(LLMS_OUT, llmsTxtLines.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${LLMS_OUT}`);

  // Generate llms-full.txt
  let changelog = '';
  try {
      changelog = readFileSync(CHANGELOG_PATH, 'utf8');
  } catch (e) {
      changelog = 'No CHANGELOG available yet.';
  }

  const llmsFullTxtSections = [
    `# Source: ${indexPage.path}\n\n${indexPage.body}`,
    ...guides.map(g => `# Source: ${g.path}\n\n${g.body}`),
    ...references.map(r => `# Source: ${r.path}\n\n${r.body}`),
    `# Source: ${agentsPage.path}\n\n${agentsPage.body}`,
    `# Source: CHANGELOG.md\n\n${changelog}`
  ];

  writeFileSync(LLMS_FULL_OUT, llmsFullTxtSections.join('\n\n') + '\n', 'utf8');
  console.log(`Wrote ${LLMS_FULL_OUT}`);
}

main();
