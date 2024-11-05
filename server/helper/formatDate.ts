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
