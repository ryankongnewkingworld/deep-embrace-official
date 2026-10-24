import type {Answers, Opportunities, Scoring, Evaluation} from './types';
export const DIMENSIONS: [string,string,string[],number][];
export function calculate(answers: Answers): Scoring;
export function demoEvaluation(answers: Answers, opportunities: Opportunities): Evaluation;
