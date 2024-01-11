ref
===
The ref object for TypeScript

Usage
-----

As a variable to refer the property of the state object with checking type and existance.

```ts
import ref { Ref, getRef, setRef } from "@s21g/ref"
const state = {name:"Taro", age:20};
const nameRef:Ref<string> = ref({name:state});
const name = getRef(nameRef);
setRef(nameRef, "Jiro");
```

As an argument to refer the property of the state object with checking type and existance.

```ts
const foo = <V,K extends string,S>(
  ref:Ref<V,K,S>,
  value:V,
) => {
  setRef(ref, value);  
};
const state:{count:number, name:string} = {count: 0, name: "foo"};
foo({count:state}, 2);
getRef({count:state})) // => 2
```
