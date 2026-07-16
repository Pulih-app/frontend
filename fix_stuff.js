const fs = require('fs');

const translateMap = {
  "Diumur berapa kamu menonton pornografi untuk pertama kalinya?": "At what age did you watch pornography for the first time?",
  "12 tahun atau lebih muda": "12 years old or younger",
  "13 sampai 16 tahun": "13 to 16 years old",
  "17 sampai 24 tahun": "17 to 24 years old",
  "25 tahun atau lebih tua": "25 years old or older"
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix translations
  for (const [id, en] of Object.entries(translateMap)) {
    content = content.replace(new RegExp(id, 'g'), en);
  }

  // Change <button key={option} ... > to <Button variant="custom" key={option} ... >
  content = content.replace(
    /<button([\s\S]*?key=\{option\}[\s\S]*?)>([\s\S]*?)<\/button>/g,
    '<Button variant="custom"$1>$2</Button>'
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
