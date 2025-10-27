import { formatDistanceToNow, differenceInDays, differenceInMonths, differenceInYears, format } from 'date-fns';

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

/**
 * Get formatted age string with appropriate units
 * @param {string} dateOfBirth - Birth date
 * @param {number} ageInDays - Optional: age in days (for historical data)
 */
export const getFormattedAge = (dateOfBirth, ageInDays = null) => {
  // If ageInDays is provided, calculate age from that
  if (ageInDays !== null) {
    const years = Math.floor(ageInDays / 365);
    const remainingDays = ageInDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    const parts = [];
    if (years > 0) {
      parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    }
    if (days > 0 && years === 0) {
      parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    }
    return parts.join(', ') || '0 days';
  }

  // Otherwise calculate from birth date to now
  const age = calculateAge(dateOfBirth);
  const parts = [];

  if (age.years > 0) {
    parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`);
  }
  if (age.months > 0) {
    parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`);
  }
  if (age.days > 0 && age.years === 0) {
    parts.push(`${age.days} day${age.days !== 1 ? 's' : ''}`);
  }

  return parts.join(', ') || '0 days';
};

/**
 * Get age in total days
 */
export const getAgeInDays = (dateOfBirth) => {
  return differenceInDays(new Date(), new Date(dateOfBirth));
};

/**
 * Get age in total months
 */
export const getAgeInMonths = (dateOfBirth) => {
  return differenceInMonths(new Date(), new Date(dateOfBirth));
};

/**
 * Get age in total years
 */
export const getAgeInYears = (dateOfBirth) => {
  return differenceInYears(new Date(), new Date(dateOfBirth));
};

/**
 * Get short age format (for tables)
 */
export const getShortAge = (dateOfBirth) => {
  const age = calculateAge(dateOfBirth);

  if (age.years > 0) {
    return `${age.years}y ${age.months}m`;
  }
  if (age.months > 0) {
    return `${age.months}m ${age.days}d`;
  }
  return `${age.days}d`;
};

/**
 * Format date for display
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  return format(new Date(date), formatString);
};

/**
 * Get relative time (e.g., "in 3 days", "2 weeks ago")
 */
export const getRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
