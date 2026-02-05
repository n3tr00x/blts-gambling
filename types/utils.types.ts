export type NonNullableProps<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

export type SnakeToCamelCase<T> =
  T extends Array<infer U>
    ? Array<SnakeToCamelCase<U>>
    : T extends object
      ? {
          [K in keyof T as K extends string ? SnakeToCamel<K> : K]: SnakeToCamelCase<
            T[K]
          >;
        }
      : T;
