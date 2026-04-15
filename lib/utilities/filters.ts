export function parseBoolean(value: string | undefined | null) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export function parseNumber(value: string | undefined | null) {
  if (!value) {
    return undefined;
  }

  const number = Number(value);
  return isNaN(number) ? undefined : number;
}

export function parseNumberArray(value: string | undefined | null) {
  if (!value) {
    return undefined;
  }

  return value
    .split(',')
    .map(item => Number(item))
    .filter(item => !Number.isNaN(item));
}

export function parseNumbersArrayToTagArray(roundNumbers: number[] | undefined) {
  if (!roundNumbers) {
    return [];
  }

  return roundNumbers.map((number, index) => ({
    id: index.toString(),
    text: number.toString(),
  }));
}
