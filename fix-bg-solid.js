const fs = require('fs');
let c = fs.readFileSync('components/dashboard-layout.tsx', 'utf8');
c = c.replace(/style=\{\{ background: "var\(--background\)" \}\}/g, '');
fs.writeFileSync('components/dashboard-layout.tsx', c);

let login = fs.readFileSync('app/login/page.tsx', 'utf8');
login = login.replace(/bg-gradient-to-br from-\[#faf6f0\] to-\[#f5f0e8\]/g, 'bg-transparent');
login = login.replace(/dark:from-\[#1a110a\] dark:to-\[#261a10\]/g, '');
fs.writeFileSync('app/login/page.tsx', login);

let signup = fs.readFileSync('app/signup/page.tsx', 'utf8');
signup = signup.replace(/bg-gradient-to-br from-\[#faf6f0\] to-\[#f5f0e8\]/g, 'bg-transparent');
signup = signup.replace(/dark:from-\[#1a110a\] dark:to-\[#261a10\]/g, '');
fs.writeFileSync('app/signup/page.tsx', signup);
console.log('Fixed solid backgrounds');
