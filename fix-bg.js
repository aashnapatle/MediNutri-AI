const fs = require('fs');
let c = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
c = c.replace(/rgba\(253,253,252,0\.8\)/g, 'rgba(253, 248, 245, 0.92)');
c = c.replace(/background: "#ffffff"/g, 'background: "rgba(253, 248, 245, 0.92)"');
fs.writeFileSync('app/dashboard/page.tsx', c);
console.log('Fixed page.tsx');
