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
      
      // Replace backgrounds
      content = content.replace(/bg-black\/(40|30|50|20|10|60)/g, 'bg-card');
      content = content.replace(/bg-white\/5/g, 'bg-card-hover');
      content = content.replace(/bg-black(?![A-Za-z0-9\/\-])/g, 'bg-background');
      
      // Replace borders
      content = content.replace(/border-white\/(5|10|20|40)/g, 'border-border');
      
      // Replace text
      content = content.replace(/text-white(?![A-Za-z0-9\/\-])/g, 'text-text');
      content = content.replace(/text-white\/(40|50|60|70|80)/g, 'text-text-muted');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./src');
console.log('done replacing');
