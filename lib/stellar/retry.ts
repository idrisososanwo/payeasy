/**
 * Exponential backoff retry utility for Stellar/Soroban API calls.
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
}

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 1000;

/**
 * Wraps a function with exponential backoff retry logic.
 * 
 * @param fn The async function to retry.
 * @param maxAttempts Maximum number of attempts before throwing.
 * @param baseDelayMs Initial delay in milliseconds.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  baseDelayMs: number = DEFAULT_BASE_DELAY_MS
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) {
        const delay = baseDelayMs * Math.pow(2, attempt - 2);
        // eslint-disable-next-line no-console
        console.log(`[Retry] Attempt ${attempt} of ${maxAttempts} after ${delay}ms delay...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return await fn();
    } catch (error) {
      lastError = error;
      // eslint-disable-next-line no-console
      console.warn(`[Retry] Attempt ${attempt} failed:`, error instanceof Error ? error.message : String(error));
      
      // If it's the last attempt, don't catch the error anymore
      if (attempt === maxAttempts) {
        break;
      }
    }
  }

  throw lastError;
}
