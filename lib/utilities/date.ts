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

// export const formatDateToISO = (date: Date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// };

export const formatDateToISO = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// export const formatDateToISO = (date: Date) => {
//   return date.toISOString().slice(0, 10);
// };

// export const formatDateToISO = (date: Date) => {
//   const tzOffset = date.getTimezoneOffset() * 60000;
//   const correctedDate = new Date(date.getTime() - tzOffset);

//   return correctedDate.toISOString().slice(0, 10);
// };

// export const parseLocalDate = (date: string) => {
//   const [year, month, day] = date.split('-').map(Number);
//   return new Date(year, month - 1, day);
// };
