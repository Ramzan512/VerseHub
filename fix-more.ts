import * as fs from 'fs';
import * as path from 'path';

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/text-white\/(90|80|70|60|50|40|30|20|10)/g, 'text-text-muted');
      content = content.replace(/border-white\/(90|80|70|60|50|40|30|20|10)/g, 'border-border');
      content = content.replace(/bg-black\/(90|80|70|60|50|40|30|20|10)/g, 'bg-card');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./src');
console.log('done fixing more');
