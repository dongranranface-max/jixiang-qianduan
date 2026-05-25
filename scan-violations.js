const fs = require('fs');
const path = require('path');

const pagesDir = 'src/pages';
const violations = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith('.vue')) {
      const content = fs.readFileSync(full, 'utf8');
      const rel = path.relative('src/pages', full);
      const consoleMatches = (content.match(/console\.log\(/g) || []).length;
      const anyMatches = (content.match(/:\s*any\b/g) || []).length;
      const placeholder = (content.match(/\/\/\s*(TODO|FIXME|HACK|XXX)/gi) || []).length;
      if (consoleMatches || anyMatches || placeholder) {
        violations.push({ file: rel, console: consoleMatches, any: anyMatches, placeholder });
      }
    }
  }
}

scanDir(pagesDir);

if (violations.length === 0) {
  console.log('CLEAN');
} else {
  violations.forEach(v => {
    console.log(v.file + ' | console.log:' + v.console + ' | any:' + v.any + ' | placeholder:' + v.placeholder);
  });
}