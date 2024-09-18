import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const FormatDateToStartOfDay = (date: string): string => {
  const formattedDate =
    dayjs(date, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('YYYY-DD-MM') +
    'T00:00:00.000Z';
  return formattedDate;
};

export const FormatDateToEndOfDay = (date: string): string => {
  const formattedDate =
    dayjs(date, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('YYYY-DD-MM') +
    'T23:59:59.999Z';
  return formattedDate;
};
