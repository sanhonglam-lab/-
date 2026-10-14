import fs from 'node:fs';
import path from 'node:path';
const output='cloudflare-dist';
fs.mkdirSync(output,{recursive:true});
const excluded=new Set(['.git','cloudflare-dist','cloudflare-build.mjs','README.md']);
function copy(from,to){fs.mkdirSync(to,{recursive:true});for(const item of fs.readdirSync(from,{withFileTypes:true})){if(excluded.has(item.name))continue;const source=path.join(from,item.name),target=path.join(to,item.name);if(item.isDirectory())copy(source,target);else{if(fs.statSync(source).size>25*1024*1024)throw new Error('Cloudflare file exceeds 25 MiB: '+source);if(/\.(html|js|css|json)$/.test(item.name)){let text=fs.readFileSync(source,'utf8').replaceAll('/-/','/');fs.writeFileSync(target,text);}else fs.copyFileSync(source,target);}}}
copy('.',output);
console.log('Cloudflare static build ready');
