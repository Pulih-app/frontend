const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Replace option buttons with Button variant="custom"
  content = content.replace(
    /<button\s+key={option}\s+onClick=\{\(\) => setSelected\(option\)\}\s+className=\{([^}]+)\}\s*>\s*\{option\}\s*<\/button>/g,
    '<Button variant="custom" key={option} onClick={() => setSelected(option)} className={$1}>\n            {option}\n          </Button>'
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated', filePath);
  }
}

const glob = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') && file.includes('question-')) results.push(file);
    }
  });
  return results;
}

const files = walk('app/onboarding');
files.forEach(processFile);
