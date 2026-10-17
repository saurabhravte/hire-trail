export interface WeeklyGoalProgress {
  weekStart: string;
  weekEnd: string;
  targetCount: number;
  submittedCount: number;
  remaining: number;
  progress: number;
  isPaused: boolean;
  hasGoal: boolean;
}

export interface UpsertGoalInput {
  targetCount: number;
  isPaused?: boolean;
}