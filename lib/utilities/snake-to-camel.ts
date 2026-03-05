export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const convertKeysToCamel = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamel(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const camelCaseObj: Record<string, unknown> = {};

    for (const key in obj) {
      const camelKey = snakeToCamel(key);
      const value = (obj as Record<string, unknown>)[key];

      camelCaseObj[camelKey] = convertKeysToCamel(value);
    }

    return camelCaseObj;
  }

  return obj;
};
