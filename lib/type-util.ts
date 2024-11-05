// export type NullToUndefined<T> = {
//   [K in keyof T as null extends T[K] ? K : never]?: undefined | Exclude<T[K], null>
// } & {
//   [K in keyof T as null extends T[K] ? never : K]: T[K]
// }

export type NullToUndefined<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T as null extends T[K] ? K : never]?: undefined | NullToUndefined<Exclude<T[K], null>>
    } & {
      [K in keyof T as null extends T[K] ? never : K]: NullToUndefined<T[K]>
    }
  : T

// type PickNullable<T> = {
//   [P in keyof T as null extends T[P] ? P : never]: T[P]
// }

// type PickNotNullable<T> = {
//   [P in keyof T as null extends T[P] ? never : P]: T[P]
// }

// type OptionalNullable<T> = {
//   [K in keyof PickNullable<T>]?: Exclude<T[K], null>
// } & {
//   [K in keyof PickNotNullable<T>]: T[K]
// }

// type UserOptional = OptionalNullable<User>
