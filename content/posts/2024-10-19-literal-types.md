---
title: Literal types
tags:
  - code
  - til
---
TypeScript allows [literal types](https://www.typescriptlang.org/docs/handbook/literal-types.html) for strings, numbers and booleans, and they can be an alternative to enums. Literal types are defined, for example, like:

```ts
//a string literal type
type Protocol = 'http' | 'https'

//an interface with literal types
interface ColorfulShape {
	shape: string = 'round' | 'square'
	color: string = 'red' | 'blue' | 'green'
	size: 0 | 2 | 4 | 8
}

//a function with literal types
function createShape(shape: 'round' | 'square') {
  //...
}
```

Literal types are supported by the IDE (VS Code) in terms of autocompletion and type checking. Compared to enums, I think they can be of advantage in the following situations:
- quick to write when used inline within an interface, or as function argument types;
- straightforward to map back and forth to and from JSON, e.g., for storing in a file or a database and reading back.

The downside of literal types is, unfortunately, they cannot be iterated over like it can be done with enums.

```ts
//enum type
enum EnumProtocol {
  HTTP = 'http',
  HTTPS = 'https'
}

//literal type
type LiteralProtocol = 'http' | 'https'

interface IEnumProtocol {
  protocol: EnumProtocol
}

interface ILiteralProtocol {
  protocol: LiteralProtocol
}

let enumProtocol: IEnumProtocol = {
  protocol: EnumProtocol.HTTP
}

let literalProtocol: ILiteralProtocol = {
  protocol: 'http'
}

console.log(literalProtocol)
//{protocol:"http"}

console.log(JSON.stringify(literalProtocol))
//{"protocol":"http"}

console.log(enumProtocol)
//{protocol:"http"}

console.log(JSON.stringify(enumProtocol))
//{"protocol":"http"}

//this will not work
enumProtocol = { protocol: 'http' }
//Type '"http"' is not assignable to type 'EnumProtocol'. Did you mean 'EnumProtocol.HTTPS'? ts-plugin(2820)

//this will work
literalProtocol = { protocol: 'http' }

//this will work
for (const protocol in EnumProtocol) {
  console.log(protocol, JSON.stringify(protocol))
}
//HTTP – "\"HTTP\""
//HTTPS – "\"HTTPS\""

//this will not work
for (const protocol in LiteralProtocol) {
  console.log(protocol)
}
//'LiteralProtocol' only refers to a type, but is being used as a value here. ts-plugin(2693)
```

