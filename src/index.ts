// Author: Genki Takiuchi
// Date: 2024/01/12
//
// Description:
//  This file is the entry point of the library.

/*
 * utility types and functions
 */
type PartialKeys<T> = {
  [P in keyof T]?: Exclude<T[P], undefined>;
};
const keysOf = <
  T extends Record<K, V>, K extends keyof T = keyof T, V extends T[K] = T[K],
>(obj:T|PartialKeys<T>) => {
  return Object.keys(obj) as K[];
}

// the Key type is a PropertyKey, which is a string or a symbol.
type Key = PropertyKey;
// the State type is a map from Key to Value that is referred by Ref.
type State<K extends Key,V> = {[P in K]?:V};

/*
 * exported types and functions
 */
// Ref is a single key value pair that points the property of the state.
// This consists of as like `{key: {key: state}}`.
export type Ref<V=any,K extends Key=Key, S=object> = {
  [P in K]: S extends State<K,V> ? S : never
};

// Make a Ref with type checking.
// Usage:
//   const state = {count: 0};
//   const ref:Ref<number> = ref({count:state});
export const ref = <V,K extends Key,S>(ref:Ref<V,K,S>) => ref as Ref<V,K,S>

// Get the only key of the Ref.
export const keyRef = <V,K extends Key,S>(ref:Ref<V,K,S>):K => keysOf(ref)[0];

// Get the value from the Ref.
// the key is optional and automatically inferred from the Ref.
export const getRef = <V,K extends Key,S>(
  ref:Ref<V,K,S>, key:K = keyRef(ref)):V|undefined => ref[key][key];

// Set the value to the Ref.
export const setRef = <V,K extends Key,S>(ref:Ref<V,K,S>, v:V) => {
  const key = keyRef(ref);
  const state:State<K,V> = ref[key];
  state[key] = v;
}

export default ref;
