const fs = require('fs');
const content = fs.readFileSync('/Users/apple/Documents/ai - projects/star-health-web/src/components/AdminPortal.tsx', 'utf8');
const lines = content.split('\n');

let openTags = 0;
let tabLines = [];

for (let i = 1307; i < 1600; i++) {
  const line = lines[i];
  if (!line) continue;
  
  // Find all <tag and </tag
  const matches = line.match(/<\/?([a-zA-Z0-9_-]+)/g) || [];
  for (const match of matches) {
    if (match.startsWith('</')) {
      openTags--;
      tabLines.push({ line: i + 1, change: -1, tag: match, text: line.trim() });
    } else if (!match.startsWith('</') && !line.includes(match + ' ') && !line.includes(match + '>') && !match.endsWith('input') && !match.endsWith('audio') && !match.endsWith('textarea')) {
      // ignore self closing or simple tags if needed, but let's just log everything
      openTags++;
      tabLines.push({ line: i + 1, change: 1, tag: match, text: line.trim() });
    }
  }
}

console.log("Tag trace:");
let depth = 0;
for (const entry of tabLines) {
  depth += entry.change;
  console.log(`${entry.line}: ${entry.change > 0 ? 'OPEN' : 'CLOSE'} ${entry.tag} (depth: ${depth}) -> ${entry.text}`);
}
console.log("Final depth:", depth);
