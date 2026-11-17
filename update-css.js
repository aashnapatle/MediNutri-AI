const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

// Update theme colors
css = css.replace(/--background: (.*?);/g, '--background: #faf8f5;');
css = css.replace(/--foreground: (.*?);/g, '--foreground: #2d3b2d;');
css = css.replace(/--primary: (.*?);/g, '--primary: #375b42;');
css = css.replace(/--secondary: (.*?);/g, '--secondary: #e8f0e6;');
css = css.replace(/--accent: (.*?);/g, '--accent: #7c9a6e;');

// Update `.botanical-bg` for actual image usage
css = css.replace(/\.botanical-bg::before \{[\s\S]*?z-index: 0;\n\}/g, `.botanical-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/botanical-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.15;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: -1;
}`);

// Update .nature-card to be transparent blur
css = css.replace(/\.nature-card \{[\s\S]*?overflow: hidden;\n\}/g, `.nature-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255,255,255,0.4);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}`);

// Add some nice utility overrides for buttons
css = css.replace(/\.btn-golden \{[\s\S]*?box-shadow 0.18s ease;\n\}/g, `.btn-golden {
  background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 10px rgba(255, 117, 140, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}`);

fs.writeFileSync('app/globals.css', css);
console.log('CSS updated successfully');
