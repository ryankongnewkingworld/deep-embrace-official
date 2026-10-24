import { DATA } from './data.js';
export const DIMENSIONS=[['application','应用与流程改造',['Q01','Q02','Q03','Q04','Q05','Q06'],.45],['evidence','价值验证方法',['Q07','Q09'],.30],['readiness','持续落地准备',['Q10','Q11','Q12','Q13'],.25]];
const numeric=(a,q)=>/^[0-4]$/.test(a[q]??'')?Number(a[q]):null;
const NET={N:'尚未开展试点',U:'净收益尚未确认',X:'已比较，尚无净改善',T:'净工时改善，成本待核算',V:'自述已有综合经营改善',unknown:'净收益情况待确认'};
export function calculate(answers){
 const dimensions=DIMENSIONS.map(([key,label,ids,weight])=>{
  const active=ids.filter(q=>answers[q]!=='na'), vals=active.map(q=>numeric(answers,q)), unknown=vals.filter(x=>x===null).length;
  const sum=vals.reduce((s,x)=>s+(x??0),0),denom=active.length*4;
  return {key,label,weight,min:denom?sum/denom*100:null,max:denom?(sum+unknown*4)/denom*100:null,complete:unknown===0,answered:active.length-unknown,total:active.length,limited_scope:active.length!==ids.length};
 });
 const excluded=Object.keys(answers).filter(q=>answers[q]==='na'),unknown=Object.keys(answers).filter(q=>answers[q]==='unknown');
 let overview=excluded.length?null:{min:Math.floor(dimensions.reduce((s,d)=>s+d.min*d.weight,0)),max:Math.ceil(dimensions.reduce((s,d)=>s+d.max*d.weight,0)),complete:dimensions.every(d=>d.complete)};
 if(overview?.complete){const x=Math.round(dimensions.reduce((s,d)=>s+d.min*d.weight,0));overview={min:x,max:x,complete:true};}
 const warnings=[];
 if(['T','V'].includes(answers.Q08)&&(numeric(answers,'Q07')===null||numeric(answers,'Q07')<3))warnings.push('您自述已有净改善，但完整前后记录尚不足；收益判断需要进一步核验，暂不视为已证实。');
 const first=['Q01','Q02','Q03'].map(q=>answers[q]).filter(v=>v!=='na'),none_used=first.length>0&&first.every(v=>v==='0');
 if(none_used&&['Q04','Q05','Q06'].some(q=>![null,0].includes(numeric(answers,q))))warnings.push('业务应用与流程使用的回答可能指向不同范围；专家沟通时请先确认是否为同一场景。');
 if(answers.Q08==='N'&&(numeric(answers,'Q06')??0)>0)warnings.push('“尚未试点”与已有真实任务使用记录需要核对；当前不据此确认价值。');
 let title='AI开始融入业务，价值需要持续验证';
 if(unknown.length>6)title='关键情况待确认，先完成一次业务梳理';
 else if(none_used)title='处于起步阶段，先选一个可验证的业务问题';
 else if(warnings.length)title='已有应用探索，关键证据还需要对齐';
 else if(answers.Q08==='X')title='已经认真验证，下一步先定位净收益缺口';
 else if(answers.Q08==='V'&&(numeric(answers,'Q07')??0)>=3)title='自述已有经营改善，继续验证稳定性与可复制性';
 else if(answers.Q08==='T'&&(numeric(answers,'Q07')??0)>=3)title='净工时已有改善，完整成本仍待核算';
 else if([0,1,2].includes(numeric(answers,'Q04'))||[0,1,2].includes(numeric(answers,'Q05')))title='工具已经使用，业务流程仍待贯通';
 const guardrails=[];
 if(numeric(answers,'Q12')===null||numeric(answers,'Q12')<3)guardrails.push({text:'先明确资料使用权限、人工复核和异常转交；暂不建议无人复核的对客自动化。',evidence:['Q12']});
 if(numeric(answers,'Q10')===null||numeric(answers,'Q10')<2)guardrails.push({text:'先整理有权使用的样本与资料来源；不要直接接入全量客户资料。',evidence:['Q10']});
 if(numeric(answers,'Q13')===null||numeric(answers,'Q13')<3)guardrails.push({text:'先确定对业务结果负责的人与验收标准，再考虑扩大投入。',evidence:['Q13']});
 if(answers.Q08==='X')guardrails.unshift({text:'当前方法尚无净改善，不应直接扩大；先核查额外操作、返工与使用成本，必要时停止该方案。',evidence:['Q08']});
 return {version:DATA.version,dimensions,overview,unknown,excluded,answered:13-unknown.length-excluded.length,title,net_state:NET[answers.Q08],warnings,guardrails,none_used};
}
export function demoEvaluation(answers,ops){
 const scoring=calculate(answers),n=q=>numeric(answers,q)??0;
 const strengths=[];
 const used=['Q01','Q02','Q03'].filter(q=>n(q)>=2);
 if(used.length)strengths.push({title:'已找到固定的业务应用',text:'您已在至少一类固定任务中使用AI。下一步可以围绕同一流程核对完整耗时、质量和交接方式，而不是从工具选择重新开始。',evidence:used});
 if(n('Q07')>=3)strengths.push({title:'有完整处理时间的前后记录',text:'把复核与返工计入比较，为判断是否真正提效提供了基础。仍需确认任务难度、质量标准和业务量具有可比性。',evidence:['Q07']});
 if(n('Q11')>=3)strengths.push({title:'用法已开始沉淀为团队能力',text:'多位相关人员能够按照同一流程完成工作，具备进一步验证稳定性和复制条件的基础。',evidence:['Q11']});
 if(!strengths.length&&n('Q10')>=2)strengths.push({title:'已有可整理的业务资料',text:'集中资料可以成为试点的起点；数据是否允许使用、是否准确及时，还需要结合具体场景核实。',evidence:['Q10']});
 const gaps=[];
 if([0,1,2].includes(numeric(answers,'Q04'))||[0,1,2].includes(numeric(answers,'Q05')))gaps.push({title:'从单个任务，走向完整流程',text:'如果AI只让其中一个步骤变快，前后的复制、交接和录入仍可能抵消收益。建议先画出任务进入到最终交付的流程，再判断哪些步骤应保留、合并或自动执行。',evidence:['Q04','Q05']});
 if(n('Q07')<3||['N','U','unknown'].includes(answers.Q08))gaps.push({title:'先把“感觉更快”变成可核验的结果',text:'记录同类任务改造前后的完整人工投入，把审核、返工、维护和系统费用纳入。释放的工时不直接等于现金节约，处理量增长也不自动等于收入增长。',evidence:['Q07','Q08']});
 if(n('Q09')<3)gaps.push({title:'把使用数据连接到经营目标',text:'生成数量和使用次数能说明活跃度，但还需要有效咨询、服务质量、转化或单位成本等与场景匹配的指标。前后变化不能直接归因为AI。',evidence:['Q09']});
 if(!gaps.length)gaps.push({title:'验证改善能否持续与复制',text:'在不同任务量、员工和异常情况中复测，并纳入运行费用和质量变化；不要仅凭一次成功扩大应用。',evidence:['Q06','Q07','Q13']});
 const search=(ops.P01+' '+ops.P02).trim();let title,ai_steps,metrics;
 if(/资料|文件|文书|交付/.test(search)){
 title='资料整理 → 标准初稿 → 人工核验 → 交付记录';ai_steps=['按固定模板整理资料并保留来源','为人工复核生成结构化初稿','经确认后回填记录、减少重复录入'];metrics=['每份合格交付的完整人工分钟数','复核与返工时间','关键事实正确性与异常次数'];
 }else if(/咨询|客服|回复|响应/.test(search)){
 title='问题接收 → 授权知识检索 → 辅助答复 → 转交跟进';ai_steps=['对重复问题分类、查找允许使用的资料','生成附来源的建议答复','转交无法处理的问题并记录后续结果'];metrics=['首次有效响应时间','一次解决率与答复准确性','每次有效服务的总处理成本'];
 }else if(/内容|营销|获客|触达|线索/.test(search)){
 title='内容与触达 → 线索登记 → 分配跟进 → 结果回流';ai_steps=['根据已确认的产品事实整理内容草稿','衔接线索登记与任务分发','整理有效咨询与后续跟进结果'];metrics=['有效咨询量及质量','线索响应时间','每条有效线索的完整成本'];
 }else if(/跟进|客户|复购|转化|续费/.test(search)){
 title='客户状态整理 → 跟进建议 → 人工确认 → 反馈记录';ai_steps=['整理客户状态与待办','依据规则生成跟进建议','经授权后回填执行结果'];metrics=['漏跟进率','跟进记录完整度','与场景相关的转化或满意度'];
 }else{
 title='先选一个重复任务，验证从输入到交付的完整过程';ai_steps=['识别资料提取、分类、草稿等适合辅助的步骤','比较AI方案与普通规则自动化方案','只在验收通过后连接下一步操作'];metrics=['同类任务完整人工时间','合格率与返工次数','运行、维护及工具费用'];}
 const evidence=['P01','P02'].filter(q=>ops[q]?.trim()&&ops[q].trim()!=='不清楚');
 let rationale=search?'根据您希望改善的业务描述，建议把这条流程作为候选试点，而不是直接购买更多工具。具体输入、输出、频率、资料权限和错误代价仍需核实。':'当前补充信息不足以确定哪一项机会收益最高。建议先明确一个反复发生、结果可核验的任务，再决定使用AI、规则自动化或仅优化流程。';
 if(answers.Q08==='X')rationale='您已经表示现有方案没有净改善。因此先复盘当前流程的额外操作和返工，必要时暂停原方案；以下只是重新验证的候选范围，不是扩大投入建议。';
 let urgency=ops.P04?.trim()&&ops.P04.trim()!=='不清楚'?'您补充了业务影响或时间窗口。建议先确认这一影响的持续频率及明确日期，倒排样本准备、试验与验收；不以未经核实的损失或同行比较制造紧迫性。':'目前没有足够信息证明需要立即投入大项目。可以先用真实任务记录建立基线，再决定是否安排试点。';
 if(scoring.guardrails.length)urgency+=' 在准备条件补齐前，只开展边界清楚、保留人工审核的小范围验证。';
 return {scoring,provider:'rules',notice:'本次由固定规则生成，未调用外部AI模型。结果基于您的自述，关键事实仍需业务核验。',narrative:{
 summary:'您的回答表明：'+scoring.title+'。本次判断聚焦客户经营，并非对整个企业的审计。建议从一条真实流程开始，用相同质量标准比较完整工时与成本，再决定继续、调整或停止。',strengths,gaps,
 opportunity:{title,rationale,evidence:evidence.length?evidence:['Q04','Q07'],ai_steps,human_steps:['确认资料权限、业务规则与验收标准','审核关键事实和对客输出，处理例外情况','对最终交付和业务结果负责'],metrics},urgency,
 action_plan:[{week:'第 1 周',action:'选定同一类任务，记录当前流程、完整工时与质量。',deliverable:'一张流程图与一份基线记录'},{week:'第 2 周',action:'整理有权使用的样本，确定负责人、人机分工和验收标准。',deliverable:'样本包、权限边界与验收清单'},{week:'第 3 周',action:'在受控范围内试用，记录复核、返工、工具与维护投入。',deliverable:'与原方式可比较的运行记录'},{week:'第 4 周',action:'比较净工时、质量与总成本，决定继续、调整或停止。',deliverable:'一项明确的推进决定及负责人'}],
 expert_questions:['最值得改善的任务，具体从哪里开始、到哪里结束？','是否有同类任务的完整工时、质量和成本记录？','哪些资料有权使用，出错时由谁复核并接管？']}};
}
