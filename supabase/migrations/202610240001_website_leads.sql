begin;
create schema if not exists deep_embrace_private;
revoke all on schema deep_embrace_private from public, anon, authenticated;
create table if not exists deep_embrace_private.consultation_leads (
 id text primary key, created_at bigint not null, source text not null,
 payload text not null, request_hash text not null unique, submitter_hash text not null,
 report_token_hash text, notification_status text not null default 'pending',
 notification_attempts integer not null default 0, notification_error text,
 next_attempt_at bigint, notified_at bigint
);
alter table deep_embrace_private.consultation_leads enable row level security;
create index if not exists consultation_submitter_time on deep_embrace_private.consultation_leads(submitter_hash,created_at);
create index if not exists consultation_outbox on deep_embrace_private.consultation_leads(notification_status,next_attempt_at);
-- A private table, no client policies, and one service-role-only RPC.
create or replace function public.deep_embrace_store(operation text, args jsonb default '[]'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 result jsonb := '[]'::jsonb;
 affected integer := 0;
 server_now bigint := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
begin
 if jsonb_typeof(args) <> 'array' then raise exception 'Invalid arguments'; end if;
 case operation
 when 'purge' then
  delete from deep_embrace_private.consultation_leads where created_at < least((args->>0)::bigint,server_now-7776000000);
  get diagnostics affected = row_count;
 when 'duplicate' then
  select coalesce(jsonb_agg(t),'[]') into result from (select * from deep_embrace_private.consultation_leads where request_hash=args->>0 limit 1) t;
 when 'count' then
  select jsonb_build_array(jsonb_build_object('count',count(*))) into result from deep_embrace_private.consultation_leads where submitter_hash=args->>0 and created_at>(args->>1)::bigint;
 when 'insert' then
  -- Serialize submissions per submitter so parallel requests cannot evade limits.
  perform pg_advisory_xact_lock(hashtextextended(args->>5,0));
  if not exists(select 1 from deep_embrace_private.consultation_leads where request_hash=args->>4) and
     (select count(*) from deep_embrace_private.consultation_leads where submitter_hash=args->>5 and created_at>server_now-600000)>=5 then
   raise exception 'Submission rate exceeded';
  end if;
  insert into deep_embrace_private.consultation_leads(id,created_at,source,payload,request_hash,submitter_hash,report_token_hash,notification_status,next_attempt_at)
  values(args->>0,server_now,args->>2,args->>3,args->>4,args->>5,args->>6,args->>7,server_now)
  on conflict(request_hash) do nothing;
  get diagnostics affected = row_count;
 when 'get' then
  select coalesce(jsonb_agg(t),'[]') into result from (select * from deep_embrace_private.consultation_leads where id=args->>0) t;
 when 'invalid_webhook' then
  update deep_embrace_private.consultation_leads set notification_status='pending',notification_error='invalid_webhook_configuration' where id=args->>0;
  get diagnostics affected = row_count;
 when 'claim' then
  update deep_embrace_private.consultation_leads set notification_status='sending',next_attempt_at=(args->>0)::bigint,notification_attempts=notification_attempts+1
  where id=args->>1 and notification_status!='sent' and (notification_status!='sending' or next_attempt_at<(args->>2)::bigint);
  get diagnostics affected = row_count;
 when 'sent' then
  update deep_embrace_private.consultation_leads set notification_status='sent',notified_at=(args->>0)::bigint,next_attempt_at=null,notification_error=null where id=args->>1;
  get diagnostics affected = row_count;
 when 'failed' then
  update deep_embrace_private.consultation_leads set notification_status='pending',notification_error=args->>0,next_attempt_at=(args->>1)::bigint where id=args->>2;
  get diagnostics affected = row_count;
 when 'list' then
  select coalesce(jsonb_agg(t),'[]') into result from (select * from deep_embrace_private.consultation_leads order by created_at desc limit 100) t;
 when 'delete' then
  delete from deep_embrace_private.consultation_leads where id=args->>0;
  get diagnostics affected = row_count;
 when 'retry' then
  select coalesce(jsonb_agg(t),'[]') into result from (select id from deep_embrace_private.consultation_leads where notification_status!='sent' and coalesce(next_attempt_at,0)<=server_now order by created_at limit 10) t;
 when 'report' then
  select coalesce(jsonb_agg(t),'[]') into result from (select * from deep_embrace_private.consultation_leads where id=args->>0 and created_at>=greatest((args->>1)::bigint,server_now-7776000000)) t;
 else raise exception 'Unsupported operation';
 end case;
 return jsonb_build_object('rows',result,'changes',affected);
end;
$$;
revoke all on function public.deep_embrace_store(text,jsonb) from public,anon,authenticated;
grant execute on function public.deep_embrace_store(text,jsonb) to service_role;
commit;
