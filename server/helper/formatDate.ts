import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const FormatDateToStartOfDay = (date: string): string => {
  if (date.includes('-')) {
    const [dates, month, year] = date.split('-');
    date = `${year}-${month}-${dates}T00:00:00.000Z`;
    return date;
  } else if (date.includes('/')) {
    const [dates, month, year] = date.split('/');
    date = `${year}-${month}-${dates}T00:00:00.000Z`;
    return date;
  } else {
    return 'Invalid date format';
  }
};

export const FormatDateToEndOfDay = (date: string): string => {
  if (date.includes('-')) {
    const [dates, month, year] = date.split('-');
    date = `${year}-${month}-${dates}T23:59:59.999Z`;
    return date;
  } else if (date.includes('/')) {
    const [dates, month, year] = date.split('/');
    date = `${year}-${month}-${dates}T23:59:59.999Z`;
    return date;
  } else {
    return 'Invalid date format';
  }
};

export const FormatDateWithShift = (date: string, shift: string): string => {
  var HISTime = '';
  if (shift === 'Sáng') {
    HISTime = 'T08:00:00.000Z';
  } else if (shift === 'Tối') {
    HISTime = 'T18:00:00.000Z';
  } else {
    HISTime = 'T00:00:00.000Z';
  }

  if (date.includes('-')) {
    const [dates, month, year] = date.split('-');
    date = `${year}-${month}-${dates}${HISTime}`;
    return date;
  } else {
    const [dates, month, year] = date.split('/');
    date = `${year}-${month}-${dates}${HISTime}`;
    return date;
  }
};

export const FormatDate = (date: string): string => {
  if (date.includes('-')) {
    const [dates, month, year] = date.split('-');
    date = `${year}-${month}-${dates}T00:00:00.000Z`;
    return date;
  } else {
    const [dates, month, year] = date.split('/');
    date = `${year}-${month}-${dates}T00:00:00.000Z`;
    return date;
  }
};
/* 
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const parseDate = (date: string): [string, string, string] | null => {
  if (date.includes('-')) {
    return date.split('-').map((part) => part.padStart(2, '0')) as [
      string,
      string,
      string,
    ];
  } else if (date.includes('/')) {
    return date.split('/').map((part) => part.padStart(2, '0')) as [
      string,
      string,
      string,
    ];
  }
  return null;
};

const formatDate = (date: string, time: string): string => {
  const parsedDate = parseDate(date);
  if (!parsedDate) {
    return 'Invalid date format';
  }
  const [day, month, year] = parsedDate;
  return `${year}-${month}-${day}${time}`;
};

export const FormatDateToStartOfDay = (date: string): string => {
  return formatDate(date, 'T00:00:00.000Z');
};

export const FormatDateToEndOfDay = (date: string): string => {
  return formatDate(date, 'T23:59:59.999Z');
};

export const FormatDateWithShift = (date: string, shift: string): string => {
  let HISTime = 'T00:00:00.000Z';
  if (shift === 'Sáng') {
    HISTime = 'T08:00:00.000Z';
  } else if (shift === 'Tối') {
    HISTime = 'T18:00:00.000Z';
  }
  return formatDate(date, HISTime);
};

export const FormatDate = (date: string): string => {
  return formatDate(date, 'T00:00:00.000Z');
};
 */
