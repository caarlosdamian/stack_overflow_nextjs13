import { BADGE_CRITERIA } from '@/constants';
import { BadgeCounts, BadgeCriteriaType } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getMonthYear = (date: Date): string => {
  if (!(date instanceof Date)) {
    throw new Error('Parameter must be a Date object');
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString(undefined, options);
};

interface URLQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: URLQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

interface RemoveKeyI {
  params: string;
  keys: string[];
}

export const removeKeysFromQuery = ({ keys, params }: RemoveKeyI) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

interface BadgeParams {
  criteria: { type: keyof BadgeCriteriaType; count: number }[];
}

export const assingBadges = (params: BadgeParams) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };
  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    // @ts-ignore
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });
  return badgeCounts;
};

export function formatLocation(
  city: string | null,
  state: string | null,
  country: string | null
) {
  const parts = [];

  if (city) {
    parts.push(city);
  }

  if (state) {
    parts.push(state);
  }

  if (country) {
    parts.push(country);
  }

  return parts.join(',');
}

export function formatSalaryRange(min: string | null, max: string | null) {
  if (min !== null && max !== null) {
    return `${min}-${max}`;
  }
  return 'Not disclosed';
}
