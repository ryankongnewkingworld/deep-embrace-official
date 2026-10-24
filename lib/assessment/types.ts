export type Answers = Record<string, string>;
export type Opportunities = { P01: string; P02: string; P03: string; P04: string };
export type Scope = '企业客户经营' | '部门／团队' | '门店／业务单元';
export interface Dimension { key: string; label: string; weight: number; min: number|null; max: number|null; complete: boolean; answered: number; total: number; limited_scope: boolean; }
export interface Insight { title: string; text: string; evidence: string[]; }
export interface Opportunity { title: string; rationale: string; evidence: string[]; ai_steps: string[]; human_steps: string[]; metrics: string[]; }
export interface Narrative { summary: string; strengths: Insight[]; gaps: Insight[]; opportunity: Opportunity; urgency: string; action_plan: { week: string; action: string; deliverable: string }[]; expert_questions: string[]; }
export interface Scoring { version: string; dimensions: Dimension[]; overview: { min: number; max: number; complete: boolean }|null; unknown: string[]; excluded: string[]; answered: number; title: string; net_state: string; warnings: string[]; guardrails: {text: string; evidence: string[]}[]; none_used: boolean; }
export interface Evaluation { scoring: Scoring; provider: 'rules'|'deepseek'; notice: string; narrative: Narrative; model?: string; }
export interface Assessment { id: string; scope: Scope; answers: Answers; opportunities: Opportunities; result: Evaluation; createdAt: string; signature?: string; }
export interface Question { id: string; group: string; title: string; options: {value: string; label: string}[]; why: string; }
export interface QuestionData { version: string; brand: string; title: string; intro: string[]; groups: {id: string; label: string; title: string; description: string}[]; questions: Question[]; opportunities: {id: keyof Opportunities; title: string; placeholder: string; examples: string[]}[]; cta: string; }
