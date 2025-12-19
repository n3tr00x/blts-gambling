export function formatDateString(dateString: string, locale = 'pl-PL') {
  // Rozdzielamy rok i miesiąc
  const [month, year] = dateString.split('-').map(Number);

  // Tworzymy obiekt Date (dzień ustawiamy na 1)
  const date = new Date(year, month - 1);

  // Używamy Intl.DateTimeFormat do formatowania
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });

  // Formatowanie daty
  // Dodajemy .replace, żeby pierwszy znak był wielką literą (dla polskiego wygląda to lepiej)
  const formattedDate = formatter.format(date);
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}
