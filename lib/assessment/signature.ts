import { env } from 'cloudflare:workers';
import type { Assessment } from './types';

const encoder = new TextEncoder();
const encode = (data:ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(data))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const payload = (a:Assessment) => encoder.encode('assessment-report-v1\n'+JSON.stringify({id:a.id,scope:a.scope,answers:a.answers,opportunities:a.opportunities,result:a.result,createdAt:a.createdAt}));
async function key() {
  const config = env as unknown as Record<string,string|undefined>;
  const secret = config.LEAD_HASH_SECRET || config.LEAD_ENCRYPTION_KEY;
  if(!secret)return null;
  return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
export async function signAssessment(assessment:Assessment):Promise<string|undefined> {
  const secret=await key();
  if(!secret)return undefined;
  return encode(await crypto.subtle.sign('HMAC',secret,payload(assessment)));
}
export async function verifyAssessment(assessment:Assessment):Promise<boolean> {
  if(!assessment.signature || assessment.signature.length>100)return false;
  try {
    const secret=await key();
    if(!secret)return false;
    const signature=Uint8Array.from(atob(assessment.signature.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
    return await crypto.subtle.verify('HMAC',secret,signature,payload(assessment));
  }catch{return false;}
}
