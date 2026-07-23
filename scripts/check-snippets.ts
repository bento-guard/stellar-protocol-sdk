import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as ts from 'typescript';

const REPO_ROOT = process.cwd();
const DOCS_DIR = join(REPO_ROOT, 'docs');

function getMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function extractSnippets(content: string): string[] {
  const snippets: string[] = [];
  const regex = /```(?:typescript|ts)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    snippets.push(match[1]);
  }
  return snippets;
}

function checkSyntax(code: string, fileName: string): number {
  let errorCount = 0;
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.Latest,
    true
  );

  const diagnostics = (sourceFile as any).parseDiagnostics as ts.Diagnostic[];
  
  if (diagnostics && diagnostics.length > 0) {
    for (const diagnostic of diagnostics) {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        console.error(`${fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.error(`${fileName}: ${message}`);
      }
      errorCount++;
    }
  }
  return errorCount;
}

function main() {
  console.log('Checking TypeScript snippets in Markdown files...');
  
  const files = getMarkdownFiles(DOCS_DIR);
  let totalSnippets = 0;
  let totalErrors = 0;

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const snippets = extractSnippets(content);
    
    for (let i = 0; i < snippets.length; i++) {
      totalSnippets++;
      const snippetName = `${file} [Snippet #${i + 1}]`;
      totalErrors += checkSyntax(snippets[i], snippetName);
    }
  }

  if (totalErrors > 0) {
    console.error(`\n❌ Failed: Found ${totalErrors} syntax errors in docs snippets.`);
    process.exit(1);
  } else {
    console.log(`\n✅ Success: Checked ${totalSnippets} snippets with 0 syntax errors.`);
  }
}

main();
