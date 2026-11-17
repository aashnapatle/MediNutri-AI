const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

// Replace botanical-bg::before entirely
css = css.replace(/\.botanical-bg::before \{[\s\S]*?z-index: -1;\n\}/g, `.botanical-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/botanical-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  pointer-events: none;
  z-index: -1;
}`);

// Dark mode background override
css = css.replace(/\.dark \.botanical-bg::before \{[\s\S]*?mix-blend-mode: screen;\n\}/g, `.dark .botanical-bg::before {
  opacity: 0.2;
}`);

// Subtle cream overlays for nature cards
css = css.replace(/\.nature-card \{[\s\S]*?overflow: hidden;\n\}/g, `.nature-card {
  background: rgba(253, 248, 245, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(45, 59, 45, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}`);

// Also fix dark mode card backgrounds to be slightly dark but translucent
css = css.replace(/\.dark \.nature-card \{\s*background: rgba\(35, 43, 36, 0.85\);/g, `.dark .nature-card {\n  background: rgba(35, 43, 36, 0.92);`);

fs.writeFileSync('app/globals.css', css);
console.log('CSS backgrounds fixed!');
