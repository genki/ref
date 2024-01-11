import {describe, test, expect, expectTypeOf} from 'vitest';
import ref, {Ref, keyRef, getRef, setRef} from './index';

describe("Ref", () => {
  test("Basic usage", () => {
    const state = {count: 0, name: "foo"};
    const refCount:Ref<number> = ref({count:state});
    expect(keyRef(refCount)).toBe("count");
    expect(getRef(refCount)).toBe(0);
    setRef(refCount, 1);
    expect(getRef(refCount)).toBe(1);

    expectTypeOf(refCount).toEqualTypeOf<Ref<number,PropertyKey,object>>();
    expectTypeOf(ref({count:state})).
      toEqualTypeOf<Ref<number,"count",typeof state>>();
    expectTypeOf(refCount).not.toEqualTypeOf(ref({count:state}));
  });

  test("Used as args of async function", async () => {
    const foo = async <V,K extends string,S>(
      ref:Ref<V,K,S>,
      value:V,
    ) => {
      setRef(ref, value);
      // this is not the expected usage but for testing.
      return getRef(ref);
    };
    const state:{count:number, name:string} = {count: 0, name: "foo"};
    const count = await foo({count:state}, 2);
    expect(count).toBe(2);
    const name = await foo({name:state}, "bar");
    expect(name).toBe("bar");
  });

  test("Used as args of function", async () => {
    const foo = <V,K extends string,S>(
      ref:Ref<V,K,S>,
      value:V,
    ) => {
      setRef(ref, value);
      const newValue = getRef(ref);
      // we cannot return the value of type `V`
      // If do so, it affect to the type inference and causes an error.
      // At any rate, `Ref` is not for the return value so no problem.
      // return newValue;
    };
    const state:{count:number, name:string} = {count: 0, name: "foo"};
    foo({count:state}, 2);
    expect(getRef({count:state})).toBe(2);
    foo({name:state}, "bar");
    expect(getRef({name:state})).toBe("bar");
  });
});
