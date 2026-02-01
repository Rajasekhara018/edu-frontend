const fs = require('fs');
const path = require('path');
const file = path.join('src','app','pages','products','products-page.component.scss');
let text = fs.readFileSync(file,'utf8');
const start = text.indexOf('@media (max-width: 900px) {');
const end = text.indexOf('@keyframes rise');
if (start === -1 || end === -1) throw new Error('blocks not found');
const newBlock = `@media (max-width: 900px) {\n  .support-section {\n    grid-template-columns: 1fr;\n  }\n\n  .support-card {\n    width: 100%;\n  }\n\n  .support-section .support-actions {\n    margin-top: 1rem;\n  }\n}\n\n`;
fs.writeFileSync(file, text.slice(0, start) + newBlock + text.slice(end));
