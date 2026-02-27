/**
 * Enterprise-grade defensive data handling for fetch operations
 * Prevents runtime crashes from malformed JSON, missing arrays, and schema violations
 */

interface ValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
}

/**
 * Safe array parser - validates before using .map()
 */
export function safeArrayParse<T>(
  data: unknown,
  itemValidator: (item: unknown) => item is T
): ValidationResult<T[]> {
  const errors: string[] = [];

  // 1. Check if data exists
  if (data === null || data === undefined) {
    errors.push("Data is null or undefined");
    return { isValid: false, data: null, errors };
  }

  // 2. Strict array check
  if (!Array.isArray(data)) {
    errors.push(
      `Expected array, got ${typeof data} (${data.constructor?.name || 'unknown'})`
    );
    return { isValid: false, data: null, errors };
  }

  // 3. Empty array is valid state
  if (data.length === 0) {
    return { isValid: true, data: [], errors };
  }

  // 4. Validate each item in array
  const validatedItems: T[] = [];
  data.forEach((item, index) => {
    if (!itemValidator(item)) {
      errors.push(
        `Item at index ${index} failed validation: ${JSON.stringify(item).slice(0, 100)}`
      );
    } else {
      validatedItems.push(item);
    }
  });

  // 5. Partial success is still usable
  return {
    isValid: validatedItems.length > 0,
    data: validatedItems.length > 0 ? validatedItems : null,
    errors: errors.length > 0 ? errors : [],
  };
}

/**
 * Safe JSON parse with error boundary
 */
export function safeJsonParse<T>(
  jsonString: string,
  fallback: T
): { data: T; error: null } | { data: T; error: Error } {
  try {
    const parsed = JSON.parse(jsonString);
    return { data: parsed as T, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[Defense] JSON parse failed:", error.message);
    return { data: fallback, error };
  }
}

/**
 * Type guards for registration objects
 */
export function isValidVisitorRegistration(
  item: unknown
): item is {
  id: string;
  name: string;
  email: string;
  passType: string;
  status: "pending" | "approved" | "verified";
  userBookingId: string;
  createdAt: string;
  amount: number;
} {
  if (typeof item !== "object" || item === null) return false;

  const obj = item as Record<string, unknown>;

  // Validate critical fields
  return (
    typeof obj.id === "string" &&
    obj.id.length > 0 &&
    typeof obj.name === "string" &&
    typeof obj.email === "string" &&
    typeof obj.passType === "string" &&
    (obj.status === "pending" ||
      obj.status === "approved" ||
      obj.status === "verified") &&
    typeof obj.userBookingId === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.amount === "number"
  );
}

export function isValidEventRegistration(
  item: unknown
): item is {
  id: string;
  teamName: string;
  status: "pending" | "approved" | "verified";
  leaderBookingId: string;
  leaderEmail?: string;
  createdAt: string;
  participant_team_event?: Array<{ event?: { name: string; date?: string } }>;
} {
  if (typeof item !== "object" || item === null) return false;

  const obj = item as Record<string, unknown>;

  // Validate critical fields
  const hasValidCore =
    typeof obj.id === "string" &&
    obj.id.length > 0 &&
    typeof obj.teamName === "string" &&
    (obj.status === "pending" ||
      obj.status === "approved" ||
      obj.status === "verified") &&
    typeof obj.leaderBookingId === "string" &&
    typeof obj.createdAt === "string";

  if (!hasValidCore) return false;

  // Optional nested array validation
  if (obj.participant_team_event !== undefined) {
    if (!Array.isArray(obj.participant_team_event)) return false;
    // Don't validate each event deeply - backend may vary
    // Just ensure it's an array
  }

  return true;
}

/**
 * Validates email format (basic check)
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Safe data normalization with fallback
 */
export function normalizeRegistrationData<T>(
  data: T | null | undefined,
  fallback: T
): T {
  if (data === null || data === undefined) {
    console.warn("[Defense] Null/undefined data, using fallback");
    return fallback;
  }
  return data;
}

/**
 * Batch validator for multiple arrays
 */
export function validateBatchResults<T1, T2>(
  result1: ValidationResult<T1[]>,
  result2: ValidationResult<T2[]>
): {
  data1: T1[];
  data2: T2[];
  hasErrors: boolean;
  errorSummary: string[];
} {
  const allErrors = [...result1.errors, ...result2.errors];

  return {
    data1: (result1.data ?? []) as T1[],
    data2: (result2.data ?? []) as T2[],
    hasErrors: allErrors.length > 0,
    errorSummary: allErrors,
  };
}

/**
 * Atomic state updater - ensures no partial state mutation
 */
export function createAtomicStateUpdate<T>(
  currentState: T,
  updates: Partial<T>,
  validator?: (updated: T) => boolean
): { success: boolean; newState: T | null; error: string | null } {
  try {
    const newState = { ...currentState, ...updates };

    // Optional validation before commit
    if (validator && !validator(newState)) {
      return {
        success: false,
        newState: null,
        error: "State validation failed",
      };
    }

    return { success: true, newState, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { success: false, newState: null, error };
  }
}

/**
 * Logging utility for fetch operations
 */
export const DefenseLog = {
  info: (context: string, message: string, data?: unknown) => {
    console.log(`[Defense:${context}] ${message}`, data ?? "");
  },
  warn: (context: string, message: string, data?: unknown) => {
    console.warn(`[Defense:${context}] ${message}`, data ?? "");
  },
  error: (context: string, message: string, error?: unknown) => {
    console.error(
      `[Defense:${context}] ${message}`,
      error instanceof Error ? error.message : String(error)
    );
  },
};
