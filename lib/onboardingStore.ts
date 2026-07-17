// Shared localStorage utilities for the onboarding flow.
// Collects answers across pages and stores the API response.

export interface OnboardingData {
  nickname: string;
  porn_free_goal: number;
  answers: Record<string, string>;
}

export interface OnboardingAnalysis {
  level: string;
  title: string;
  level_description: string;
  pattern_analysis: string;
  encouragement: string;
}

export interface OnboardingResult {
  id: string;
  email: string;
  nickname: string;
  recovery_reason: string;
  daily_checkin_time: string;
  porn_free_goal: number;
  onboarding_completed: boolean;
  onboarding_analysis: OnboardingAnalysis;
}

const DATA_KEY = "onboarding_data";
const RESULT_KEY = "onboarding_result";

function defaultData(): OnboardingData {
  return { nickname: "", porn_free_goal: 30, answers: {} };
}

export function getOnboardingData(): OnboardingData {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? (JSON.parse(raw) as OnboardingData) : defaultData();
  } catch {
    return defaultData();
  }
}

export function saveOnboardingField(field: Partial<Omit<OnboardingData, "answers">>) {
  const current = getOnboardingData();
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...current, ...field }));
}

export function setOnboardingAnswer(key: string, value: string) {
  const data = getOnboardingData();
  data.answers[key] = value;
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function saveOnboardingResult(result: OnboardingResult) {
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function getOnboardingResult(): OnboardingResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as OnboardingResult) : null;
  } catch {
    return null;
  }
}
