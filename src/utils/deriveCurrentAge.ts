import dayjs from "dayjs";

/**
 * Derives current age from a date-of-birth string (YYYY-MM-DD).
 * Treats the input as a calendar date with no timezone.
 */
export const deriveCurrentAge = (dateOfBirth?: string): number | undefined => {
  if (typeof dateOfBirth !== "string" || !dateOfBirth) {
    return undefined;
  }

  const birth = dayjs(dateOfBirth);
  if (!birth.isValid()) {
    return undefined;
  }

  return dayjs().diff(birth, "year");
};
