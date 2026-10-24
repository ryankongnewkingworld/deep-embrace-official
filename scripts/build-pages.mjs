import { cp, mkdir, readFile, writeFile, readdir, rm, symlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root=process.cwd(), dir=path.join(root,'.pages-build'), base='/deep-embrace-official';
await rm(dir,{recursive:true,force:true}); await mkdir(dir,{recursive:true});
for(const folder of ['app','components','data','public','hooks']) await cp(path.join(root,folder),path.join(dir,folder),{recursive:true});
await rm(path.join(dir,'app/api'),{recursive:true,force:true});
await rm(path.join(dir,'app/chatgpt-auth.ts'),{force:true});
await rm(path.join(dir,'components/connector-error.tsx'),{force:true});
await mkdir(path.join(dir,'lib'),{recursive:true});
for(const name of ['api-endpoint.ts','utils.ts','assessment']) await cp(path.join(root,'lib',name),path.join(dir,'lib',name),{recursive:true});
await rm(path.join(dir,'lib/assessment/signature.ts'),{force:true});
async function adapt(folder){ for(const item of await readdir(folder,{withFileTypes:true})){const p=path.join(folder,item.name);if(item.isDirectory())await adapt(p);else if(/\.(tsx?|jsx?|css)$/.test(p)){let s=await readFile(p,'utf8');s=s.replace(/(["'`])\/(?=media\/|cases|assessment|privacy|admin|favicon|#|["'`])/g,(_,q)=>q+base+'/');s=s.replace(/url\(\/(?!\/)/g,'url('+base+'/');await writeFile(p,s);}}}
for(const f of ['app','components','data'])await adapt(path.join(dir,f));
const detail=path.join(dir,'app/cases/[slug]/page.tsx');
await writeFile(detail,(await readFile(detail,'utf8'))+'\nexport function generateStaticParams(){return flagshipCases.map(({slug})=>({slug}));}\n');
await writeFile(path.join(dir,'next.config.mjs'),"export default {output:'export',basePath:"+JSON.stringify(base)+",trailingSlash:true,images:{unoptimized:true},turbopack:{root:process.cwd()}};");
const ts=JSON.parse(await readFile(path.join(root,'tsconfig.json'),'utf8'));ts.compilerOptions.types=['node'];await writeFile(path.join(dir,'tsconfig.json'),JSON.stringify(ts));
for(const f of ['postcss.config.mjs'])await cp(path.join(root,f),path.join(dir,f));
await writeFile(path.join(dir,'package.json'),JSON.stringify({name:'deep-embrace-pages',private:true,type:'module'}));
await symlink(path.join(root,'node_modules'),path.join(dir,'node_modules'),'dir');
const result=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd:dir,stdio:'inherit',env:{...process.env,NEXT_PUBLIC_BACKEND_URL:'https://hlhtpykjthoqzgetdnzs.supabase.co/functions/v1/website-api',NEXT_TELEMETRY_DISABLED:'1'}});
if(result.status!==0)process.exit(result.status||1);
await writeFile(path.join(dir,'out/.nojekyll'),'');

