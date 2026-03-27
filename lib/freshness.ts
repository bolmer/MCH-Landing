
import fs from 'fs/promises';
import path from 'path';
import { cacheLife } from 'next/cache';

const STATUS_FILE = path.resolve('..', 'reports', 'governance_cycle_last_run.json');
const THRESHOLD_MINUTES = Number(process.env.FRESHNESS_THRESHOLD_MINUTES) || 60;

export interface FreshnessStatus {
  isFresh: boolean;
  lastRun: Date | null;
  status: 'SUCCESS' | 'FAILED' | 'UNKNOWN';
  timeDiffMinutes: number;
}

export async function checkDataFreshness(now: Date): Promise<FreshnessStatus> {
  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8');
    const json = JSON.parse(data);

    const lastRun = new Date(json.timestamp);
    const diffMs = now.getTime() - lastRun.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Validar si es fresco Y exitoso
    const isFresh = diffMinutes < THRESHOLD_MINUTES && json.cycle_status === 'SUCCESS';

    return {
      isFresh,
      lastRun,
      status: json.cycle_status,
      timeDiffMinutes: diffMinutes
    };

  } catch (error) {
    console.error('Error reading freshness status:', error);
    return {
      isFresh: false,
      lastRun: null,
      status: 'UNKNOWN',
      timeDiffMinutes: 9999
    };
  }
}
