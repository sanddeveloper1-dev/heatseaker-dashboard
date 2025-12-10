// API Response Types
// Based on API_SCHEMAS.md

// Health Check Types
export interface HealthResponse {
  status: 'UP' | 'DOWN' | 'ERROR';
  message: string;
  timestamp: string; // ISO 8601 format
  version: string;
  error?: string; // Present when status is "ERROR"
}

export interface DatabaseHealthResponse {
  status: 'UP' | 'DOWN' | 'ERROR';
  message: string;
  timestamp: string; // ISO 8601 format
  version: string;
  error?: string; // Present when status is "ERROR"
}

// Race Types (based on actual backend schema)
export interface Race {
  id?: string;
  track_id: number;
  date: Date | string; // ISO date string
  race_number: number;
  post_time?: string;
  source_file?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  track_name?: string; // Added for GET /api/races response
  trackCode?: string; // Legacy field
  trackName?: string; // Legacy field
  raceNumber?: number; // Legacy field (maps to race_number)
  status?: 'completed' | 'pending' | 'cancelled'; // Legacy field
}

export interface RaceEntry {
  id?: number;
  race_id: string;
  horse_number: number;
  double?: number;
  constant?: number;
  p3?: string; // Can be 'FALSE' or numeric string
  correct_p3?: number;
  ml?: number; // Morning line odds
  live_odds?: number;
  sharp_percent?: string;
  action?: number;
  double_delta?: number;
  p3_delta?: number;
  x_figure?: number;
  will_pay_2?: string;
  will_pay?: string;
  will_pay_1_p3?: string;
  win_pool?: string;
  veto_rating?: string;
  purse?: string;
  race_type?: string;
  age?: string;
  raw_data?: string;
  source_file?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  // Legacy fields for display
  number?: number; // Maps to horse_number
  name?: string;
  odds?: string;
  jockey?: string;
  trainer?: string;
}

export interface RaceWinner {
  id?: number;
  race_id: string;
  winning_horse_number: number;
  winning_payout_2_dollar?: number;
  winning_payout_1_p3?: number;
  extraction_method: 'simple_correct' | 'header' | 'summary' | 'cross_reference';
  extraction_confidence: 'high' | 'medium' | 'low';
  created_at?: Date | string;
  updated_at?: Date | string;
  // Legacy fields for display
  horseNumber?: number; // Maps to winning_horse_number
  winnerNumber?: number; // Maps to winning_horse_number
  horseName?: string;
  payout?: number; // Maps to winning_payout_2_dollar
  time?: string;
}

export interface Track {
  id?: number;
  code: string;
  name: string;
  location?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// API Response Wrappers
export interface RacesResponse {
  success: boolean;
  races: Array<Race & { track_name?: string }>;
}

export interface RaceDetailResponse {
  success: boolean;
  race: Race;
  entries: RaceEntry[];
}

export interface RaceWinnerResponse {
  success: boolean;
  winner: RaceWinner;
}

export interface WinnersResponse {
  success: boolean;
  winners: RaceWinner[];
  count: number;
}

export interface DailyEntriesResponse {
  success: boolean;
  date: string; // YYYY-MM-DD
  trackCode: string | null;
  count: number;
  entries: Array<{
    race_id: string;
    race_date: string;
    race_number: number;
    track_code: string;
    track_name: string;
    horse_number: number;
    double?: number | null;
    constant?: number | null;
    p3?: string | null;
    correct_p3?: number | null;
    ml?: number | null;
    live_odds?: number | null;
    sharp_percent?: string | null;
    action?: number | null;
    double_delta?: number | null;
    p3_delta?: number | null;
    x_figure?: number | null;
    will_pay_2?: string | null;
    will_pay?: string | null;
    will_pay_1_p3?: string | null;
    win_pool?: string | null;
    veto_rating?: string | null;
    purse?: string | null;
    race_type?: string | null;
    age?: string | null;
    raw_data?: string | null;
    source_file?: string | null;
  }>;
}

export interface DailyWinnersResponse {
  success: boolean;
  date: string; // YYYY-MM-DD
  trackCode: string | null;
  count: number;
  winners: Array<{
    race_id: string;
    race_date: string;
    race_number: number;
    track_code: string;
    track_name: string;
    winning_horse_number: number;
    winning_payout_2_dollar?: number | null;
    winning_payout_1_p3?: number | null;
    extraction_method?: string | null;
    extraction_confidence?: string | null;
  }>;
}

export interface TracksResponse {
  success: boolean;
  tracks: Track[];
}

// Betting Types
export type BetType = 'WIN' | 'PLACE' | 'SHOW' | 'EXACTA';
export type ComboType = 'WHEEL' | 'KEY' | 'BOX' | 'KEY-BOX' | 'POWER-BOX';

export interface Bet {
  trackCode: string; // Required
  raceNumber: number; // Required, positive integer
  betType: string; // Required, one of: 'WIN', 'PLACE', 'SHOW', 'EXACTA', etc.
  horseNumber?: string | number; // Required (for non-EXACTA bets)
  betCombination?: string; // Optional, pattern: /^(\d+(-\d+)+)$/
  comboType?: string; // Optional, one of: 'WHEEL', 'KEY', 'BOX', 'KEY-BOX', 'POWER-BOX'
  betAmount: string; // Required, dollar amount as string
}

export interface BetSubmissionRequest {
  bets: Bet[];
  betType: string; // Required, overall bet type
}

export interface BetSubmissionResponse {
  success: boolean;
  result?: any; // Response from XpressBet API (HTML or text)
  message?: string;
}

// Log Types
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string; // ISO 8601 format
  level: LogLevel;
  message: string;
  meta?: any; // JSON object with additional metadata
  // Legacy fields
  id?: number;
  context?: Record<string, any>;
  created_date?: string; // alternative timestamp field
}

export interface LogsResponse {
  success: boolean;
  logs: LogEntry[];
}

// Statistics Types
export interface RaceDailyStatistics {
  races_processed: number;
  entries_processed: number;
  races_skipped: number;
  entries_skipped: number;
  errors: string[];
}

export interface RaceDailyResponse {
  success: boolean;
  message: string;
  statistics: RaceDailyStatistics;
  processed_races?: string[]; // Array of race IDs (present when success: true)
  errors?: string[]; // Present when success: false
}

export interface Statistics {
  totalRaces?: number;
  totalEntries?: number;
  totalErrors?: number;
  successRate?: number;
  lastBetSubmission?: string;
  lastRaceIngestion?: string;
  [key: string]: any; // Allow additional stats
}

// Error Response Types
export interface ApiError {
  success: false;
  message: string; // Human-readable error message
  error?: string; // Optional, detailed error message
  errors?: string[]; // Optional, array of error messages (for validation errors)
  statistics?: RaceDailyStatistics; // Present in some error responses
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any; // Allow additional fields
}
