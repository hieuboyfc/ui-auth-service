import moment from 'moment';

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 */
const dateSort: any = (dateA: string, dateB: string) => moment(dateA).diff(moment(dateB));

/**
 *
 * @param {number|string} a
 * @param {number|string} b
 */
const defaultSort: any = (a: any, b: any) => {
  if (a.id < b.id) return -1;
  if (b.id < a.id) return 1;
  return 0;
};

export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
};
