import { format, getUnixTime, toDate } from 'date-fns';

export const toUnixTimestamp = (input: number | Date | string): number => {
  return getUnixTime(typeof input === 'string' ? new Date(input) : toDate(input));
};

export const toISODate = (input: number | Date | string): string => {
  return format(typeof input === 'string' ? new Date(input) : toDate(input), 'yyyy-MM-dd');
};
