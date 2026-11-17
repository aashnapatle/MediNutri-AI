const fs = require('fs');

function addBotanical(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('botanical-bg')) {
    content = content.replace(/className="min-h-screen/g, 'className="min-h-screen botanical-bg');
    fs.writeFileSync(file, content);
  }
}

addBotanical('app/login/page.tsx');
addBotanical('app/signup/page.tsx');
console.log('Added botanical-bg to auth pages');
