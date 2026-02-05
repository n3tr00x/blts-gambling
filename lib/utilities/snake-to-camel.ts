/**
 * Konwertuje snake_case na camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Konwertuje klucze obiektu z snake_case na camelCase
 */
export const convertKeysToCamel = <T extends Record<string, any>>(obj: T): any => {
  if (Array.isArray(obj)) {
    return obj.map(item =>
      typeof item === 'object' && item !== null ? convertKeysToCamel(item) : item,
    );
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const camelCaseObj: Record<string, any> = {};

  for (const key in obj) {
    const camelKey = snakeToCamel(key);
    const value = obj[key];

    camelCaseObj[camelKey] =
      typeof value === 'object' && value !== null ? convertKeysToCamel(value) : value;
  }

  return camelCaseObj;
};
