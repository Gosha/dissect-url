import { AnyEncoding } from "./encodings"

export type Primitive = string | KeyValuePair

export type Data = Primitive | AnyEncoding | AndDelimited

export interface KeyValuePair {
  _type: "pair"
  key: Data
  value: Primitive | AnyEncoding
}

export type AndDelimited = {
  _type: "array"
  raw: string
  contents: (Primitive | AnyEncoding)[]
}
