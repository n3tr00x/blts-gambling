export const formatDateToPolishLong = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD.');
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export function formatToLongMonthYear(dateString: string, locale = 'pl-PL') {
  const [month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1);

  const formatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const formattedDate = formatter.format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export const formatDateToISO = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
