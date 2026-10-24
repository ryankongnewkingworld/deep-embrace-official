import { z } from 'zod';
import { DATA } from './data.js';

const ids = new Set([...DATA.questions.map(q => q.id), ...DATA.opportunities.map(q => q.id)]);
const evidence = z.array(z.string().refine(id => ids.has(id))).min(1).max(6);
const insight = z.object({ title: z.string().min(2).max(60), text: z.string().min(5).max(600), evidence }).strict();
const steps = z.array(z.string().min(2).max(300)).min(1).max(5);
export const narrativeSchema = z.object({
  summary: z.string().min(20).max(1200),
  strengths: z.array(insight).max(3),
  gaps: z.array(insight).min(1).max(4),
  opportunity: z.object({ title: z.string().min(2).max(80), rationale: z.string().min(5).max(700), evidence, ai_steps: steps, human_steps: steps, metrics: steps }).strict(),
  urgency: z.string().min(5).max(500),
  action_plan: z.array(z.object({ week: z.string().max(30), action: z.string().min(2).max(300), deliverable: z.string().min(2).max(200) }).strict()).min(3).max(4),
  expert_questions: z.array(z.string().min(2).max(300)).min(2).max(4),
}).strict();

export const assessmentInputSchema = z.object({
  scope: z.enum(['企业客户经营', '部门／团队', '门店／业务单元']),
  answers: z.record(z.string()).superRefine((answers, ctx) => {
    if (Object.keys(answers).length !== 13) ctx.addIssue({code: z.ZodIssueCode.custom, message:'请完成全部 13 道核心题。'});
    for (const q of DATA.questions) if (!q.options.some(o => o.value === answers[q.id])) ctx.addIssue({code: z.ZodIssueCode.custom, message: q.id + ' 的选项无效。'});
  }),
  opportunities: z.object({P01: z.string().max(1500), P02: z.string().max(1500), P03: z.string().max(1500), P04: z.string().max(1500)}).strict(),
  analysisConsent: z.literal(true),
  website: z.literal('').optional(),
}).strict();

export function redact(text: string) {
  return text.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[邮箱已移除]')
    .replace(/(?<!\d)1[3-9]\d{9}(?!\d)/g, '[手机号已移除]')
    .replace(/(?<![\dA-Za-z])\d{17}[\dXx](?![\dA-Za-z])/g, '[证件号已移除]');
}
